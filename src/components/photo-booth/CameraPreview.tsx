"use client";

import { Maximize2, Repeat, Camera } from "lucide-react";
import { usePhotoBooth } from "../../contexts/PhotoBoothContext";
import { useCamera } from "../../hooks/useCamera";
import { usePhotoCapture } from "../../hooks/usePhotoCapture";
import { useFullscreen } from "../../hooks/useFullscreen";
import { useKeyboardShortcuts } from "../../hooks/useKeyboardShortcuts";
import { useShutterSound } from "../../hooks/useShutterSound";
import CameraPermissionPrompt from "./CameraPermissionPrompt";
import CaptureButton from "./CaptureButton";
import CountdownOverlay from "./CountdownOverlay";

export default function CameraPreview() {
  const { state, toggleMirror, currentFilterStyle } = usePhotoBooth();
  const { selectedFrame, isMirrored, isCapturing, isCountingDown, showGallery } = state;

  const {
    videoRef,
    canvasRef,
    cameraPermission,
    cameraError,
    startCamera,
    retryCamera,
  } = useCamera();

  const { containerRef, isFullscreen, toggleFullscreen, exitFullscreen } = useFullscreen();
  const { playShutter, playBeep } = useShutterSound();

  const { startCountdownCapture, isBurstingRef } = usePhotoCapture({
    videoRef,
    canvasRef,
    cameraReady: cameraPermission === "granted",
    onBeep: playBeep,
    onShutter: playShutter,
  });

  // Keyboard shortcuts
  useKeyboardShortcuts({
    onCapture: startCountdownCapture,
    onToggleMirror: toggleMirror,
    onToggleFullscreen: toggleFullscreen,
    onExitFullscreen: exitFullscreen,
    enabled: cameraPermission === "granted" && !isCountingDown,
    isGalleryOpen: showGallery,
  });

  // Show permission prompt if not granted
  if (cameraPermission !== "granted") {
    return (
      <div className="relative">
        <CameraPermissionPrompt
          permission={cameraPermission}
          error={cameraError}
          onRequestAccess={startCamera}
          onRetry={retryCamera}
        />
        <canvas ref={canvasRef} className="hidden" />
      </div>
    );
  }

  return (
    <div className="relative">
      {/* Vintage Camera Frame */}
      <div
        className="bg-white p-3 pb-16 shadow-xl relative"
        style={{
          boxShadow: '0 8px 30px rgba(0,0,0,0.12), 0 4px 12px rgba(0,0,0,0.08)',
        }}
      >
        {/* Decorative corner accents */}
        <div className="absolute top-1 left-1 w-4 h-4 border-t-2 border-l-2 border-stone-300" />
        <div className="absolute top-1 right-1 w-4 h-4 border-t-2 border-r-2 border-stone-300" />
        <div className="absolute bottom-12 left-1 w-4 h-4 border-b-2 border-l-2 border-stone-300" />
        <div className="absolute bottom-12 right-1 w-4 h-4 border-b-2 border-r-2 border-stone-300" />

        {/* Camera viewfinder */}
        <div
          ref={containerRef}
          className={`relative overflow-hidden bg-stone-900 ${
            isFullscreen ? "fixed inset-0 z-50" : "aspect-[4/3]"
          } ${selectedFrame.style}`}
        >
          {/* Viewfinder frame lines */}
          {!isFullscreen && (
            <>
              <div className="absolute inset-4 border border-white/20 pointer-events-none z-10" />
              <div className="absolute top-1/2 left-4 right-4 h-px bg-white/10 pointer-events-none z-10" />
              <div className="absolute left-1/2 top-4 bottom-4 w-px bg-white/10 pointer-events-none z-10" />
            </>
          )}

          {/* Control buttons */}
          <div className="absolute top-3 left-3 right-3 flex justify-between z-20">
            <button
              onClick={toggleMirror}
              className={`p-2 rounded-full transition-all duration-200 ${
                isMirrored
                  ? "bg-white text-stone-700"
                  : "bg-black/40 text-white/80 hover:bg-black/60 hover:text-white"
              }`}
              title="Flip Camera (M)"
            >
              <Repeat size={16} />
            </button>
            <button
              onClick={toggleFullscreen}
              className="p-2 rounded-full bg-black/40 text-white/80 hover:bg-black/60 hover:text-white transition-all duration-200"
              title={isFullscreen ? "Exit Fullscreen (Esc)" : "Fullscreen (F)"}
            >
              {isFullscreen ? "✕" : <Maximize2 size={16} />}
            </button>
          </div>

          {/* Video Preview */}
          <video
            ref={videoRef}
            autoPlay
            playsInline
            muted
            className="w-full h-full object-cover"
            style={{
              filter: currentFilterStyle,
              transform: isMirrored ? "scaleX(-1)" : "scaleX(1)",
            }}
          />

          {/* Flash Overlay */}
          {isCapturing && (
            <div className="absolute inset-0 bg-white animate-pulse pointer-events-none" />
          )}

          {/* Countdown / Burst Progress Overlay */}
          <CountdownOverlay />

          {/* Capture Button */}
          {!isCountingDown && !isBurstingRef.current && (
            <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 z-20">
              <CaptureButton
                onCapture={startCountdownCapture}
                disabled={isCountingDown || isCapturing}
              />
            </div>
          )}
        </div>

        {/* Bottom label area - like a polaroid */}
        <div className="absolute bottom-0 left-0 right-0 h-14 flex items-center justify-center gap-2">
          <Camera size={14} className="text-stone-400" />
          <span className="text-stone-400 text-xs uppercase tracking-widest">
            Press space to capture
          </span>
        </div>
      </div>

      {/* Hidden canvas for capturing */}
      <canvas ref={canvasRef} className="hidden" />
    </div>
  );
}
