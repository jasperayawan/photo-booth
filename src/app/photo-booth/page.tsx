"use client";

import { useState, useCallback } from "react";
import { PhotoBoothProvider } from "@/contexts/PhotoBoothContext";
import CameraPreview from "@/components/photo-booth/CameraPreview";
import ControlPanel from "@/components/photo-booth/ControlPanel";
import PhotoGallery from "@/components/photo-booth/PhotoGallery";
import GalleryModal from "@/components/GalleryModal";
import FloatingLeaves from "@/components/photo-booth/FloatingLeaves";
import WelcomeScreen from "@/components/photo-booth/WelcomeScreen";

export default function PhotoBoothPage() {
  const [showWelcome, setShowWelcome] = useState(true);
  const [contentReady, setContentReady] = useState(false);

  const handleWelcomeComplete = useCallback(() => {
    setShowWelcome(false);
    // Slight delay before revealing content for smooth transition
    requestAnimationFrame(() => {
      setContentReady(true);
    });
  }, []);

  return (
    <PhotoBoothProvider>
      {/* Welcome Screen */}
      {showWelcome && <WelcomeScreen onComplete={handleWelcomeComplete} />}

      <div className="min-h-screen bg-[#d4c4b5] relative overflow-hidden">
        {/* Warm beige textured background */}
        <div
          className="fixed inset-0 pointer-events-none"
          style={{
            background: `
              linear-gradient(135deg, #d9cec0 0%, #c9b8a8 50%, #d4c4b5 100%)
            `,
          }}
        />

        {/* Paper texture noise overlay */}
        <div
          className="fixed inset-0 pointer-events-none opacity-30"
          style={{
            backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noise'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%' height='100%' filter='url(%23noise)'/%3E%3C/svg%3E")`,
          }}
        />

        {/* Leaf shadows overlay */}
        <div
          className="fixed inset-0 pointer-events-none"
          style={{
            backgroundImage: `url("/leaf-shadows.svg")`,
            backgroundSize: 'cover',
            backgroundPosition: 'center',
          }}
        />

        {/* Floating animated leaves */}
        <FloatingLeaves />

        <GalleryModal />

        {/* Main content with fade-in animation */}
        <div
          className={`
            relative z-10 min-h-screen flex flex-col
            transition-all duration-700 ease-out
            ${contentReady ? "opacity-100 translate-y-0" : "opacity-0 translate-y-4"}
          `}
        >
          {/* Header - Compact */}
          <header className="text-center py-4 lg:py-6">
            <h1
              className={`
                text-stone-700 photobooth-title text-5xl lg:text-6xl
                transition-all duration-500 ease-out delay-100
                ${contentReady ? "opacity-100 translate-y-0" : "opacity-0 -translate-y-2"}
              `}
            >
              Photo Booth
            </h1>
          </header>

          {/* Main Content - Centered */}
          <main className="flex-1 flex items-start justify-center px-4 pb-8">
            <div className="w-full max-w-5xl">
              {/* Camera + Controls Row */}
              <div className="flex flex-col lg:flex-row gap-4 lg:gap-6 items-center lg:items-start justify-center">
                {/* Camera Preview - Main focus */}
                <div
                  className={`
                    w-full max-w-md lg:max-w-lg
                    transition-all duration-500 ease-out
                    ${contentReady ? "opacity-100 translate-y-0" : "opacity-0 translate-y-6"}
                  `}
                  style={{ transitionDelay: "200ms" }}
                >
                  <CameraPreview />
                </div>

                {/* Controls - Compact sidebar */}
                <div
                  className={`
                    w-full max-w-sm
                    transition-all duration-500 ease-out
                    ${contentReady ? "opacity-100 translate-y-0" : "opacity-0 translate-y-6"}
                  `}
                  style={{ transitionDelay: "350ms" }}
                >
                  <ControlPanel />
                </div>
              </div>

              {/* Photo Gallery - Below */}
              <div
                className={`
                  transition-all duration-500 ease-out
                  ${contentReady ? "opacity-100 translate-y-0" : "opacity-0 translate-y-6"}
                `}
                style={{ transitionDelay: "500ms" }}
              >
                <PhotoGallery />
              </div>
            </div>
          </main>
        </div>
      </div>
    </PhotoBoothProvider>
  );
}
