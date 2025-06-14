"use client";

import React, { useState, useRef, useCallback, useEffect } from "react";
import {
  Camera,
  Download,
  RotateCcw,
  Sparkles,
  Heart,
  Star,
  Zap,
  Palette,
  Frame,
  Clock,
  Timer,
  Image,
} from "lucide-react";
import GalleryModal from "@/components/GalleryModal";

// === FILTER CONFIGURATION ===

const filters = [
  { name: "None", value: "none", icon: Camera, color: "bg-gray-500" },
  {
    name: "Vintage",
    value: "sepia(100%) contrast(120%)",
    icon: Palette,
    color: "bg-amber-500",
  },
  {
    name: "B&W",
    value: "grayscale(100%)",
    icon: Sparkles,
    color: "bg-gray-700",
  },
  {
    name: "Vibrant",
    value: "saturate(200%) contrast(120%)",
    icon: Zap,
    color: "bg-purple-500",
  },
  {
    name: "Cool",
    value: "hue-rotate(180deg) saturate(150%)",
    icon: Star,
    color: "bg-blue-500",
  },
  {
    name: "Warm",
    value: "hue-rotate(30deg) saturate(130%)",
    icon: Heart,
    color: "bg-red-500",
  },
  {
    name: "Twilight",
    value: "blur(2px) grayscale(100%)",
    icon: Heart,
    color: "bg-red-500",
  },
];

// Array of predefined visual filters, each with a name, CSS value, icon, and a color badge.

const frames = [
  { name: "None", style: "" },
  { name: "Classic", style: "border-8 border-white shadow-2xl" },
  {
    name: "Polaroid",
    style: "border-8 border-white border-b-16 shadow-2xl bg-white p-2",
  },
  {
    name: "Neon",
    style: "border-4 border-pink-400 shadow-lg shadow-pink-400/50",
  },
  {
    name: "Gold",
    style: "border-6 border-yellow-400 shadow-lg shadow-yellow-400/30",
  },
];

// Array of frame styles that add a visual frame around the video/photo.

const delayOptions = [
  { label: "1s", value: 1 },
  { label: "3s", value: 3 },
  { label: "5s", value: 5 },
  { label: "10s", value: 10 },
];

// Options for selecting a countdown timer delay before capturing a photo.

const photoCountOptions = [1, 2, 3, 4, 5, 6];

type photoCapturedDataType = {
  image: string;
  filter: string;
  frame: {
    name: string;
    style: string;
  };
};


