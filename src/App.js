import React, { useState, useEffect, useCallback, useRef } from 'react';
import { Camera, Gift, Coins, RotateCcw, CheckCircle, Circle, X, MapPin, Info, Trophy } from 'lucide-react';
import { BrowserRouter as Router, useSearchParams } from 'react-router-dom';
import { v4 as uuidv4 } from 'uuid';

// Utils
const getUserUUID = () => {
    let uuid = localStorage.getItem('user_uuid');
    if (!uuid) {
        uuid = 'user-' + Math.random().toString(36).substring(2, 15) + Math.random().toString(36).substring(2, 15);
        localStorage.setItem('user_uuid', uuid);
    }
    return uuid;
};

// API Configuration
const API_BASE_URL = 'https://kate-voice-backend-2ad12d55f690.herokuapp.com/';

// API calls
const api = {
    async scanQR(userUuid, qrData) {
        try {
            const response = await fetch(`${API_BASE_URL}/scan`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ userUuid, qrData }),
            });
            return await response.json();
        } catch (error) {
            console.error('API Error:', error);
            throw error;
        }
    },
    async getUserProgress(userUuid) {
        try {
            const response = await fetch(`${API_BASE_URL}/user/${userUuid}/progress`);
            return await response.json();
        } catch (error) {
            console.error('API Error:', error);
            throw error;
        }
    },
    async claimReward(userUuid, choice) {
        try {
            const response = await fetch(`${API_BASE_URL}/reward`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ userUuid, rewardType: choice, timestamp: new Date().toISOString() }),
            });
            return await response.json();
        } catch (error) {
            console.error('API Error:', error);
            throw error;
        }
    }
};

// Component to display the scan result
const ScanResultPage = ({ result, onContinue }) => {
    const { success, message, additionalInfo } = result;

    return (
        <div className="min-h-screen bg-[#0050A4] text-white flex flex-col items-center justify-center p-4 text-center">
            {success ? (
                <CheckCircle className="w-16 h-16 text-white mx-auto mb-4" />
            ) : (
                <X className="w-16 h-16 text-white mx-auto mb-4" />
            )}
            
            <h2 className="text-2xl font-bold mb-3">{message}</h2>
            
            {additionalInfo && (
                <div className="text-center bg-white bg-opacity-10 border border-white border-opacity-20 p-4 rounded-lg my-6 max-w-sm">
                    <p>{additionalInfo}</p>
                </div>
            )}
            
            <button
                onClick={onContinue}
                className="mt-4 w-full max-w-xs bg-white text-[#0050A4] font-bold py-3 px-4 rounded-lg transition-colors hover:bg-gray-200"
            >
                Bekijk mijn voortgang
            </button>
        </div>
    );
};

// Progress Tracker Component
const ProgressTracker = ({ scannedLocations = [], totalCoins }) => {
    const locations = [1, 2, 3];
    return (
        <div className="rounded-lg p-6 mb-6">
            <h2 className="text-xl font-bold text-gray-800 mb-4 text-center">Spelvoortgang</h2>
            <div className="bg-gradient-to-r from-yellow-400 to-yellow-600 rounded-lg p-4 mb-6">
                <div className="flex items-center justify-center space-x-3">
                    <Coins className="w-8 h-8 text-white" />
                    <span className="text-2xl font-bold text-white">{totalCoins} credits</span>
                </div>
            </div>
            <div className="flex justify-center items-center space-x-8 mb-4">
                {locations.map(locationId => {
                    const isScanned = scannedLocations.some(loc => loc.locationId === locationId);
                    return (
                        <div key={locationId} className="flex flex-col items-center">
                            {isScanned ? (
                                <CheckCircle className="w-16 h-16 text-green-500 mb-2" />
                            ) : (
                                <Circle className="w-16 h-16 text-gray-300 mb-2" />
                            )}
                            <span className={`text-sm font-medium ${isScanned ? 'text-green-600' : 'text-gray-400'}`}>
                                QR {locationId}
                            </span>
                        </div>
                    );
                })}
            </div>
            <div className="text-center">
                <span className="text-lg font-semibold text-gray-700">
                    {scannedLocations.length}/3 QR-codes gescand
                </span>
            </div>
            <div className="mt-4">
                <div className="w-full bg-gray-200 rounded-full h-3">
                    <div
                        className="bg-gradient-to-r from-[#0050A4] to-[#003A7A] h-3 rounded-full transition-all duration-500 ease-out"
                        style={{ width: `${(scannedLocations.length / 3) * 100}%` }}
                    ></div>
                </div>
            </div>
        </div>
    );
};

