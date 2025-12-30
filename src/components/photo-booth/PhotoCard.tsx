"use client";

import { Trash2, Maximize2 } from "lucide-react";
import type { photoCapturedDataType } from "../../types/types";

interface PhotoCardProps {
  photo: photoCapturedDataType;
  index: number;
  rotation?: number;
  offsetX?: number;
  offsetY?: number;
  onView: (photo: photoCapturedDataType, index: number) => void;
  onDelete: (id: string) => void;
}

export default function PhotoCard({
  photo,
  index,
  rotation = 0,
  offsetX = 0,
  offsetY = 0,
  onView,
  onDelete,
}: PhotoCardProps) {
  return (
    <div
      className="group relative transition-all duration-300 ease-out hover:scale-110 hover:z-20 hover:rotate-0"
      style={{
        transform: `rotate(${rotation}deg) translate(${offsetX}px, ${offsetY}px)`,
      }}
    >
      {/* Polaroid card */}
      <div
        className="bg-white p-2 pb-10 transition-shadow duration-300 group-hover:shadow-2xl"
        style={{
          boxShadow: '0 4px 15px rgba(0,0,0,0.1), 0 2px 6px rgba(0,0,0,0.08)',
        }}
      >
        {/* Image */}
        <div className="relative w-36 h-36 lg:w-40 lg:h-40 overflow-hidden bg-stone-100">
          <img
            src={photo.image || "placeholder.png"}
            alt={`Captured photo ${index + 1}`}
            style={{
              filter: photo.filter,
              transform: photo.mirror ? "scaleX(1)" : "scaleX(-1)",
            }}
            className="w-full h-full object-cover cursor-pointer"
            onClick={() => onView(photo, index)}
          />

          {/* Hover overlay with actions */}
          <div
            className="
              absolute inset-0 bg-black/40
              opacity-0 group-hover:opacity-100
              transition-opacity duration-200
              flex items-center justify-center gap-3
            "
          >
            <button
              onClick={() => onView(photo, index)}
              className="p-2.5 bg-white/90 rounded-full hover:bg-white transition-colors cursor-pointer shadow-md"
              title="View"
            >
              <Maximize2 size={16} className="text-stone-700" />
            </button>
            <button
              onClick={(e) => {
                e.stopPropagation();
                onDelete(photo.id);
              }}
              className="p-2.5 bg-white/90 rounded-full hover:bg-red-500 hover:text-white transition-colors cursor-pointer shadow-md"
              title="Delete"
            >
              <Trash2 size={16} className="text-stone-700 group-hover:text-inherit" />
            </button>
          </div>
        </div>

        {/* Love word caption - handwritten style */}
        <div className="absolute bottom-1.5 left-0 right-0 text-center">
          <span className="random-words text-base text-stone-500">
            {photo.loveWord || "memories"}
          </span>
        </div>
      </div>
    </div>
  );
}
