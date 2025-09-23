import React, { useState, useEffect, useCallback, useRef } from "react";
import {
  Camera,
  Gift,
  Coins,
  RotateCcw,
  CheckCircle,
  Circle,
  X,
  MapPin,
  Info,
  Trophy,
  LockOpen,
} from "lucide-react";
import {
  BrowserRouter as Router,
  useSearchParams,
  Routes,
  Route,
} from "react-router-dom";
import { v4 as uuidv4 } from "uuid";
import { QRCodeSVG } from "qrcode.react";
import SecretAdminPage from "./SecretAdminPage";
import FirstScreen from "./successful-scan-components/first-screen";
import SecondScreen from "./successful-scan-components/second-screen";
import ThirdScreen from "./successful-scan-components/third-screen";
import QRCodeContainer from "./QRcodeContainer/QRCodeContainer";
import DummyScreen from "./successful-scan-components/dummy-screen";

// Utils
const getUserUUID = () => {
  let uuid = localStorage.getItem("user_uuid");
  if (!uuid) {
    uuid =
      "user-" +
      Math.random().toString(36).substring(2, 15) +
      Math.random().toString(36).substring(2, 15);
    localStorage.setItem("user_uuid", uuid);
  }
  return uuid;
};

// API Configuration
const API_BASE_URL = "https://kate-voice-backend-2ad12d55f690.herokuapp.com/";

// API calls
const api = {
  async scanQR(userUuid, qrData) {
    try {
      const response = await fetch(`${API_BASE_URL}/scan`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ userUuid, qrData }),
      });
      return await response.json();
    } catch (error) {
      console.error("API Error:", error);
      throw error;
    }
  },
  async getUserProgress(userUuid) {
    try {
      const response = await fetch(`${API_BASE_URL}/user/${userUuid}/progress`);
      return await response.json();
    } catch (error) {
      console.error("API Error:", error);
      throw error;
    }
  },
  async claimReward(userUuid, choice) {
    try {
      const response = await fetch(`${API_BASE_URL}/check/reward?userUuid=${userUuid}`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ rewardType: choice })
      });
      return await response.json();
    } catch (error) {
      console.error("API Error:", error);
      throw error;
    }
  },
};

// --- Congratulations Page Component ---
const CongratulationsPage = ({ onContinue }) => {
  return (
    <div className="min-h-screen relative flex flex-col items-center justify-center text-center p-4">
      <div className="absolute inset-0 bg-blue-900 opacity-20"></div>
      <div className="relative p-4">
        <Trophy className="w-24 h-24 text-white mx-auto mb-6" />
        <h1 className="text-4xl font-bold mb-4">Proficiat!</h1>
        <p className="text-xl mb-8">Je hebt 5 Kate coins gewonnen.</p>
      </div>
    </div>
  );
};

const RewardQRPage = ({ userUuid }) => {
  const qrValue = userUuid; // Стойността на QR кода е UUID на потребителя

  return (
    <div className="min-h-screen relative flex flex-col items-center justify-center text-center p-4">
      <div className="absolute inset-0 bg-blue-900 opacity-20"></div>
      <div className="relative p-4">
        <h1 className="text-3xl font-bold mb-4">🎉 Claim Your Prize!</h1>
        <p className="text-xl mb-8">
          Scan the QR code below to claim your reward.
        </p>
        <div className="bg-white p-4 rounded-lg shadow-lg inline-block">
          <QRCodeSVG
            value={qrValue}
            size={256}
            level="H"
            marginSize={4}
            title="winning QR code"
            fgColor="#0d2a50"
          />
        </div>
      </div>
    </div>
  );
};

// Component to display the scan result
const ScanResultPage = ({
  result,
  onContinue,
  isGameComplete,
  locationId,
  scannedLocations,
}) => {
  const { success, message, additionalInfo } = result;

  if (locationId == 1 || locationId == "1") {
    return (
      <div>
        <FirstScreen />
        <QRCodeContainer scannedQRs={scannedLocations || []} />

        {/* No idea why there's tailwind here /: */}
        <h2 className="text-2xl font-bold mb-3">{message}</h2>
        {isGameComplete && (
          <div>
            <button onClick={onContinue} className="button-claim-prize">
              Claim your prize!
              <LockOpen />
            </button>
            <br />
          </div>
        )}
      </div>
    );
  }

  if (locationId == 2 || locationId == "2") {
    return (
      <div>
        <SecondScreen />
        <QRCodeContainer scannedQRs={scannedLocations || []} />
      </div>
    );
  }

  if (locationId == 1500 || locationId == "1500") {
    return (
      <div style={{ height: "fit-content" }}>
        <ThirdScreen />
        <QRCodeContainer scannedQRs={scannedLocations || []} />
      </div>
    );
  }

  // if (locationId == 42 || locationId == "42") {
  //   return (
  //     <div style={{ height: "fit-content" }}>
  //       <DummyScreen />
  //       <QRCodeContainer scannedQRs={scannedLocations || []} />
  //     </div>
  //   );
  // }

  return (
    <div>
      <p>Error, something happened</p>
    </div>
  );
};

