"use client"

import React, { useState, useRef, useCallback, useEffect } from "react"
import { Camera, Download, RotateCcw, Sparkles, Heart, Star, Zap, Palette, Frame, Clock } from "lucide-react"

const filters = [
  { name: "None", value: "none", icon: Camera, color: "bg-gray-500" },
  { name: "Vintage", value: "sepia(100%) contrast(120%)", icon: Palette, color: "bg-amber-500" },
  { name: "B&W", value: "grayscale(100%)", icon: Sparkles, color: "bg-gray-700" },
  { name: "Vibrant", value: "saturate(200%) contrast(120%)", icon: Zap, color: "bg-purple-500" },
  { name: "Cool", value: "hue-rotate(180deg) saturate(150%)", icon: Star, color: "bg-blue-500" },
  { name: "Warm", value: "hue-rotate(30deg) saturate(130%)", icon: Heart, color: "bg-red-500" },
]

const frames = [
  { name: "None", style: "" },
  { name: "Classic", style: "border-8 border-white shadow-2xl" },
  { name: "Polaroid", style: "border-8 border-white border-b-16 shadow-2xl bg-white p-2" },
  { name: "Neon", style: "border-4 border-pink-400 shadow-lg shadow-pink-400/50" },
  { name: "Gold", style: "border-6 border-yellow-400 shadow-lg shadow-yellow-400/30" },
]

const delayOptions = [
  { label: "1s", value: 1 },
  { label: "3s", value: 3 },
  { label: "5s", value: 5 },
  { label: "10s", value: 10 },
]

const photoCountOptions = [1, 2, 3, 4, 5, 6]

const PhotoBooth = () => {
    const [isCapturing, setIsCapturing] = useState(false);
    const [capturedPhotos, setCapturedPhotos] = useState<string[]>([]);
    const [selectedFilter, setSelectedFilter] = useState(filters[0]);
    const [selectedFrame, setSelectedFrame] = useState(frames[0]);
    const [showGallery, setShowGallery] = useState(false);
    const videoRef = useRef<HTMLVideoElement>(null);
    const canvasRef = useRef<HTMLCanvasElement>(null); 
    const streamRef = useRef<MediaStream | null>(null);
    const [cameraError, setCameraError] = useState<string | null>(null);
    const [cameraPermission, setCameraPermission] = useState<"pending" | "granted" | "denied">("pending");


    const startCamera = useCallback(async () => {
        try{
            if (navigator.permissions) {
              const result = await navigator.permissions.query({ name: "camera" as PermissionName });
              
              if (result.state === "denied") {
                  setCameraPermission("denied");
                  setCameraError("Camera access denied. Please allow camera permissions and refresh the page.");
                  return;
              }
            }

            if(!navigator.mediaDevices || !navigator.mediaDevices.getUserMedia){
                throw new Error("Camera not supported in this browser.");
            }

            const stream = await navigator.mediaDevices.getUserMedia({
                video: {
                    width: { ideal: 640 },
                    height: { ideal: 480 },
                    facingMode: "user", // Front-facing camera for selfies
                }
            })

            setCameraPermission("granted");
            if (videoRef.current) {
                videoRef.current.srcObject = stream
                streamRef.current = stream;
                setCameraPermission("granted")
            }
        }
        catch(error: any){
            console.error("Error accessing camera:", error)
            setCameraPermission("denied")

            if (error.name === "NotAllowedError" || error.name === "PermissionDeniedError") {
                setCameraError("Camera access denied. Please allow camera permissions and refresh the page.")
            } else if (error.name === "NotFoundError" || error.name === "DevicesNotFoundError") {
                setCameraError("No camera found. Please connect a camera and try again.")
            } else if (error.name === "NotReadableError" || error.name === "TrackStartError") {
                setCameraError("Camera is already in use by another application.")
            } else if (error.name === "OverconstrainedError" || error.name === "ConstraintNotSatisfiedError") {
                setCameraError("Camera does not meet the required specifications.")
            } else {
                setCameraError(`Camera error: ${error.message || "Unknown error occurred"}`)
            }
        }
    }, [])

    const retryCamera = () => {
      setCameraPermission("pending");
      setCameraError(null);
      startCamera();
  };

    const stopCamera = useCallback(() => {
        if (streamRef.current){
            streamRef.current.getTracks().forEach(track => track.stop());
            streamRef.current = null;
        }
    },[])

    useEffect(() => {
        startCamera();
        return () => stopCamera();
    },[startCamera, stopCamera])

  return (
    <div className="min-h-screen bg-white flex justify-center items-center">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-black mb-2 flex items-center justify-center gap-2">
            <Camera className="w-8 h-8" />
            Fun Photo Booth
            <Sparkles className="w-8 h-8" />
          </h1>
          <p className="text-zinc-500">Strike a pose and capture amazing memories!</p>
        </div>

        <div className="grid lg:grid-cols-3 gap-6">
            <div className="relative">
                {/* Camera Preview */}
                <div className={`relative rounded-lg overflow-hidden ${selectedFrame.style}`}>

                    {cameraPermission === "pending" && (
                        <div className="w-full h-64 bg-gray-800 flex items-center">
                            <div className="text-center text-white">
                                <Camera className="w-12 h-12 mx-auto mb-4 animate-pulse"/>
                                <p>Requesting camera access</p>
                                <button onClick={retryCamera} className="flex justify-center items-center text-white hover:underline hover:cursor-pointer">
                              <Camera className="w-4 h-4 mr-2" />
                              Try Again
                            </button>
                            </div>
                        </div>
                    )}

                    {cameraPermission === "denied" && (
                      <div className="w-full h-64 bg-gray-800 flex items-center justify-center">
                        <div className="text-center text-white p-6">
                          <Camera className="w-8 h-8 mx-auto mb-4 text-red-400" />
                          <h3 className="text-lg font-semibold mb-2">Camera Access Required</h3>
                          <p className="text-sm text-gray-300 mb-4">{cameraError}</p>
                          <div className="flex justify-center items-center flex-col space-y-2">
                            <button onClick={retryCamera} className="flex justify-center items-center text-white hover:underline hover:cursor-pointer">
                              <Camera className="w-4 h-4 mr-2" />
                              Try Again
                            </button>
                            <div className="text-xs text-gray-400">
                              <p>To enable camera:</p>
                              <p>1. Click the camera icon in your browser's address bar</p>
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
                                >

                            </video>
                        </>
                    ) }

                    <canvas ref={canvasRef} className="hidden" />
                </div>
            </div>
        </div>
      </div>
    </div>
  )
}

export default PhotoBooth