const PhotoBooth = () => {
  // States for managing camera, filters, photos, and errors.

  const [isCapturing, setIsCapturing] = useState(false);
  const [capturedPhotos, setCapturedPhotos] = useState<photoCapturedDataType[]>([]);
  const [selectedFilter, setSelectedFilter] = useState(filters[0]);
  const [selectedFrame, setSelectedFrame] = useState(frames[0]);
  const [showGallery, setShowGallery] = useState(false);

  // Refs for accessing DOM elements and video stream

  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const streamRef = useRef<MediaStream | null>(null);
  const isBurstingRef = useRef(false);

  // Countdown + burst mode state

  const [countdown, setCountdown] = useState(0);
  const [selectedDelay, setSelectedDelay] = useState(3);
  const [selectedPhotoCount, setSelectedPhotoCount] = useState(1);
  const [isCountingDown, setIsCountingDown] = useState(false);
  const [currentBurstCount, setCurrentBurstCount] = useState(0);
  const [galleryPhoto, setGalleryPhoto] = useState<string | null>(null)

  // Camera access and error handling state

  const [cameraError, setCameraError] = useState<string | null>(null);
  const [cameraPermission, setCameraPermission] = useState<
  "prompt" | "granted" | "denied" | "pending"
>("prompt");

  // === Function to start the camera stream ===
 const startCamera = useCallback(async () => {
  try {
    setCameraError(null);

    if (!navigator.mediaDevices || !navigator.mediaDevices.getUserMedia) {
      throw new Error("Camera not supported in this browser.");
    }

    const stream = await navigator.mediaDevices.getUserMedia({
      video: {
        width: { ideal: 640 },
        height: { ideal: 480 },
        facingMode: "user",
      },
    });

    if (videoRef.current) {
      videoRef.current.srcObject = stream;
      streamRef.current = stream;
    }

  } catch (error: any) {
    console.error("Error accessing camera:", error);
    setCameraPermission("denied");

    if (
      error.name === "NotAllowedError" ||
      error.name === "PermissionDeniedError"
    ) {
      setCameraError("Camera access denied. Please allow camera permissions and refresh the page.");
    } else if (
      error.name === "NotFoundError" ||
      error.name === "DevicesNotFoundError"
    ) {
      setCameraError("No camera found. Please connect a camera and try again.");
    } else if (
      error.name === "NotReadableError" ||
      error.name === "TrackStartError"
    ) {
      setCameraError("Camera is already in use by another application.");
    } else if (
      error.name === "OverconstrainedError" ||
      error.name === "ConstraintNotSatisfiedError"
    ) {
      setCameraError("Camera does not meet the required specifications.");
    } else {
      setCameraError(`Camera error: ${error.message || "Unknown error occurred"}`);
    }
  }
}, []);

  // === Retry camera function if denied or failed ===
  const retryCamera = useCallback(() => {
    setCameraPermission("pending");
    setCameraError(null);
    startCamera();
  }, [startCamera]);

  // === Stop camera stream and release tracks ===
  const stopCamera = useCallback(() => {
    if (streamRef.current) {
      streamRef.current.getTracks().forEach((track) => track.stop());
      streamRef.current = null;
    }
  }, []);

  const takePhoto = useCallback(() => {
    const video = videoRef.current;
    const canvas = canvasRef.current;
    if (!video || !canvas) return;

    const ctx = canvas.getContext("2d");
    canvas.width = video.videoWidth;
    canvas.height = video.videoHeight;

    if (ctx) {
      ctx.filter = selectedFilter.value;
      ctx.scale(-1, 1);
      ctx.drawImage(video, -canvas.width, 0);
      ctx.setTransform(1, 0, 0, 1, 0, 0);
      const photo = canvas.toDataURL("image/png");
      setCapturedPhotos(prev => [
        ...prev,
        {
          image: photo,
          filter: selectedFilter.value,
          frame: {
            name: selectedFrame.name,
            style: selectedFrame.style
          }
        }
      ])
    } 
  
  }, [selectedFilter, selectedFrame]);


  // === Countdown before photo capture ===
  const startCountdownCapture = useCallback(() => {
    if (isCountingDown || isBurstingRef.current) return;

    setCurrentBurstCount(0);
    isBurstingRef.current = true;

    const captureNext = () => {
      if (currentBurstCount >= selectedPhotoCount) {
        isBurstingRef.current = false;
        setIsCapturing(false); 
        setCurrentBurstCount(0);
        return;
      }

      setIsCountingDown(true);
      setCountdown(selectedDelay);

      const countdownInterval = setInterval(() => {
        setCountdown((prev) => {
          if (prev <= 1) {
            clearInterval(countdownInterval);
            setCountdown(0);
            setIsCountingDown(false);

            setIsCapturing(false);
            setTimeout(() => {
              setIsCapturing(true);
              takePhoto();
              setTimeout(() => setIsCapturing(false), 200);
            }, 0);


            setCurrentBurstCount((prevBurst) => {
              const next = prevBurst + 1;
              if (next < selectedPhotoCount) {
                setTimeout(captureNext, 500);
              } else {
                isBurstingRef.current = false;
                setIsCapturing(false);
                setCurrentBurstCount(0);
              }
              return next;
            });

            return 0;
          }
          return prev - 1;
        });
      }, 1000);
    };

    captureNext();
  }, [
    isCountingDown,
    selectedDelay,
    takePhoto,
    currentBurstCount,
    selectedPhotoCount,
  ]);

  // === Download a photo ===
  const downloadPhoto = (photoData: string, index: number) => {
    const link = document.createElement("a");
    link.download = `photo-booth-${Date.now()}-${index}.png`;
    link.href = photoData;
    link.click();
  };

  const openGallery = (photo: string) => {
    // Open the photo gallery
    setGalleryPhoto(photo)
    setShowGallery(true);
  }

  // === Start camera on mount; stop on unmount ===

  useEffect(() => {
  // Check permission on mount
  const checkPermission = async () => {
    if (!navigator.permissions) {
      setCameraPermission("prompt");
      return;
    }

    try {
      const result = await navigator.permissions.query({
        name: "camera" as PermissionName,
      });

      if (result.state === "granted") {
        setCameraPermission("granted");
      } else if (result.state === "denied") {
        setCameraPermission("denied");
        setCameraError("Camera access denied. Please allow camera permissions and refresh the page.");
      } else {
        setCameraPermission("prompt");
      }

      result.onchange = () => {
        setCameraPermission(result.state as any);
      };
    } catch {
      setCameraPermission("prompt");
    }
  };

  checkPermission();
}, []);

useEffect(() => {
  // Only start camera if permission is granted
  if (cameraPermission === "granted") {
    startCamera();
  }
}, [cameraPermission, startCamera]);

  
  return (
    <div className="min-h-screen bg-black flex justify-center items-center px-4">
      <GalleryModal
        isOpen={showGallery}
        onClose={() => setShowGallery(false)}
        photos={capturedPhotos.map((data) => data.image)}
        currentPhoto={galleryPhoto}
      />

      <div className="max-w-6xl mx-auto flex justify-center items-center flex-col">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="tfont-bold text-white mb-2 flex items-center justify-center gap-2 photobooth-title">
            Goofy Booth
          </h1>
          <p className="text-zinc-500">
            Strike a pose and capture amazing memories!
          </p>
        </div>

        <div className="grid lg:grid-cols-2 gap-6">
          <div className="relative">
            {/* Camera Preview */}
            <div
              className={`relative rounded-lg overflow-hidden ${selectedFrame.style}`}
            >
              {cameraPermission === "pending" && (
                <div className="w-full h-64 bg-gray-800 flex justify-center items-center">
                  <div className="text-center text-black">
                    <Camera className="w-12 h-12 mx-auto mb-4 animate-pulse" />
                    <p>Requesting camera access</p>
                  </div>
                </div>
              )}

              {cameraPermission === "denied" && (
                <div className="w-full h-64 bg-gray-800 flex items-center justify-center">
                  <div className="text-center text-white p-6">
                    <Camera className="w-8 h-8 mx-auto mb-4 text-red-400" />
                    <h3 className="text-lg font-semibold mb-2">
                      Camera Access Required
                    </h3>
                    <p className="text-sm text-gray-300 mb-4">{cameraError}</p>
                    <div className="flex justify-center items-center flex-col space-y-2">
                      <button
                        onClick={retryCamera}
                        className="flex justify-center items-center text-white hover:underline hover:cursor-pointer"
                      >
                        <Camera className="w-4 h-4 mr-2" />
                        Try Again
                      </button>
                      <div className="text-xs text-gray-400">
                        <p>To enable camera:</p>
                        <p>
                          1. Click the camera icon in your browser's address bar
                        </p>
                        <p>2. Select "Allow" for camera access</p>
                        <p>3. Refresh the page</p>
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {cameraPermission === "granted" && (
                <>
                  <video
                    ref={videoRef}
                    autoPlay
                    playsInline
                    muted
                    className="w-full h-auto"
                    style={{
                      filter: selectedFilter.value,
                      transform: "scaleX(-1)", // Mirror the video for a natural selfie experience
                    }}
                  ></video>

                  {/* Flash Overlay */}
                  {isCapturing && (
                    <div className="absolute inset-0 bg-white animate-pulse" />
                  )}

                  {/* Capture Button Overlay */}
                  <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2">
                    {isCountingDown ? (
                      <div className="flex flex-col items-center">
                        <div className="text-6xl font-bold text-white mb-2 animate-pulse">
                          {countdown}
                        </div>
                        <div className="text-white text-sm">Get ready!</div>
                      </div>
                    ) : currentBurstCount > 0 ? (
                      <div className="flex flex-col items-center">
                        <div className="text-2xl font-bold text-white mb-2">
                          {currentBurstCount}/{selectedPhotoCount}
                        </div>
                        <div className="text-white text-sm">Capturing...</div>
                      </div>
                    ) : (
                      <button
                        onClick={startCountdownCapture}
                        className="rounded-full w-16 h-16 cursor-pointer flex justify-center items-center bg-white/25 backdrop-blur-md text-black hover:bg-gray-100 shadow-lg"
                        disabled={
                          isCountingDown ||
                          isCapturing ||
                          cameraPermission !== "granted"
                        }
                      >
                        <Camera className="w-6 h-6" />
                      </button>
                    )}
                  </div>
                </>
              )}

              <canvas ref={canvasRef} className="hidden" />
            </div>
          </div>

          <div className="flex flex-col gap-y-5">
            {/* Filter Selection */}

            <div className="mt-6">
              <h3 className="text-white font-semibold mb-3 flex items-center gap-2">
                <Palette className="w-4 h-4" />
                Filters
              </h3>
              <div className="flex flex-wrap gap-2">
                {filters.map((filter) => {
                  const Icon = filter.icon;

                  return (
                    <button
                      key={filter.name}
                      onClick={() => setSelectedFilter(filter)}
                      className={`flex-col gap-1 text-white cursor-pointer border-white/20 hover:scale-105 transition-transform flex justify-center items-center`}
                    >
                      <img
                        src="/maila.jpg"
                        className="w-10 h-10 rounded-full object-cover"
                        style={{ filter: filter.value }}
                        alt={filter.name}
                      />
                      <span className="text-sm text-zinc-400">{filter.name}</span>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Frame Selection */}

            <div className="mt-4">
              <h3 className="text-white font-semibold mb-3 flex items-center gap-2">
                <Frame className="w-4 h-4" />
                Frames
              </h3>
              <div className="flex flex-wrap gap-2">
                {frames.map((frame) => (
                  <button
                    key={frame.name}
                    onClick={() => setSelectedFrame(frame)}
                    className={`text-white border-white/20 hover:scale-105 transition-transform ${frame.style}`}
                  >
                    {frame.name}
                  </button>
                ))}
              </div>
            </div>

            {/* Timer Delay */}
            <div>
              <h3 className="text-white font-semibold mb-3 flex items-center gap-2">
                <Timer className="w-4 h-4" />
                Countdown timer
              </h3>
              <div className="flex flex-wrap gap-1">
                {delayOptions.map((option) => (
                  <button
                    key={option.value}
                    onClick={() => setSelectedDelay(option.value)}
                    className={`text-black border-white/20 cursor-pointer ${
                      selectedDelay === option.value
                        ? "bg-slate-400"
                        : "bg-slate-200"
                    } hover:scale-105 transition-transform min-w-[2rem]`}
                    disabled={isCountingDown}
                  >
                    {option.label}
                  </button>
                ))}
              </div>
            </div>

            {/* Photo Count */}
            <div>
              <h3 className="text-white font-semibold mb-3 flex items-center gap-2">
                <Image className="w-4 h-4" />
                Photos to take
              </h3>
              <div className="flex flex-wrap gap-1">
                {photoCountOptions.map((count) => (
                  <button
                    key={count}
                    onClick={() => setSelectedPhotoCount(count)}
                    className={`text-black border-white/20 ${
                      selectedPhotoCount === count
                        ? "bg-slate-400"
                        : "bg-slate-200"
                    } cursor-pointer hover:scale-105 transition-transform min-w-[2rem]`}
                    disabled={isCountingDown}
                  >
                    {count}
                  </button>
                ))}
              </div>
            </div>
          </div>
        </div>

        <div className="mt-5 w-full flex flex-wrap gap-2">
          {capturedPhotos.map((data, index) => {
            return (
              <div key={index} className="relative group">
                <img
                  src={data.image || "placeholder.png"}
                  alt={`Captured photo ${index + 1}`}
                  className={`w-20 h-18 ${data.filter} ${data.frame.style} rounded-md object-cover cursor-pointer`}
                  onClick={() => openGallery(data.image)}
                />
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default PhotoBooth;
