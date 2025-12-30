"use client";

import { Timer } from "lucide-react";
import { delayOptions } from "../../data/filters";
import { usePhotoBooth } from "../../contexts/PhotoBoothContext";

export default function TimerSelector() {
  const { state, setSelectedDelay } = usePhotoBooth();
  const { selectedDelay, isCountingDown } = state;

  return (
    <div>
      <h3 className="text-stone-500 text-xs uppercase tracking-wide mb-2 flex items-center gap-1.5">
        <Timer className="w-3 h-3" />
        Timer
      </h3>
      <div className="flex gap-1">
        {delayOptions.map((option) => {
          const isSelected = selectedDelay === option.value;
          return (
            <button
              key={option.value}
              onClick={() => setSelectedDelay(option.value)}
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
              {option.label}
            </button>
          );
        })}
      </div>
    </div>
  );
}
