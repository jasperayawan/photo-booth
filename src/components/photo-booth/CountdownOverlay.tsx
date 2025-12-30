"use client";

import { usePhotoBooth } from "../../contexts/PhotoBoothContext";

export default function CountdownOverlay() {
  const { state } = usePhotoBooth();
  const { isCountingDown, countdown, currentBurstCount, selectedPhotoCount } = state;

  if (!isCountingDown && currentBurstCount === 0) {
    return null;
  }

  return (
    <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2">
      {isCountingDown ? (
        <div className="flex flex-col items-center">
          <div className="text-6xl font-bold text-white mb-2 animate-pulse drop-shadow-lg">
            {countdown}
          </div>
          <div className="text-white text-sm drop-shadow">Get ready!</div>
        </div>
      ) : currentBurstCount > 0 ? (
        <div className="flex flex-col items-center">
          <div className="text-2xl font-bold text-white mb-2 drop-shadow-lg">
            {currentBurstCount}/{selectedPhotoCount}
          </div>
          <div className="text-white text-sm drop-shadow">Capturing...</div>
        </div>
      ) : null}
    </div>
  );
}
