"use client";

import { useCallback, useRef } from "react";
import { v4 as uuidv4 } from "uuid";
import { usePhotoBooth } from "../contexts/PhotoBoothContext";
import { loveWords } from "../data/filters";
import { getFilterStyle } from "../utils/filterUtils";

interface UsePhotoCaptureProps {
  videoRef: React.RefObject<HTMLVideoElement | null>;
  canvasRef: React.RefObject<HTMLCanvasElement | null>;
  cameraReady: boolean;
  onBeep?: () => void;
  onShutter?: () => void;
}

interface UsePhotoCaptureReturn {
  takePhoto: () => void;
  startCountdownCapture: () => void;
  isBurstingRef: React.RefObject<boolean>;
}

export function usePhotoCapture({
  videoRef,
  canvasRef,
  cameraReady,
  onBeep,
  onShutter,
}: UsePhotoCaptureProps): UsePhotoCaptureReturn {
  const {
    state,
    addPhoto,
    setCountdownState,
    setBurstProgress,
    setCapturing,
  } = usePhotoBooth();

  const isBurstingRef = useRef(false);

  const {
    selectedFilter,
    filterIntensity,
    selectedFrame,
    isMirrored,
    selectedDelay,
    selectedPhotoCount,
    isCountingDown,
    currentBurstCount,
  } = state;

  // Take a single photo
  const takePhoto = useCallback(() => {
    const video = videoRef.current;
    const canvas = canvasRef.current;
    if (!video || !canvas) return;

    const ctx = canvas.getContext("2d");
    canvas.width = video.videoWidth;
    canvas.height = video.videoHeight;

    const filterStyle = getFilterStyle(selectedFilter.name, filterIntensity);
    const randomWord = loveWords[Math.floor(Math.random() * loveWords.length)];

    if (ctx) {
      ctx.scale(-1, 1);
      ctx.drawImage(video, -canvas.width, 0);
      ctx.setTransform(1, 0, 0, 1, 0, 0);
      const photo = canvas.toDataURL("image/png");

      addPhoto({
        id: uuidv4(),
        image: photo,
        filter: filterStyle,
        loveWord: randomWord,
        mirror: isMirrored,
        frame: {
          name: selectedFrame.name,
          style: selectedFrame.style,
          strokeColor: selectedFrame.strokeColor,
        },
      });
    }
  }, [
    videoRef,
    canvasRef,
    selectedFilter,
    filterIntensity,
    selectedFrame,
    isMirrored,
    addPhoto,
  ]);

  // Start countdown and capture photos
  const startCountdownCapture = useCallback(() => {
    if (!cameraReady || isCountingDown || isBurstingRef.current) return;

    setBurstProgress(0);
    isBurstingRef.current = true;

    const captureNext = (burstCount: number) => {
      if (burstCount >= selectedPhotoCount) {
        isBurstingRef.current = false;
        setCapturing(false);
        setBurstProgress(0);
        return;
      }

      setCountdownState(true, selectedDelay);
      onBeep?.(); // Initial beep

      let currentCountdown = selectedDelay;
      const countdownInterval = setInterval(() => {
        currentCountdown -= 1;

        if (currentCountdown <= 0) {
          clearInterval(countdownInterval);
          setCountdownState(false, 0);

          // Flash effect and shutter sound
          setCapturing(false);
          setTimeout(() => {
            setCapturing(true);
            onShutter?.();
            takePhoto();
            setTimeout(() => setCapturing(false), 200);
          }, 0);

          const nextBurstCount = burstCount + 1;
          setBurstProgress(nextBurstCount);

          if (nextBurstCount < selectedPhotoCount) {
            setTimeout(() => captureNext(nextBurstCount), 500);
          } else {
            isBurstingRef.current = false;
            setCapturing(false);
            setBurstProgress(0);
          }
        } else {
          setCountdownState(true, currentCountdown);
          onBeep?.(); // Beep on each countdown tick
        }
      }, 1000);
    };

    captureNext(0);
  }, [
    cameraReady,
    isCountingDown,
    selectedDelay,
    selectedPhotoCount,
    takePhoto,
    setCountdownState,
    setBurstProgress,
    setCapturing,
    onBeep,
    onShutter,
  ]);

  return {
    takePhoto,
    startCountdownCapture,
    isBurstingRef,
  };
}
