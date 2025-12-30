"use client";

import { Images } from "lucide-react";
import { photoCountOptions } from "../../data/filters";
import { usePhotoBooth } from "../../contexts/PhotoBoothContext";

export default function PhotoCountSelector() {
  const { state, setSelectedPhotoCount } = usePhotoBooth();
  const { selectedPhotoCount, isCountingDown } = state;

  return (
    <div>
      <h3 className="text-stone-500 text-xs uppercase tracking-wide mb-2 flex items-center gap-1.5">
        <Images className="w-3 h-3" />
        Burst
      </h3>
      <div className="flex gap-1">
        {photoCountOptions.map((count) => {
          const isSelected = selectedPhotoCount === count;
          return (
            <button
              key={count}
              onClick={() => setSelectedPhotoCount(count)}
              disabled={isCountingDown}
              className={`
                flex-1 py-1.5 rounded-md text-xs
                cursor-pointer transition-colors duration-150
                disabled:opacity-50 disabled:cursor-not-allowed
                ${isSelected
                  ? "bg-stone-700 text-white"
                  : "bg-stone-200/50 text-stone-600 hover:bg-stone-200"
                }
              `}
            >
              {count}
            </button>
          );
        })}
      </div>
    </div>
  );
}
