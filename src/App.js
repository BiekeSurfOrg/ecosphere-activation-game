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
        <div className="min-h-screen bg-gradient-to-br from-blue-50 to-purple-50 flex items-center justify-center p-4">
            <div className="bg-white rounded-lg shadow-xl p-8 max-w-md w-full text-center">
                {success ? (
                    <CheckCircle className="w-16 h-16 text-green-500 mx-auto mb-4" />
                ) : (
                    <X className="w-16 h-16 text-red-500 mx-auto mb-4" />
                )}
                
                <h2 className="text-2xl font-bold text-gray-800 mb-3">{message}</h2>
                
                {additionalInfo && (
                    <div className="text-left bg-gray-50 border border-gray-200 p-4 rounded-lg my-6">
                        <p className="text-gray-700">{additionalInfo}</p>
                    </div>
                )}
                
                <button
                    onClick={onContinue}
                    className="mt-4 w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 px-4 rounded-lg transition-colors"
                >
                    Bekijk mijn voortgang
                </button>
            </div>
        </div>
    );
};

// Progress Tracker Component
const ProgressTracker = ({ scannedLocations = [], totalCoins }) => {
    const locations = [1, 2, 3];
    return (
        <div className="bg-white rounded-lg shadow-lg p-6 mb-6">
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
                        className="bg-gradient-to-r from-blue-500 to-purple-600 h-3 rounded-full transition-all duration-500 ease-out"
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
                        className="w-full bg-purple-600 hover:bg-purple-700 text-white font-bold py-3 px-4 rounded-lg inline-flex items-center justify-center space-x-2 transition-colors"
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
        <div className="bg-white rounded-lg shadow-lg p-6 mb-6">
            <h2 className="text-xl font-bold text-gray-800 mb-4 text-center">🎰 Rad van Fortuin</h2>
            <div className="text-center">
                <div className="mb-4">
                    <div className={`w-32 h-32 mx-auto border-8 border-purple-500 rounded-full flex items-center justify-center ${isSpinning ? 'animate-spin' : ''} bg-gradient-to-br from-purple-100 to-purple-200`}>
                        <RotateCcw className={`w-16 h-16 text-purple-600 ${isSpinning ? 'animate-pulse' : ''}`} />
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
                    className="bg-purple-600 hover:bg-purple-700 disabled:bg-gray-400 text-white font-bold py-3 px-6 rounded-lg transition-colors"
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
        
        // The backend determines if the game is complete
        if (result.isGameComplete) {
          setShowRewardModal(true);
        } else {
          const count = result.scannedLocations.length;
          const countTextMap = { 1: 'първия', 2: 'втория', 3: 'третия' };
          const message = `Успешно сканира ${countTextMap[count] || count + '-тия'} QR код.`;
          
          const additionalInfo = `Това е допълнителна информация за ${qrData.company}, показана след успешно сканиране. Бонус: +${qrData.bonus} кредита.`;
          setScanResultView({ success: true, message, additionalInfo });
        }
      } else {
        setScanResultView({ success: false, message: result.message || 'Възникна грешка.' });
      }
    } catch (error) {
      setScanResultView({ success: false, message: 'Грешка при свързване със сървъра. Моля, опитайте отново.' });
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
        1: { locationId: 1, company: "Tech Solutions Ltd", address: "Vitosha Boulevard 123, Sofia", description: "Leading IT company.", website: "https://techsolutions.bg", bonus: 10 },
        2: { locationId: 2, company: "Green Energy Co", address: "Rakovski Street 45, Plovdiv", description: "Innovative solutions.", website: "https://greenenergy.bg", bonus: 15 },
        3: { locationId: 3, company: "Digital Marketing Hub", address: "Independence Square 1, Varna", description: "Creative campaigns.", website: "https://digitalmarketing.bg", bonus: 20 }
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
            <div className="min-h-screen bg-gradient-to-br from-blue-50 to-purple-50 flex items-center justify-center">
                <div className="text-center">
                    <RotateCcw className="w-8 h-8 animate-spin text-blue-600 mx-auto mb-2" />
                    <p className="text-gray-600">Laden...</p>
                </div>
            </div>
        );
    }
    
    if (scanResultView) {
        return <ScanResultPage result={scanResultView} onContinue={handleContinueToGame} />;
    }

    return (
        <div className="min-h-screen bg-gradient-to-br from-blue-50 to-purple-50 py-8 px-4">
            <div className="max-w-md mx-auto">
                <h1 className="text-3xl font-bold text-center text-gray-800 mb-8">
                    🎯 QR Avontuur
                </h1>
                <ProgressTracker
                    scannedLocations={scannedLocations}
                    totalCoins={totalCoins}
                />
                {scannedLocations.length < 3 && (
                    <div className="bg-white rounded-lg shadow-lg p-6 mb-6 text-center">
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
                <div className="mt-8 p-4 bg-white bg-opacity-50 rounded-lg text-sm">
                    <p className="font-mono text-center text-gray-600">
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