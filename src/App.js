import React, { useState, useEffect, useCallback, useRef } from 'react';
import { Camera, Gift, Coins, RotateCcw, CheckCircle, Circle, X, MapPin, Info, Trophy } from 'lucide-react';
import { BrowserRouter as Router, useSearchParams } from 'react-router-dom';

// Utils
const getUserUUID = () => {
  let uuid = localStorage.getItem('user_uuid');
  if (!uuid) {
    uuid = uuidv4(); // Генерира валиден UUID
    localStorage.setItem('user_uuid', uuid);
  }
  return uuid;
};

// API Configuration - Replace with your Heroku backend URL
const API_BASE_URL = 'https://kate-voice-backend-2ad12d55f690.herokuapp.com/';

// API calls
const api = {
  async scanQR(userUuid, qrData) {
    try {
      const response = await fetch(`${API_BASE_URL}/scan`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          userUuid,
          qrData
        }),
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
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          userUuid,
          rewardType: choice,
          timestamp: new Date().toISOString()
        }),
      });
      return await response.json();
    } catch (error) {
      console.error('API Error:', error);
      throw error;
    }
  }
};

// QR Information Display Component
const QRInfoModal = ({ isOpen, qrData, onClose, onConfirm }) => {
  if (!isOpen || !qrData) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg max-w-md w-full max-h-[90vh] overflow-y-auto">
        <div className="p-6">
          <div className="flex justify-between items-start mb-4">
            <h2 className="text-xl font-bold text-gray-800">Информация за локацията</h2>
            <button
              onClick={onClose}
              className="text-gray-400 hover:text-gray-600 transition-colors"
            >
              <X className="w-6 h-6" />
            </button>
          </div>
          
          <div className="space-y-4">
            <div className="flex items-start space-x-3">
              <Info className="w-5 h-5 text-blue-500 mt-1 flex-shrink-0" />
              <div>
                <h3 className="font-semibold text-gray-800">{qrData.company}</h3>
                <p className="text-gray-600 text-sm mt-1">{qrData.description}</p>
              </div>
            </div>
            
            <div className="flex items-start space-x-3">
              <MapPin className="w-5 h-5 text-red-500 mt-1 flex-shrink-0" />
              <div>
                <p className="text-gray-700">{qrData.address}</p>
              </div>
            </div>
            
            {qrData.website && (
              <div className="flex items-start space-x-3">
                <div className="w-5 h-5 text-green-500 mt-1 flex-shrink-0">🌐</div>
                <div>
                  <a 
                    href={qrData.website}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-blue-600 hover:text-blue-800 underline"
                  >
                    {qrData.website}
                  </a>
                </div>
              </div>
            )}
            
            <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-3">
              <div className="flex items-center space-x-2">
                <Coins className="w-5 h-5 text-yellow-600" />
                <span className="font-semibold text-yellow-800">
                  Бонус: +{qrData.bonus} кредита
                </span>
              </div>
            </div>
          </div>
          
          <div className="flex space-x-3 mt-6">
            <button
              onClick={onClose}
              className="flex-1 bg-gray-200 hover:bg-gray-300 text-gray-800 font-medium py-2 px-4 rounded-lg transition-colors"
            >
              Отказ
            </button>
            <button
              onClick={onConfirm}
              className="flex-1 bg-blue-600 hover:bg-blue-700 text-white font-medium py-2 px-4 rounded-lg transition-colors"
            >
              Потвърди
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

// Progress Tracker Component
const ProgressTracker = ({ scannedLocations = [], totalCoins }) => {
  const locations = [1, 2, 3];
  
  return (
    <div className="bg-white rounded-lg shadow-lg p-6 mb-6">
      <h2 className="text-xl font-bold text-gray-800 mb-4 text-center">Прогрес на играта</h2>
      
      {/* Coins display */}
      <div className="bg-gradient-to-r from-yellow-400 to-yellow-600 rounded-lg p-4 mb-6">
        <div className="flex items-center justify-center space-x-3">
          <Coins className="w-8 h-8 text-white" />
          <span className="text-2xl font-bold text-white">{totalCoins} кредита</span>
        </div>
      </div>
      
      {/* Progress indicators */}
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
          {scannedLocations.length}/3 QR кода сканирани
        </span>
      </div>
      
      {/* Progress bar */}
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
          <h2 className="text-2xl font-bold text-gray-800 mb-2">🎉 Поздравления!</h2>
          <p className="text-gray-600">Сканирахте всички QR кодове! Време е за финалната награда!</p>
        </div>
        
        <div className="space-y-4">
          <p className="text-lg font-semibold text-gray-700 mb-4">Изберете наградата си:</p>
          
          <button
            onClick={() => onChoose('coins')}
            className="w-full bg-yellow-500 hover:bg-yellow-600 text-white font-bold py-3 px-4 rounded-lg inline-flex items-center justify-center space-x-2 transition-colors"
          >
            <Coins className="w-5 h-5" />
            <span>+50 кредита веднага</span>
          </button>
          
          <button
            onClick={() => onChoose('wheel')}
            className="w-full bg-purple-600 hover:bg-purple-700 text-white font-bold py-3 px-4 rounded-lg inline-flex items-center justify-center space-x-2 transition-colors"
          >
            <RotateCcw className="w-5 h-5" />
            <span>Колело на късмета (5 завъртания)</span>
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
      const results = [10, 20, 30, 50, 100, 5]; // possible coin rewards
      const result = results[Math.floor(Math.random() * results.length)];
      setLastResult(result);
      setIsSpinning(false);
      onSpin(result);
    }, 2000);
  };

  if (spins <= 0) return null;

  return (
    <div className="bg-white rounded-lg shadow-lg p-6 mb-6">
      <h2 className="text-xl font-bold text-gray-800 mb-4 text-center">🎰 Колело на късмета</h2>
      
      <div className="text-center">
        <div className="mb-4">
          <div className={`w-32 h-32 mx-auto border-8 border-purple-500 rounded-full flex items-center justify-center ${isSpinning ? 'animate-spin' : ''} bg-gradient-to-br from-purple-100 to-purple-200`}>
            <RotateCcw className={`w-16 h-16 text-purple-600 ${isSpinning ? 'animate-pulse' : ''}`} />
          </div>
        </div>
        
        <p className="text-lg font-semibold text-gray-700 mb-4">
          Остават ви {spins} завъртания
        </p>
        
        {lastResult !== null && (
          <div className="mb-4 p-3 bg-green-100 border border-green-300 rounded-lg">
            <p className="text-green-700 font-semibold">
              🎉 Спечелихте {lastResult} кредита!
            </p>
          </div>
        )}
        
        <button
          onClick={spin}
          disabled={isSpinning || spins <= 0}
          className="bg-purple-600 hover:bg-purple-700 disabled:bg-gray-400 text-white font-bold py-3 px-6 rounded-lg transition-colors"
        >
          {isSpinning ? 'Завърта се...' : '🎲 Завърти колелото'}
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
  const [showQRInfo, setShowQRInfo] = useState(false);
  const [currentQRData, setCurrentQRData] = useState(null);
  const [showRewardModal, setShowRewardModal] = useState(false);
  const [loading, setLoading] = useState(true);
  
  const [searchParams] = useSearchParams();
  const locationIdFromUrl = searchParams.get('locationId');

  const loadUserProgress = useCallback(async () => {
    try {
      const progress = await api.getUserProgress(userUuid);
      setScannedLocations(progress.scannedLocations || []);
      setTotalCoins(progress.totalCoins || 0);
      setLoading(false);
    } catch (error) {
      console.error('Error loading progress:', error);
      // Fallback to localStorage for demo
      const localScanned = JSON.parse(localStorage.getItem(`scanned_${userUuid}`) || '[]');
      const localCoins = parseInt(localStorage.getItem(`coins_${userUuid}`) || '0');
      setScannedLocations(localScanned);
      setTotalCoins(localCoins);
      setLoading(false);
    }
  }, [userUuid]);

  const handleQRScan = (qrData) => {
    // Check if already scanned
    if (scannedLocations.some(loc => loc.locationId === qrData.locationId)) {
      alert('Вече сте сканирали QR кода на това място!');
      return;
    }
    
    // Show QR info modal
    setCurrentQRData(qrData);
    setShowQRInfo(true);
  };

const handleQRConfirm = async () => {
    if (!currentQRData) return;

    try {
      // Изпращаме заявка към бекенда с данните от QR кода
      const result = await api.scanQR(userUuid, currentQRData);

      if (result.success) {
        // Обновяваме състоянието на играта с данните от бекенда
        setScannedLocations(result.scannedLocations);
        setTotalCoins(result.totalCoins);

        setShowQRInfo(false);
        setCurrentQRData(null);

        // Проверяваме дали играта е завършена, базирано на флага от бекенда
        if (result.isGameComplete) {
          // Ако е завършена, показваме модалния прозорец за награда
          setTimeout(() => setShowRewardModal(true), 1000);
        }
      }
    } catch (error) {
      console.error('Error scanning QR:', error);
      alert('Грешка при сканиране на QR кода! Опитайте отново.');
    }
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
      // Fallback for demo
      if (choice === 'coins') {
        setTotalCoins(prev => prev + 50);
      } else {
        setWheelSpins(5);
      }
      setShowRewardModal(false);
    }
  };

  const handleWheelSpin = (result) => {
    setWheelSpins(prev => prev - 1);
    const newTotal = totalCoins + result;
    setTotalCoins(newTotal);
    localStorage.setItem(`coins_${userUuid}`, newTotal.toString());
  };
  
  const demoQRData = {
    1: {
      locationId: 1,
      company: "Tech Solutions Ltd",
      address: "бул. Витоша 123, София",
      description: "Водеща IT компания в България със специализация в уеб разработка и дигитален маркетинг.",
      website: "https://techsolutions.bg",
      bonus: 10
    },
    2: {
      locationId: 2,
      company: "Green Energy Co",
      address: "ул. Раковски 45, Пловдив", 
      description: "Иновативни решения за възобновяема енергия и устойчиво развитие.",
      website: "https://greenenergy.bg",
      bonus: 15
    },
    3: {
      locationId: 3,
      company: "Digital Marketing Hub",
      address: "пл. Независимост 1, Варна",
      description: "Креативни дигитални кампании и стратегии за растеж на вашия бизнес.",
      website: "https://digitalmarketing.bg", 
      bonus: 20
    }
  };
  
  useEffect(() => {
    loadUserProgress();
    
    // Check for QR data in URL on first load
    if (locationIdFromUrl) {
      const qrData = demoQRData[locationIdFromUrl];
      if (qrData) {
        handleQRScan(qrData);
      }
    }
  }, [loadUserProgress, locationIdFromUrl]);

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-purple-50 flex items-center justify-center">
        <div className="text-center">
          <RotateCcw className="w-8 h-8 animate-spin text-blue-600 mx-auto mb-2" />
          <p className="text-gray-600">Зарежда се...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-purple-50 py-8 px-4">
      <div className="max-w-md mx-auto">
        <h1 className="text-3xl font-bold text-center text-gray-800 mb-8">
          🎯 QR Приключение
        </h1>
        
        <ProgressTracker 
          scannedLocations={scannedLocations} 
          totalCoins={totalCoins} 
        />
        
        {scannedLocations.length < 3 && (
            <div className="bg-white rounded-lg shadow-lg p-6 mb-6 text-center">
                <p className="text-gray-600">
                    Моля, сканирайте следващия QR код с камерата на телефона си, за да продължите приключението.
                </p>
            </div>
        )}

        <WheelSpinner 
          spins={wheelSpins} 
          onSpin={handleWheelSpin}
        />
        
        <QRInfoModal
          isOpen={showQRInfo}
          qrData={currentQRData}
          onClose={() => {
            setShowQRInfo(false);
            setCurrentQRData(null);
          }}
          onConfirm={handleQRConfirm}
        />
        
        <RewardModal
          isOpen={showRewardModal}
          onClose={() => setShowRewardModal(false)}
          onChoose={handleRewardChoice}
        />
        
        {/* User Info */}
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