// Progress Tracker Component
const ProgressTracker = ({ scannedLocations = [], totalCoins }) => {
  const locations = [1, 2, 1500];
  return (
    <div className="rounded-lg p-6 mb-6">
      <h2 className="text-xl font-bold text-gray-800 mb-4 text-center">
        Spelvoortgang
      </h2>
      <div className="bg-gradient-to-r from-yellow-400 to-yellow-600 rounded-lg p-4 mb-6">
        <div className="flex items-center justify-center space-x-3">
          <Coins className="w-8 h-8 text-white" />
          <span className="text-2xl font-bold text-white">
            {totalCoins} credits
          </span>
        </div>
      </div>
      <div className="flex justify-center items-center space-x-8 mb-4">
        {locations.map((locationId) => {
          const isScanned = scannedLocations.some(
            (loc) => loc.locationId === locationId
          );
          return (
            <div key={locationId} className="flex flex-col items-center">
              {isScanned ? (
                <CheckCircle className="w-16 h-16 text-green-500 mb-2" />
              ) : (
                <Circle className="w-16 h-16 text-gray-300 mb-2" />
              )}
              <span
                className={`text-sm font-medium ${
                  isScanned ? "text-green-600" : "text-gray-400"
                }`}
              >
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
            className="bg-gradient-to-r from-[#00BFFF] to-[#009ACD] h-3 rounded-full transition-all duration-500 ease-out"
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
          <h2 className="text-2xl font-bold text-gray-800 mb-2">
            🎉 Proficiat!
          </h2>
          <p className="text-gray-600">
            Je hebt alle QR-codes gescand! Tijd voor de hoofdprijs!
          </p>
        </div>
        <div className="space-y-4">
          <p className="text-lg font-semibold text-gray-700 mb-4">
            Kies je beloning:
          </p>
          <button
            onClick={() => onChoose("coins")}
            className="w-full bg-yellow-500 hover:bg-yellow-600 text-white font-bold py-3 px-4 rounded-lg inline-flex items-center justify-center space-x-2 transition-colors"
          >
            <Coins className="w-5 h-5" />
            <span>+50 credits onmiddellijk</span>
          </button>
          <button
            onClick={() => onChoose("wheel")}
            className="w-full bg-[#00BFFF] hover:bg-[#009ACD] text-white font-bold py-3 px-4 rounded-lg inline-flex items-center justify-center space-x-2 transition-colors"
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
      <h2 className="text-xl font-bold text-gray-800 mb-4 text-center">
        🎰 Rad van Fortuin
      </h2>
      <div className="text-center">
        <div className="mb-4">
          <div
            className={`w-32 h-32 mx-auto border-8 border-[#00BFFF] rounded-full flex items-center justify-center ${
              isSpinning ? "animate-spin" : ""
            } bg-gradient-to-br from-[#E0F2F7] to-[#B2DAE8]`}
          >
            <RotateCcw
              className={`w-16 h-16 text-[#00BFFF] ${
                isSpinning ? "animate-pulse" : ""
              }`}
            />
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
          className="bg-[#00BFFF] hover:bg-[#009ACD] disabled:bg-gray-400 text-white font-bold py-3 px-6 rounded-lg transition-colors"
        >
          {isSpinning ? "Draaien..." : "🎲 Draai aan het rad"}
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
  const [showCongratulations, setShowCongratulations] = useState(false);
  const [showRewardQR, setShowRewardQR] = useState(false);

  // Функциите трябва да бъдат дефинирани преди `return`
  const handleContinueToGame = () => {
    setSearchParams({}, { replace: true });
    setScanResultView(null);
  };
  const handleContinueFromCongratulations = () => {
    setShowCongratulations(false);
    setScanResultView(null);
  };

  const handleContinueToPrize = () => {
    setScanResultView(null);
    setShowCongratulations(true);
    setShowRewardQR(true);
  };

  const [searchParams, setSearchParams] = useSearchParams();
  const locationIdFromUrl = searchParams.get("locationId");
  const scanProcessedRef = useRef(false);

  const loadUserProgress = useCallback(async () => {
    try {
      const progress = await api.getUserProgress(userUuid);
      setScannedLocations(progress.scannedLocations || []);
      setTotalCoins(progress.totalCoins || 0);
    } catch (error) {
      console.error("Error loading progress:", error);
    } finally {
      setLoading(false);
    }
  }, [userUuid]);

  const processScan = useCallback(
    async (qrData) => {
      if (scannedLocations.length === 3) {
        setScanResultView({
          success: true,
          // message: "🎉 Je hebt alle QR-codes al gescand!",
          additionalInfo: `${qrData.company}
      ${qrData.address}
      ${qrData.website}`,
        });
        return;
      }

      // Ако вече е сканиран този QR, но играта не е завършена → стандартното съобщение
      if (
        scannedLocations.some((loc) => loc.locationId === qrData.locationId)
      ) {
        setScanResultView({
          success: false,
          message: "Je hebt deze QR-code al gescand.",
          additionalInfo: "Zoek de volgende code om verder te gaan.",
        });
        return;
      }

      try {
        const result = await api.scanQR(userUuid, qrData);

        if (result.success) {
          setScannedLocations(result.scannedLocations);
          setTotalCoins(result.totalCoins);

          const count = result.scannedLocations.length;
          const countTextMap = { 1: "eerste", 2: "tweede", 1500: "derde" };
          const message = `Je hebt met succes de ${
            countTextMap[count] || count + "e"
          } QR-code gescand.`;

          const additionalInfo = `${qrData.company}
      ${qrData.address}
      ${qrData.website}`;

          setScanResultView({ success: true, message, additionalInfo });
        } else {
          setScanResultView({
            success: false,
            message: result.message || "Er is een fout opgetreden.",
          });
        }
      } catch (error) {
        setScanResultView({
          success: false,
          message: "Fout bij het verbinden met de server. Probeer het opnieuw.",
        });
      }
    },
    [userUuid, scannedLocations]
  );

  const handleRewardChoice = async (choice) => {
    try {
      await api.claimReward(userUuid, choice);
      if (choice === "coins") {
        setTotalCoins((prev) => prev + 50);
      } else {
        setWheelSpins(5);
      }
      setShowRewardModal(false);
    } catch (error) {
      console.error("Error claiming reward:", error);
      if (choice === "coins") setTotalCoins((prev) => prev + 50);
      else setWheelSpins(5);
      setShowRewardModal(false);
    }
  };

  const handleWheelSpin = (result) => {
    setWheelSpins((prev) => prev - 1);
    const newTotal = totalCoins + result;
    setTotalCoins(newTotal);
  };

  const demoQRData = {
    1: {
      locationId: 1,
      company: "Hi Team Blue Colleague!",
      address:
        "Thanks for joining us on this Group Ecosphere Day. Make yourself ready for a day full of Group energy, lots of enthusiasm, inspiration and an enlightening view on the future of KBC.",
      description: "Jour journey starts NOW!",
      website:
        "Scan the QR-codes throughout the morning sessions in which Johan Thijs, Erik Luts and Karen Van De Woestyne will elaborate on the ecosphere strategy to activate to participate and win grand prizes! Enjoy your refreshing breakfast. At 9 o’clock we start with our Ecosphere Journey and this journey is all about the triple win.",
      bonus: 10,
    },
    2: {
      locationId: 2,
      company: "Green Energy Co",
      address: "Rakovski Street 45, Plovdiv",
      description:
        "Innovative solutions for renewable energy and sustainable development.",
      website: "https://greenenergy.bg",
      bonus: 15,
    },
    42: {
      locationId: 42,
      company: "Surf studio",
      address: "Leuven",
      description: "test page",
      bonus: 25,
    },
    1500: {
      locationId: 1500,
      company: "Digital Marketing Hub",
      address: "Independence Square 1, Varna",
      description:
        "Creative digital campaigns and growth strategies for your business.",
      website: "https://digitalmarketing.bg",
      bonus: 20,
    },
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
      <div className="min-h-screen bg-[#00BFFF] flex items-center justify-center">
        <div className="text-center">
          <RotateCcw className="w-8 h-8 animate-spin text-white mx-auto mb-2" />
          <p className="text-white">Laden...</p>
        </div>
      </div>
    );
  }
  if (showRewardQR) {
    return <RewardQRPage userUuid={userUuid} />;
  }
  if (showCongratulations) {
    return (
      <CongratulationsPage onContinue={handleContinueFromCongratulations} />
    );
  }

  if (scanResultView) {
    const isGameComplete = scannedLocations.length === 3;
    const continueHandler = isGameComplete
      ? handleContinueToPrize
      : handleContinueToGame;

    return (
      <ScanResultPage
        result={scanResultView}
        onContinue={continueHandler}
        isGameComplete={isGameComplete}
        locationId={locationIdFromUrl}
        scannedLocations={scannedLocations}
      />
    );
  }

  return (
    <div className="min-h-screen relative flex flex-col items-center justify-center text-center">
      <header className="sticky-header"></header>
      <div className="relative p-4">
        <h1 className="text-3xl font-bold text-black">
          Scan een QR-code om te beginnen.
        </h1>
      </div>
    </div>
  );
};

// Wrap the App component with Router to enable useSearchParams
export default function WrappedApp() {
  return (
    <Router>
      <Routes>
        <Route path="/secret-admin" element={<SecretAdminPage />} />
        <Route path="/*" element={<App />} />
      </Routes>
    </Router>
  );
}