// Reward Modal Component
const RewardModal = ({ isOpen, onClose, onChoose }) => {
    if (!isOpen) return null;
    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-lg p-8 max-w-md w-full text-center">
                <div className="mb-6">
                    <Trophy className="w-16 h-16 text-yellow-500 mx-auto mb-4" />
                    <h2 className="text-2xl font-bold text-gray-800 mb-2">🎉 Proficiat!</h2>
                    <p className="text-gray-600">Je hebt alle QR-codes gescand! Tijd voor de hoofdprijs!</p>
                </div>
                <div className="space-y-4">
                    <p className="text-lg font-semibold text-gray-700 mb-4">Kies je beloning:</p>
                    <button
                        onClick={() => onChoose('coins')}
                        className="w-full bg-yellow-500 hover:bg-yellow-600 text-white font-bold py-3 px-4 rounded-lg inline-flex items-center justify-center space-x-2 transition-colors"
                    >
                        <Coins className="w-5 h-5" />
                        <span>+50 credits onmiddellijk</span>
                    </button>
                    <button
                        onClick={() => onChoose('wheel')}
                        className="w-full bg-[#0050A4] hover:bg-[#003A7A] text-white font-bold py-3 px-4 rounded-lg inline-flex items-center justify-center space-x-2 transition-colors"
                    >
                        <RotateCcw className="w-5 h-5" />
                        <span>Rad van Fortuin (5 spins)</span>
                    </button>
                </div>
            </div>
        </div>
    );
};

// Wheel Spinner Component
const WheelSpinner = ({ spins, onSpin }) => {
    const [isSpinning, setIsSpinning] = useState(false);
    const [lastResult, setLastResult] = useState(null);

    const spin = async () => {
        if (spins <= 0 || isSpinning) return;
        setIsSpinning(true);
        setTimeout(() => {
            const results = [10, 20, 30, 50, 100, 5];
            const result = results[Math.floor(Math.random() * results.length)];
            setLastResult(result);
            setIsSpinning(false);
            onSpin(result);
        }, 2000);
    };

    if (spins <= 0) return null;

    return (
        <div className="rounded-lg p-6 mb-6">
            <h2 className="text-xl font-bold text-gray-800 mb-4 text-center">🎰 Rad van Fortuin</h2>
            <div className="text-center">
                <div className="mb-4">
                    <div className={`w-32 h-32 mx-auto border-8 border-[#0050A4] rounded-full flex items-center justify-center ${isSpinning ? 'animate-spin' : ''} bg-gradient-to-br from-[#E0F2F7] to-[#B2DAE8]`}>
                        <RotateCcw className={`w-16 h-16 text-[#0050A4] ${isSpinning ? 'animate-pulse' : ''}`} />
                    </div>
                </div>
                <p className="text-lg font-semibold text-gray-700 mb-4">
                    Je hebt nog {spins} spins
                </p>
                {lastResult !== null && (
                    <div className="mb-4 p-3 bg-green-100 border border-green-300 rounded-lg">
                        <p className="text-green-700 font-semibold">
                            🎉 Je hebt {lastResult} credits gewonnen!
                        </p>
                    </div>
                )}
                <button
                    onClick={spin}
                    disabled={isSpinning || spins <= 0}
                    className="bg-[#0050A4] hover:bg-[#003A7A] disabled:bg-gray-400 text-white font-bold py-3 px-6 rounded-lg transition-colors"
                >
                    {isSpinning ? 'Draaien...' : '🎲 Draai aan het rad'}
                </button>
            </div>
        </div>
    );
};

