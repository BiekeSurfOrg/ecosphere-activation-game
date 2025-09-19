import React, { useState } from 'react';

// Компонент с изображение и текст, с активно и неактивно състояние
export const ScanQrCode = () => {
  // Състояние за превключване между активно и неактивно
  const [isActive, setIsActive] = useState(false);

  // Обработчик на клик
  const handleToggle = () => {
    setIsActive(!isActive);
  };

  // URL адреси на примерни изображения. Заменете ги с вашите.
  const mainImageUrl = '../public/notScannedQr.png';
  const overlayImageUrl = './public/scannedQr.png';

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100 p-4">
      {/* Контейнер на компонента */}
      <div className="flex items-center space-x-6 p-6 bg-white rounded-lg shadow-xl">
        {/* Контейнер за изображението */}
        <div className="relative">
          {/* Основно изображение */}
          <img
            src={mainImageUrl}
            alt="Основно изображение"
            className="w-40 h-40 rounded-lg"
          />
          {/* Условно рендериране на наслагващото изображение, когато е активно */}
          {isActive && (
            <div className="absolute inset-0 flex items-center justify-center">
              <img
                src={overlayImageUrl}
                alt="Активен индикатор"
                className="w-12 h-12 rounded-full border-4 border-white"
              />
            </div>
          )}
        </div>
        {/* Контейнер за текста, центриран спрямо изображението */}
        <div className="flex flex-col justify-center text-center">
          <p className="text-xl font-bold text-gray-800">
            {isActive ? "Активен" : "Неактивен"}
          </p>
          <p className="text-sm text-gray-600">
            {isActive ? "Състоянието е активно." : "Състоянието е неактивно."}
          </p>
        </div>
      </div>

      {/* Бутон за превключване на състоянието */}
      <button
        onClick={handleToggle}
        className="mt-6 px-6 py-3 rounded-full text-white font-semibold transition-colors duration-200"
        style={{ backgroundColor: isActive ? '#dc2626' : '#2563eb' }}
      >
        {isActive ? "Превключи на неактивен" : "Превключи на активен"}
      </button>
    </div>
  );
};
