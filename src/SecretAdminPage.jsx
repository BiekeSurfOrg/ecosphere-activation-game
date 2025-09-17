import React, { useState } from 'react';
import { ArrowLeft, Camera, X } from 'lucide-react';
import { useZxing } from 'react-zxing';

const SecretAdminPage = () => {
  const [isScanning, setIsScanning] = useState(false);
  const [scanResult, setScanResult] = useState(null);
  const [error, setError] = useState(null);

  const handleDecodeResult = (result) => {
    console.log('QR Code detected:', result.getText());
    setIsScanning(false);
    setScanResult({
      text: result.getText(),
      format: result.getBarcodeFormat().toString(),
      timestamp: new Date().toLocaleString()
    });
  };

  const handleDecodeError = (err) => {
    // This is called for each failed decode attempt, so we don't show errors here
    console.log('Decode error (normal):', err);
  };

  const handleError = (err) => {
    console.error('Camera error:', err);
    setError('Camera error occurred. Please check camera permissions and try again.');
    setIsScanning(false);
  };

  const { ref, torch } = useZxing({
    onDecodeResult: handleDecodeResult,
    onDecodeError: handleDecodeError,
    onError: handleError,
    paused: !isScanning,
    constraints: {
      video: {
        facingMode: 'environment', // Use back camera
      },
    },
  });

  const startScanning = () => {
    setError(null);
    setScanResult(null);
    setIsScanning(true);
  };

  const stopScanning = () => {
    setIsScanning(false);
  };

  const handleBack = () => {
    stopScanning();
    setScanResult(null);
    setError(null);
  };

  const scanAgain = () => {
    setScanResult(null);
    setError(null);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-900 to-blue-700 relative">
      {/* Back Button */}
      <button
        onClick={handleBack}
        className="absolute top-4 left-4 z-10 bg-white bg-opacity-20 hover:bg-opacity-30 text-white p-2 rounded-full transition-all duration-200"
      >
        <ArrowLeft className="w-6 h-6" />
      </button>

      <div className="flex flex-col items-center justify-center min-h-screen p-4">
        {!isScanning && !scanResult && !error && (
          <div className="text-center">
            <h1 className="text-4xl font-bold text-white mb-8">Secret Admin</h1>
            <button
              onClick={startScanning}
              className="bg-white text-blue-900 font-bold py-4 px-8 rounded-lg text-xl hover:bg-gray-100 transition-colors duration-200 flex items-center space-x-3 mx-auto"
            >
              <Camera className="w-6 h-6" />
              <span>Scan QR Code</span>
            </button>
          </div>
        )}

        {isScanning && (
          <div className="text-center">
            <h2 className="text-2xl font-bold text-white mb-4">Scanning QR Code...</h2>
            <div className="relative">
              <div className="w-80 h-80 rounded-lg overflow-hidden border-4 border-white">
                <video
                  ref={ref}
                  className="w-full h-full object-cover"
                  style={{ transform: 'scaleX(-1)' }} // Mirror the video
                />
              </div>
              {torch.isAvailable && (
                <button
                  onClick={torch.isOn ? torch.off : torch.on}
                  className="absolute top-2 left-2 bg-blue-500 hover:bg-blue-600 text-white p-2 rounded-full transition-colors"
                >
                  {torch.isOn ? '🔦' : '💡'}
                </button>
              )}
              <button
                onClick={stopScanning}
                className="absolute top-2 right-2 bg-red-500 hover:bg-red-600 text-white p-2 rounded-full transition-colors"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
            <p className="text-white mt-4">Point your camera at a QR code</p>
            {torch.isAvailable && (
              <p className="text-white text-sm mt-2">
                {torch.isOn ? 'Flashlight is on' : 'Tap the light icon to turn on flashlight'}
              </p>
            )}
          </div>
        )}

        {error && (
          <div className="text-center">
            <h2 className="text-2xl font-bold text-white mb-4">Error</h2>
            <div className="bg-red-500 bg-opacity-20 border border-red-300 rounded-lg p-6 mb-4">
              <p className="text-white">{error}</p>
            </div>
            <button
              onClick={scanAgain}
              className="bg-white text-blue-900 font-bold py-3 px-6 rounded-lg hover:bg-gray-100 transition-colors"
            >
              Try Again
            </button>
          </div>
        )}

        {scanResult && (
          <div className="text-center">
            <h2 className="text-2xl font-bold text-white mb-4">QR Code Information</h2>
            <div className="bg-white bg-opacity-20 border border-white border-opacity-30 rounded-lg p-6 mb-6 max-w-md">
              <div className="space-y-3">
                <div>
                  <label className="block text-white text-sm font-semibold mb-1">Content:</label>
                  <p className="text-white text-lg font-mono break-all bg-black bg-opacity-30 p-2 rounded">
                    {scanResult.text}
                  </p>
                </div>
                <div>
                  <label className="block text-white text-sm font-semibold mb-1">Format:</label>
                  <p className="text-white">{scanResult.format}</p>
                </div>
                <div>
                  <label className="block text-white text-sm font-semibold mb-1">Scanned at:</label>
                  <p className="text-white">{scanResult.timestamp}</p>
                </div>
              </div>
            </div>
            <button
              onClick={scanAgain}
              className="bg-white text-blue-900 font-bold py-3 px-6 rounded-lg hover:bg-gray-100 transition-colors"
            >
              Scan Another QR Code
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default SecretAdminPage;
