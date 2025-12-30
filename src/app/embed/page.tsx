"use client";

import { useEffect, useRef, useState, Suspense } from "react";
import { useSearchParams } from "next/navigation";
import { Camera, Download, RotateCcw, Sparkles } from "lucide-react";
import { filters, frames } from "@/data/filters";
import { getFilterStyle } from "@/utils/filterUtils";
import { exportPhotoAsDataUrl } from "@/utils/photoExport";

function EmbedContent() {
  const searchParams = useSearchParams();
  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);

  // Config from URL params
  const theme = searchParams.get("theme") || "light";
  const brand = searchParams.get("brand") || "Photo Booth";
  const filterName = searchParams.get("filter") || "None";
  const frameName = searchParams.get("frame") || "Classic";
  const showControls = searchParams.get("controls") !== "false";

  // State
  const [cameraReady, setCameraReady] = useState(false);
  const [capturedPhoto, setCapturedPhoto] = useState<string | null>(null);
  const [selectedFilter, setSelectedFilter] = useState(
    filters.find((f) => f.name === filterName) || filters[0]
  );
  const [selectedFrame, setSelectedFrame] = useState(
    frames.find((f) => f.name === frameName) || frames[1]
  );

  // Initialize camera
  useEffect(() => {
    const initCamera = async () => {
      try {
        const stream = await navigator.mediaDevices.getUserMedia({
          video: { facingMode: "user", width: 640, height: 480 },
          audio: false,
        });

        if (videoRef.current) {
          videoRef.current.srcObject = stream;
          videoRef.current.onloadedmetadata = () => {
            setCameraReady(true);
          };
        }
      } catch (error) {
        console.error("Camera access denied:", error);
      }
    };

    initCamera();

    return () => {
      if (videoRef.current?.srcObject) {
        const stream = videoRef.current.srcObject as MediaStream;
        stream.getTracks().forEach((track) => track.stop());
      }
    };
  }, []);

  const handleCapture = () => {
    if (!videoRef.current || !canvasRef.current) return;

    const video = videoRef.current;
    const canvas = canvasRef.current;
    const ctx = canvas.getContext("2d");

    if (!ctx) return;

    canvas.width = video.videoWidth;
    canvas.height = video.videoHeight;

    // Flip for selfie
    ctx.translate(canvas.width, 0);
    ctx.scale(-1, 1);
    ctx.drawImage(video, 0, 0);

    setCapturedPhoto(canvas.toDataURL("image/png"));
  };

  const handleRetake = () => {
    setCapturedPhoto(null);
  };

  const handleDownload = async () => {
    if (!capturedPhoto) return;

    const dataUrl = await exportPhotoAsDataUrl(
      {
        id: `embed-${Date.now()}`,
        image: capturedPhoto,
        filter: getFilterStyle(selectedFilter.name, 1),
        loveWord: null,
        mirror: true,
        frame: selectedFrame,
      },
      false // Watermarked for embed
    );

    const link = document.createElement("a");
    link.download = `${brand.toLowerCase().replace(/\s+/g, "-")}-photo-${Date.now()}.png`;
    link.href = dataUrl;
    link.click();

    // Send message to parent window
    window.parent.postMessage(
      {
        type: "photobooth-download",
        imageUrl: dataUrl,
      },
      "*"
    );
  };

  const filterStyle = getFilterStyle(selectedFilter.name, 1);
  const isDark = theme === "dark";

  return (
    <div
      className={`
        min-h-screen flex flex-col
        ${isDark ? "bg-zinc-900 text-white" : "bg-stone-100 text-stone-800"}
      `}
    >
      {/* Header */}
      <header className="flex items-center justify-between px-4 py-3 border-b border-opacity-10">
        <h1 className="text-lg font-semibold">{brand}</h1>
        <div className="flex items-center gap-1 text-xs opacity-50">
          <Camera size={12} />
          <span>Powered by PhotoBooth</span>
        </div>
      </header>

      {/* Main */}
      <main className="flex-1 flex flex-col items-center justify-center p-4">
        {/* Camera/Photo View */}
        <div
          className={`
            relative w-full max-w-md aspect-[3/4] rounded-lg overflow-hidden
            ${isDark ? "bg-zinc-800" : "bg-white"}
            ${selectedFrame.style}
          `}
        >
          {capturedPhoto ? (
            <img
              src={capturedPhoto}
              alt="Captured"
              className="w-full h-full object-cover"
              style={{ filter: filterStyle }}
            />
          ) : (
            <>
              <video
                ref={videoRef}
                autoPlay
                playsInline
                muted
                className="w-full h-full object-cover"
                style={{
                  transform: "scaleX(-1)",
                  filter: filterStyle,
                }}
              />
              {!cameraReady && (
                <div className="absolute inset-0 flex items-center justify-center">
                  <div className="w-8 h-8 border-2 border-current border-t-transparent rounded-full animate-spin" />
                </div>
              )}
            </>
          )}
        </div>

        {/* Controls */}
        {showControls && (
          <div className="mt-4 flex flex-col items-center gap-3 w-full max-w-md">
            {/* Filter Selector */}
            <div className="flex gap-2 overflow-x-auto pb-2 w-full">
              {filters.slice(0, 6).map((filter) => (
                <button
                  key={filter.name}
                  onClick={() => setSelectedFilter(filter)}
                  className={`
                    flex-shrink-0 px-3 py-1.5 rounded-full text-xs font-medium
                    transition-colors cursor-pointer
                    ${selectedFilter.name === filter.name
                      ? isDark
                        ? "bg-white text-black"
                        : "bg-stone-700 text-white"
                      : isDark
                        ? "bg-zinc-700 hover:bg-zinc-600"
                        : "bg-stone-200 hover:bg-stone-300"}
                  `}
                >
                  {filter.name}
                </button>
              ))}
            </div>

            {/* Action Buttons */}
            <div className="flex gap-3">
              {capturedPhoto ? (
                <>
                  <button
                    onClick={handleRetake}
                    className={`
                      flex items-center gap-2 px-4 py-2 rounded-full font-medium
                      transition-colors cursor-pointer
                      ${isDark
                        ? "bg-zinc-700 hover:bg-zinc-600"
                        : "bg-stone-200 hover:bg-stone-300"}
                    `}
                  >
                    <RotateCcw size={16} />
                    Retake
                  </button>
                  <button
                    onClick={handleDownload}
                    className={`
                      flex items-center gap-2 px-4 py-2 rounded-full font-medium
                      transition-colors cursor-pointer
                      ${isDark
                        ? "bg-white text-black hover:bg-gray-100"
                        : "bg-stone-700 text-white hover:bg-stone-800"}
                    `}
                  >
                    <Download size={16} />
                    Save
                  </button>
                </>
              ) : (
                <button
                  onClick={handleCapture}
                  disabled={!cameraReady}
                  className={`
                    flex items-center gap-2 px-6 py-3 rounded-full font-medium
                    transition-all cursor-pointer
                    disabled:opacity-50 disabled:cursor-not-allowed
                    ${isDark
                      ? "bg-white text-black hover:bg-gray-100"
                      : "bg-stone-700 text-white hover:bg-stone-800"}
                  `}
                >
                  <Camera size={18} />
                  Capture
                </button>
              )}
            </div>
          </div>
        )}
      </main>

      {/* Hidden canvas for capture */}
      <canvas ref={canvasRef} className="hidden" />

      {/* Footer */}
      <footer className="text-center py-2 text-xs opacity-40">
        <a
          href="https://photobooth.app"
          target="_blank"
          rel="noopener noreferrer"
          className="hover:opacity-70"
        >
          photobooth.app
        </a>
      </footer>
    </div>
  );
}

export default function EmbedPage() {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen flex items-center justify-center bg-stone-100">
          <div className="w-8 h-8 border-2 border-stone-400 border-t-transparent rounded-full animate-spin" />
        </div>
      }
    >
      <EmbedContent />
    </Suspense>
  );
}
