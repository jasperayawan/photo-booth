"use client";

import { Frame as FrameIcon } from "lucide-react";
import { frames } from "../../data/filters";
import { usePhotoBooth } from "../../contexts/PhotoBoothContext";

export default function FrameSelector() {
  const { state, setSelectedFrame } = usePhotoBooth();
  const { selectedFrame, isCountingDown } = state;

  return (
    <div>
      <h3 className="text-stone-500 text-xs uppercase tracking-wide mb-3 flex items-center gap-2">
        <FrameIcon className="w-3.5 h-3.5" />
        Frames
      </h3>
      <div className="flex flex-wrap gap-1.5">
        {frames.map((frame) => {
          const isSelected = selectedFrame.name === frame.name;
          return (
            <button
              key={frame.name}
              onClick={() => setSelectedFrame(frame)}
              disabled={isCountingDown}
              className={`
                text-xs px-2.5 py-1.5 rounded-md
                cursor-pointer transition-colors duration-150
                disabled:opacity-50 disabled:cursor-not-allowed
                ${isSelected
                  ? "bg-stone-700 text-white"
                  : "bg-stone-200/50 text-stone-600 hover:bg-stone-200"
                }
              `}
            >
              {frame.name}
            </button>
          );
        })}
      </div>
    </div>
  );
}
