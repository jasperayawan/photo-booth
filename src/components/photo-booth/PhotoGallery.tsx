"use client";

import { Trash2 } from "lucide-react";
import { usePhotoBooth } from "../../contexts/PhotoBoothContext";
import PhotoCard from "./PhotoCard";
import CollageDownloader from "./CollageDownloader";

// Random positions for organic scattered look
const scatterStyles = [
  { rotation: -8, offsetX: 0, offsetY: 0 },
  { rotation: 5, offsetX: 10, offsetY: -15 },
  { rotation: -3, offsetX: -5, offsetY: 10 },
  { rotation: 7, offsetX: 15, offsetY: 5 },
  { rotation: -5, offsetX: -10, offsetY: -10 },
  { rotation: 4, offsetX: 5, offsetY: 15 },
  { rotation: -6, offsetX: -15, offsetY: 0 },
  { rotation: 3, offsetX: 0, offsetY: -5 },
  { rotation: -4, offsetX: 10, offsetY: 10 },
  { rotation: 6, offsetX: -5, offsetY: -15 },
];

export default function PhotoGallery() {
  const { state, openGallery, deletePhoto, clearPhotos } = usePhotoBooth();
  const { capturedPhotos } = state;

  if (capturedPhotos.length === 0) {
    return null;
  }

  return (
    <div className="mt-10 w-full">
      {/* Header */}
      <div className="flex items-center justify-center gap-4 mb-8">
        <div className="h-px bg-stone-400/30 flex-1 max-w-[100px]" />
        <h3 className="text-stone-500 text-xs uppercase tracking-widest">
          Your Memories
        </h3>
        <div className="h-px bg-stone-400/30 flex-1 max-w-[100px]" />
      </div>

      {/* Scattered polaroid layout */}
      <div className="relative flex flex-wrap gap-4 lg:gap-2 justify-center items-center min-h-[200px] py-4">
        {capturedPhotos.map((photo, index) => {
          const style = scatterStyles[index % scatterStyles.length];
          return (
            <PhotoCard
              key={photo.id}
              photo={photo}
              index={index}
              rotation={style.rotation}
              offsetX={style.offsetX}
              offsetY={style.offsetY}
              onView={openGallery}
              onDelete={deletePhoto}
            />
          );
        })}
      </div>

      {/* Clear button */}
      {capturedPhotos.length > 0 && (
        <div className="flex justify-center mt-6">
          <button
            onClick={clearPhotos}
            className="flex items-center gap-1.5 text-stone-400 text-xs hover:text-red-500 cursor-pointer transition-colors px-3 py-1.5 rounded-full hover:bg-white/50"
            title="Clear all photos"
          >
            <Trash2 size={12} />
            Clear all photos
          </button>
        </div>
      )}

      {/* Collage/Strip Downloader */}
      <CollageDownloader />
    </div>
  );
}
