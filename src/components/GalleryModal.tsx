"use client";

import { useEffect, useCallback, useState } from "react";
import {
  ChevronLeft,
  ChevronRight,
  X,
  Download,
  Trash2,
} from "lucide-react";
import { usePhotoBooth } from "@/contexts/PhotoBoothContext";
import { downloadPhoto } from "@/utils/photoExport";

export default function GalleryModal() {
  const { state, closeGallery, navigateGallery, deletePhoto } = usePhotoBooth();
  const { showGallery, galleryPhoto, galleryIndex, capturedPhotos } = state;
  const [isVisible, setIsVisible] = useState(false);
  const [isClosing, setIsClosing] = useState(false);

  const totalPhotos = capturedPhotos.length;

  // Animation on open
  useEffect(() => {
    if (showGallery) {
      // Small delay for mount animation
      requestAnimationFrame(() => setIsVisible(true));
    } else {
      setIsVisible(false);
      setIsClosing(false);
    }
  }, [showGallery]);

  const handleClose = useCallback(() => {
    setIsClosing(true);
    setIsVisible(false);
    setTimeout(() => {
      closeGallery();
    }, 200);
  }, [closeGallery]);

  // Keyboard navigation
  const handleKeyDown = useCallback(
    (e: KeyboardEvent) => {
      if (!showGallery) return;

      switch (e.key) {
        case "Escape":
          handleClose();
          break;
        case "ArrowLeft":
          navigateGallery("prev");
          break;
        case "ArrowRight":
          navigateGallery("next");
          break;
        case "Delete":
        case "Backspace":
          if (galleryPhoto) {
            deletePhoto(galleryPhoto.id);
          }
          break;
      }
    },
    [showGallery, galleryPhoto, handleClose, navigateGallery, deletePhoto]
  );

  useEffect(() => {
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [handleKeyDown]);

  if (!showGallery || !galleryPhoto) {
    return null;
  }

  const handleDownload = () => {
    if (galleryPhoto) {
      downloadPhoto(galleryPhoto);
    }
  };

  const handleDelete = () => {
    if (galleryPhoto) {
      deletePhoto(galleryPhoto.id);
    }
  };

  return (
    <div
      className={`
        fixed inset-0 z-50 flex items-center justify-center
        transition-all duration-300 ease-out
        ${isVisible ? "bg-black/50 backdrop-blur-sm" : "bg-transparent"}
      `}
      onClick={handleClose}
    >
      {/* Modal Container */}
      <div
        className={`
          relative max-w-lg w-full mx-4
          transition-all duration-300 ease-out
          ${isVisible && !isClosing
            ? "opacity-100 scale-100 translate-y-0"
            : "opacity-0 scale-95 translate-y-4"}
        `}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Close button - floating */}
        <button
          onClick={handleClose}
          className="
            absolute -top-3 -right-3 z-10
            w-10 h-10 rounded-full
            bg-white shadow-lg
            flex items-center justify-center
            text-stone-500 hover:text-stone-700
            transition-all duration-200
            hover:scale-110 cursor-pointer
          "
          title="Close (Esc)"
        >
          <X size={20} />
        </button>

        {/* Polaroid Frame */}
        <div
          className="bg-white p-4 pb-20 shadow-2xl"
          style={{
            boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.25), 0 0 0 1px rgba(0, 0, 0, 0.05)',
          }}
        >
          {/* Photo */}
          <div className="relative bg-stone-100 overflow-hidden">
            <img
              src={galleryPhoto.image || "placeholder.png"}
              alt={`Photo ${galleryIndex + 1}`}
              style={{
                filter: galleryPhoto.filter,
                transform: galleryPhoto.mirror ? "scaleX(1)" : "scaleX(-1)",
              }}
              className="w-full aspect-[4/5] object-cover"
            />

            {/* Frame overlay if selected */}
            {galleryPhoto.frame.name !== "None" && (
              <div
                className={`absolute inset-0 pointer-events-none ${galleryPhoto.frame.style}`}
              />
            )}
          </div>

          {/* Caption area */}
          <div className="absolute bottom-4 left-0 right-0 text-center">
            <span className="random-words text-2xl text-stone-600">
              {galleryPhoto.loveWord || "memories"}
            </span>
          </div>
        </div>

        {/* Navigation Arrows - Inside on mobile, outside on desktop */}
        {totalPhotos > 1 && (
          <>
            <button
              onClick={() => navigateGallery("prev")}
              className="
                absolute top-1/2 -translate-y-1/2
                left-2 md:left-0 md:-translate-x-14
                w-10 h-10 rounded-full
                bg-white/90 shadow-lg backdrop-blur-sm
                flex items-center justify-center
                text-stone-600 hover:text-stone-800
                transition-all duration-200
                hover:scale-110 cursor-pointer
              "
              title="Previous (Left Arrow)"
            >
              <ChevronLeft size={24} />
            </button>
            <button
              onClick={() => navigateGallery("next")}
              className="
                absolute top-1/2 -translate-y-1/2
                right-2 md:right-0 md:translate-x-14
                w-10 h-10 rounded-full
                bg-white/90 shadow-lg backdrop-blur-sm
                flex items-center justify-center
                text-stone-600 hover:text-stone-800
                transition-all duration-200
                hover:scale-110 cursor-pointer
              "
              title="Next (Right Arrow)"
            >
              <ChevronRight size={24} />
            </button>
          </>
        )}

        {/* Bottom Actions Bar */}
        <div className="mt-4 flex items-center justify-between">
          {/* Photo counter */}
          <div className="flex items-center gap-2">
            {Array.from({ length: totalPhotos }).map((_, i) => (
              <div
                key={i}
                className={`
                  w-2 h-2 rounded-full transition-all duration-200
                  ${i === galleryIndex ? "bg-stone-700 scale-125" : "bg-stone-300"}
                `}
              />
            ))}
          </div>

          {/* Action buttons */}
          <div className="flex gap-2">
            <button
              onClick={handleDownload}
              className="
                flex items-center gap-2
                bg-stone-700 text-white
                px-4 py-2.5 rounded-lg
                text-sm font-medium
                cursor-pointer transition-all duration-200
                hover:bg-stone-800 hover:shadow-lg
              "
            >
              <Download size={16} />
              Save
            </button>
            <button
              onClick={handleDelete}
              className="
                p-2.5 rounded-lg
                bg-white border border-stone-200
                text-stone-500 hover:text-red-500 hover:border-red-200
                cursor-pointer transition-all duration-200
              "
              title="Delete (Delete key)"
            >
              <Trash2 size={16} />
            </button>
          </div>
        </div>

        {/* Keyboard hint - desktop only */}
        <p className="hidden md:block text-center text-stone-400 text-xs mt-4">
          Arrow keys to navigate
        </p>
      </div>
    </div>
  );
}
