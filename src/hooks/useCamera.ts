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

  // Start camera stream
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
        setCameraError("Camera does not meet the required specifications.");
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

  // Check permission on mount
  useEffect(() => {
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
        setCameraPermission("prompt");
      }
    };

    checkPermission();
  }, []);

  // Start camera when permission is granted
  useEffect(() => {
    if (cameraPermission === "granted") {
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
