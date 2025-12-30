"use client";

import { X, Heart } from "lucide-react";
import { useState, useEffect } from "react";

interface GcashModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function GcashModal({ isOpen, onClose }: GcashModalProps) {
  const [isVisible, setIsVisible] = useState(false);
  const [isClosing, setIsClosing] = useState(false);

  useEffect(() => {
    if (isOpen) {
      requestAnimationFrame(() => setIsVisible(true));
    }
  }, [isOpen]);

  const handleClose = () => {
    setIsClosing(true);
    setIsVisible(false);
    setTimeout(() => {
      onClose();
    }, 200);
  };

  return (
    <div
      className={`
        fixed inset-0 z-50 flex items-center justify-center px-4
        transition-all duration-300 ease-out
        ${isVisible ? "bg-black/40 backdrop-blur-sm" : "bg-transparent"}
      `}
      onClick={handleClose}
    >
      <div
        className={`
          relative max-w-sm w-full
          transition-all duration-300 ease-out
          ${isVisible && !isClosing
            ? "opacity-100 scale-100 translate-y-0"
            : "opacity-0 scale-95 translate-y-4"}
        `}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Close button */}
        <button
          onClick={handleClose}
          className="
            absolute -top-3 -right-3 z-10
            w-10 h-10 rounded-full
            bg-white shadow-lg
            flex items-center justify-center
            text-stone-400 hover:text-stone-600
            transition-all duration-200
            hover:scale-110 cursor-pointer
          "
        >
          <X size={20} />
        </button>

        {/* Card */}
        <div
          className="bg-white rounded-2xl overflow-hidden shadow-2xl"
          style={{
            boxShadow: "0 25px 50px -12px rgba(0, 0, 0, 0.2)",
          }}
        >
          {/* Header */}
          <div className="bg-gradient-to-br from-stone-100 to-stone-50 px-6 pt-8 pb-6 text-center">
            <div className="w-14 h-14 rounded-full bg-rose-50 flex items-center justify-center mx-auto mb-4">
              <Heart size={24} className="text-rose-400" />
            </div>
            <h2 className="text-xl font-semibold text-stone-700">
              Support Our Photo Booth
            </h2>
            <p className="mt-2 text-stone-500 text-sm">
              Your kindness keeps the fun going!
            </p>
          </div>

          {/* QR Code */}
          <div className="px-6 py-6 flex flex-col items-center">
            <div className="bg-stone-50 p-3 rounded-xl">
              <img
                src="/gcash.jpg"
                alt="GCash QR Code"
                className="w-56 h-56 object-contain rounded-lg"
              />
            </div>

            <p className="mt-4 text-stone-400 text-xs text-center">
              Scan with GCash app to send your support
            </p>
          </div>

          {/* Footer message */}
          <div className="px-6 pb-6">
            <div className="bg-stone-50 rounded-xl p-4 text-center">
              <p className="text-stone-500 text-sm">
                Every contribution, no matter how small, helps me continue my studies.
              </p>
              <p className="mt-2 text-stone-400 text-xs">
                Thank you for your generosity!
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
