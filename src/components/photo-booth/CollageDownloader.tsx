"use client";

import { useState } from "react";
import { Download, Loader2 } from "lucide-react";
import { usePhotoBooth } from "../../contexts/PhotoBoothContext";
import {
  CollageLayout,
  LAYOUT_OPTIONS,
  downloadCollage,
} from "../../utils/collageGenerator";

export default function CollageDownloader() {
  const { state } = usePhotoBooth();
  const { capturedPhotos } = state;
  const [isDownloading, setIsDownloading] = useState(false);
  const [selectedLayout, setSelectedLayout] = useState<CollageLayout>("single");

  if (capturedPhotos.length === 0) {
    return null;
  }

  const handleDownload = async () => {
    if (capturedPhotos.length === 0 || isDownloading) return;

    setIsDownloading(true);
    try {
      await downloadCollage({
        layout: selectedLayout,
        photos: capturedPhotos,
        backgroundColor: "#ffffff",
        showLoveWords: true,
      });
    } catch (error) {
      console.error("Failed to generate collage:", error);
    } finally {
      setIsDownloading(false);
    }
  };

  const availableLayouts = LAYOUT_OPTIONS.filter(
    (layout) => capturedPhotos.length >= layout.minPhotos || layout.value === "single"
  );

  const selectedLayoutInfo = LAYOUT_OPTIONS.find((l) => l.value === selectedLayout);

  return (
    <div className="mt-10 flex justify-center">
      <div className="glass-panel p-5 w-full max-w-md">
        {/* Header */}
        <div className="flex items-center justify-center gap-3 mb-4">
          <div className="h-px bg-stone-400/30 flex-1" />
          <h4 className="text-stone-500 text-xs uppercase tracking-widest">
            Export
          </h4>
          <div className="h-px bg-stone-400/30 flex-1" />
        </div>

        {/* Layout selection */}
        <div className="flex justify-center gap-2 mb-4">
          {availableLayouts.map((layout) => {
            const isSelected = selectedLayout === layout.value;
            const isDisabled = capturedPhotos.length < layout.minPhotos;

            return (
              <button
                key={layout.value}
                onClick={() => setSelectedLayout(layout.value)}
                disabled={isDisabled}
                className={`
                  px-4 py-2 rounded-md text-xs font-medium
                  cursor-pointer transition-all duration-150
                  disabled:opacity-40 disabled:cursor-not-allowed
                  ${isSelected
                    ? "bg-stone-700 text-white shadow-md"
                    : "bg-white/60 text-stone-600 hover:bg-white"
                  }
                `}
                title={isDisabled ? `Need ${layout.minPhotos} photos` : layout.label}
              >
                {layout.label}
              </button>
            );
          })}
        </div>

        {/* Download button */}
        <button
          onClick={handleDownload}
          disabled={isDownloading || capturedPhotos.length === 0}
          className="
            w-full flex items-center justify-center gap-2
            bg-stone-700 text-white text-sm font-medium
            px-4 py-3 rounded-lg
            cursor-pointer transition-all duration-150
            hover:bg-stone-800 hover:shadow-lg
            disabled:opacity-50 disabled:cursor-not-allowed
          "
        >
          {isDownloading ? (
            <>
              <Loader2 className="w-4 h-4 animate-spin" />
              Creating your collage...
            </>
          ) : (
            <>
              <Download className="w-4 h-4" />
              Download {selectedLayoutInfo?.label}
            </>
          )}
        </button>
      </div>
    </div>
  );
}
