"use client";

import { useState, useRef, useCallback, useEffect } from "react";
import type { CameraPermissionState } from "../types/types";

interface UseCameraReturn {
  videoRef: React.RefObject<HTMLVideoElement | null>;
  canvasRef: React.RefObject<HTMLCanvasElement | null>;
  streamRef: React.RefObject<MediaStream | null>;
  cameraPermission: CameraPermissionState;
  cameraError: string | null;
  startCamera: () => Promise<void>;
  stopCamera: () => void;
  retryCamera: () => void;
}

export function useCamera(): UseCameraReturn {
  const videoRef = useRef<HTMLVideoElement | null>(null);
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const streamRef = useRef<MediaStream | null>(null);

  const [cameraPermission, setCameraPermission] =
    useState<CameraPermissionState>("prompt");
  const [cameraError, setCameraError] = useState<string | null>(null);

  // Start camera stream with fallback for mobile devices
  const startCamera = useCallback(async () => {
    try {
      setCameraError(null);
      setCameraPermission("pending");

      if (!navigator.mediaDevices || !navigator.mediaDevices.getUserMedia) {
        throw new Error("Camera not supported in this browser.");
      }

      // Try with ideal constraints first, then fallback for mobile compatibility
      let stream: MediaStream;

      try {
        // First attempt with preferred constraints
        stream = await navigator.mediaDevices.getUserMedia({
          video: {
            width: { ideal: 640 },
            height: { ideal: 480 },
            facingMode: "user",
          },
          audio: false,
        });
      } catch (constraintError) {
        // Fallback: try with minimal constraints for mobile compatibility
        console.warn("Falling back to basic video constraints:", constraintError);
        stream = await navigator.mediaDevices.getUserMedia({
          video: {
            facingMode: "user",
          },
          audio: false,
        });
      }

      if (videoRef.current) {
        videoRef.current.srcObject = stream;
        streamRef.current = stream;

        // Wait for video to be ready (important for mobile)
        await new Promise<void>((resolve, reject) => {
          if (!videoRef.current) {
            reject(new Error("Video element not found"));
            return;
          }

          const video = videoRef.current;

          const onLoadedMetadata = () => {
            video.removeEventListener("loadedmetadata", onLoadedMetadata);
            video.removeEventListener("error", onError);
            video.play()
              .then(() => resolve())
              .catch((playError) => {
                console.warn("Auto-play failed, user interaction may be required:", playError);
                resolve(); // Still resolve, video might play on interaction
              });
          };

          const onError = () => {
            video.removeEventListener("loadedmetadata", onLoadedMetadata);
            video.removeEventListener("error", onError);
            reject(new Error("Video failed to load"));
          };

          video.addEventListener("loadedmetadata", onLoadedMetadata);
          video.addEventListener("error", onError);

          // Timeout fallback
          setTimeout(() => {
            video.removeEventListener("loadedmetadata", onLoadedMetadata);
            video.removeEventListener("error", onError);
            resolve();
          }, 3000);
        });

        setCameraPermission("granted");
      }
    } catch (error: unknown) {
      console.error("Error accessing camera:", error);
      setCameraPermission("denied");

      const err = error as Error & { name?: string };

      if (
        err.name === "NotAllowedError" ||
        err.name === "PermissionDeniedError"
      ) {
        setCameraError(
          "Camera access denied. Please allow camera permissions and refresh the page."
        );
      } else if (
        err.name === "NotFoundError" ||
        err.name === "DevicesNotFoundError"
      ) {
        setCameraError(
          "No camera found. Please connect a camera and try again."
        );
      } else if (
        err.name === "NotReadableError" ||
        err.name === "TrackStartError"
      ) {
        setCameraError("Camera is already in use by another application.");
      } else if (
        err.name === "OverconstrainedError" ||
        err.name === "ConstraintNotSatisfiedError"
      ) {
        // Try one more time with absolute minimal constraints
        try {
          const fallbackStream = await navigator.mediaDevices.getUserMedia({
            video: true,
            audio: false,
          });
          if (videoRef.current) {
            videoRef.current.srcObject = fallbackStream;
            streamRef.current = fallbackStream;
            setCameraPermission("granted");
            setCameraError(null);
            return;
          }
        } catch {
          setCameraError("Camera does not meet the required specifications.");
        }
      } else {
        setCameraError(
          `Camera error: ${err.message || "Unknown error occurred"}`
        );
      }
    }
  }, []);

  // Stop camera stream
  const stopCamera = useCallback(() => {
    if (streamRef.current) {
      streamRef.current.getTracks().forEach((track) => track.stop());
      streamRef.current = null;
    }
  }, []);

  // Retry camera access
  const retryCamera = useCallback(() => {
    setCameraPermission("pending");
    setCameraError(null);
    startCamera();
  }, [startCamera]);

  // Check permission on mount (with mobile compatibility)
  useEffect(() => {
    const checkPermission = async () => {
      // Skip permission query on iOS - it's not supported and can cause issues
      const isIOS = /iPad|iPhone|iPod/.test(navigator.userAgent);

      if (isIOS || !navigator.permissions) {
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
          setCameraError(
            "Camera access denied. Please allow camera permissions and refresh the page."
          );
        } else {
          setCameraPermission("prompt");
        }

        result.onchange = () => {
          setCameraPermission(result.state as CameraPermissionState);
        };
      } catch {
        // Permissions API not supported or failed - default to prompt
        setCameraPermission("prompt");
      }
    };

    checkPermission();
  }, []);

  // Start camera when permission is granted (desktop auto-start)
  useEffect(() => {
    if (cameraPermission === "granted" && !streamRef.current) {
      startCamera();
    }
  }, [cameraPermission, startCamera]);

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      stopCamera();
    };
  }, [stopCamera]);

  return {
    videoRef,
    canvasRef,
    streamRef,
    cameraPermission,
    cameraError,
    startCamera,
    stopCamera,
    retryCamera,
  };
}