// Main App Component
const App = () => {
    const [userUuid] = useState(() => getUserUUID());
    const [scannedLocations, setScannedLocations] = useState([]);
    const [totalCoins, setTotalCoins] = useState(0);
    const [wheelSpins, setWheelSpins] = useState(0);
    const [showRewardModal, setShowRewardModal] = useState(false);
    const [loading, setLoading] = useState(true);
    const [scanResultView, setScanResultView] = useState(null);

    const [searchParams, setSearchParams] = useSearchParams();
    const locationIdFromUrl = searchParams.get('locationId');
    const scanProcessedRef = useRef(false);

    const loadUserProgress = useCallback(async () => {
        try {
            const progress = await api.getUserProgress(userUuid);
            setScannedLocations(progress.scannedLocations || []);
            setTotalCoins(progress.totalCoins || 0);
        } catch (error) {
            console.error('Error loading progress:', error);
        } finally {
            setLoading(false);
        }
    }, [userUuid]);

    const processScan = useCallback(async (qrData) => {
        if (scannedLocations.some(loc => loc.locationId === qrData.locationId)) {
            setScanResultView({
                success: false,
                message: 'Je hebt deze QR-code al gescand.',
                additionalInfo: 'Zoek de volgende code om verder te gaan.'
            });
            return;
        }

        try {
            const result = await api.scanQR(userUuid, qrData);

            if (result.success) {
                setScannedLocations(result.scannedLocations);
                setTotalCoins(result.totalCoins);

                const count = result.scannedLocations.length;
                const countTextMap = { 1: 'eerste', 2: 'tweede', 3: 'derde' };
                const message = `Je hebt met succes de ${countTextMap[count] || count + 'e'} QR-code gescand.`;
                
                const additionalInfo = `Dit is extra informatie over ${qrData.company}, gelegen op ${qrData.address}, weergegeven na een succesvolle scan. Bezoek onze website: ${qrData.website}`;

                setScanResultView({ success: true, message, additionalInfo });
                
                if (result.isGameComplete) {
                    setTimeout(() => setShowRewardModal(true), 1500);
                }
            } else {
                 setScanResultView({ success: false, message: result.message || 'Er is een fout opgetreden.' });
            }
        } catch (error) {
            setScanResultView({ success: false, message: 'Fout bij het verbinden met de server. Probeer het opnieuw.' });
        }
    }, [userUuid, scannedLocations]);

    const handleContinueToGame = () => {
        setSearchParams({}, { replace: true });
        setScanResultView(null);
    };

    const handleRewardChoice = async (choice) => {
        try {
            await api.claimReward(userUuid, choice);
            if (choice === 'coins') {
                setTotalCoins(prev => prev + 50);
            } else {
                setWheelSpins(5);
            }
            setShowRewardModal(false);
        } catch (error) {
            console.error('Error claiming reward:', error);
            if (choice === 'coins') setTotalCoins(prev => prev + 50);
            else setWheelSpins(5);
            setShowRewardModal(false);
        }
    };

    const handleWheelSpin = (result) => {
        setWheelSpins(prev => prev - 1);
        const newTotal = totalCoins + result;
        setTotalCoins(newTotal);
    };

    const demoQRData = {
        1: { locationId: 1, company: "Tech Solutions Ltd", address: "Vitosha Boulevard 123, Sofia", description: "Leading IT company in Bulgaria, specializing in web development and digital marketing.", website: "https://techsolutions.bg", bonus: 10 },
        2: { locationId: 2, company: "Green Energy Co", address: "Rakovski Street 45, Plovdiv", description: "Innovative solutions for renewable energy and sustainable development.", website: "https://greenenergy.bg", bonus: 15 },
        3: { locationId: 3, company: "Digital Marketing Hub", address: "Independence Square 1, Varna", description: "Creative digital campaigns and growth strategies for your business.", website: "https://digitalmarketing.bg", bonus: 20 }
    };

    useEffect(() => {
        loadUserProgress();
    }, [loadUserProgress]);

    useEffect(() => {
        if (!loading && locationIdFromUrl && !scanProcessedRef.current) {
            const qrData = demoQRData[locationIdFromUrl];
            if (qrData) {
                scanProcessedRef.current = true;
                processScan(qrData);
            }
        }
    }, [loading, locationIdFromUrl, processScan]);

    if (loading) {
        return (
            <div className="min-h-screen bg-[#0050A4] flex items-center justify-center">
                <div className="text-center">
                    <RotateCcw className="w-8 h-8 animate-spin text-white mx-auto mb-2" />
                    <p className="text-white">Laden...</p>
                </div>
            </div>
        );
    }
    
    if (scanResultView) {
        return <ScanResultPage result={scanResultView} onContinue={handleContinueToGame} />;
    }

    return (
        // Основен фон на приложението в KBC синьо
        <div className="min-h-screen bg-[#0050A4] py-8 px-4">
            <div className="max-w-md mx-auto">
                {/* Заглавие в бял цвят */}
                <h1 className="text-3xl font-bold text-center text-white mb-8">
                    🎯 QR Avontuur
                </h1>
                <ProgressTracker
                    scannedLocations={scannedLocations}
                    totalCoins={totalCoins}
                />
                {scannedLocations.length < 3 && (
                    <div className="rounded-lg p-6 mb-6 text-center text-white">
                        <p className="text-gray-600">
                            Scan de volgende QR-code met de camera van je telefoon om het avontuur voort te zetten.
                        </p>
                    </div>
                )}
                <WheelSpinner
                    spins={wheelSpins}
                    onSpin={handleWheelSpin}
                />
                <RewardModal
                    isOpen={showRewardModal}
                    onClose={() => setShowRewardModal(false)}
                    onChoose={handleRewardChoice}
                />
                {/* Информация за потребителя в KBC синьо, но с бял текст */}
                <div className="mt-8 p-4 bg-[#003A7A] bg-opacity-70 rounded-lg text-sm">
                    <p className="font-mono text-center text-white">
                        UUID: {userUuid.substring(0, 12)}...
                    </p>
                </div>
            </div>
        </div>
    );
}

// Wrap the App component with Router to enable useSearchParams
export default function WrappedApp() {
    return (
        <Router>
            <App />
        </Router>
    );
}