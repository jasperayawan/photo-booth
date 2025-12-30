"use client";

import { useRef, useCallback, useEffect } from "react";

interface UseShutterSoundReturn {
  playShutter: () => void;
  playBeep: () => void;
}

/**
 * Creates a realistic camera shutter sound using Web Audio API
 * No external audio file needed!
 */
export function useShutterSound(): UseShutterSoundReturn {
  const audioContextRef = useRef<AudioContext | null>(null);

  // Initialize AudioContext on first user interaction
  const getAudioContext = useCallback(() => {
    if (!audioContextRef.current && typeof window !== "undefined") {
      audioContextRef.current = new (window.AudioContext ||
        (window as typeof window & { webkitAudioContext: typeof AudioContext }).webkitAudioContext)();
    }
    return audioContextRef.current;
  }, []);

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      if (audioContextRef.current) {
        audioContextRef.current.close();
        audioContextRef.current = null;
      }
    };
  }, []);

  const playShutter = useCallback(() => {
    const ctx = getAudioContext();
    if (!ctx) return;

    // Resume context if suspended (browser autoplay policy)
    if (ctx.state === "suspended") {
      ctx.resume();
    }

    const now = ctx.currentTime;

    // === Part 1: Initial mechanical click (high frequency snap) ===
    const clickOsc = ctx.createOscillator();
    const clickGain = ctx.createGain();
    clickOsc.type = "square";
    clickOsc.frequency.setValueAtTime(1800, now);
    clickOsc.frequency.exponentialRampToValueAtTime(200, now + 0.03);
    clickGain.gain.setValueAtTime(0.3, now);
    clickGain.gain.exponentialRampToValueAtTime(0.001, now + 0.03);
    clickOsc.connect(clickGain);
    clickGain.connect(ctx.destination);
    clickOsc.start(now);
    clickOsc.stop(now + 0.03);

    // === Part 2: Shutter mechanism noise ===
    const noiseBuffer = ctx.createBuffer(1, ctx.sampleRate * 0.08, ctx.sampleRate);
    const noiseData = noiseBuffer.getChannelData(0);
    for (let i = 0; i < noiseData.length; i++) {
      noiseData[i] = (Math.random() * 2 - 1) * 0.4;
    }
    const noiseSource = ctx.createBufferSource();
    noiseSource.buffer = noiseBuffer;
    const noiseGain = ctx.createGain();
    const noiseFilter = ctx.createBiquadFilter();
    noiseFilter.type = "bandpass";
    noiseFilter.frequency.value = 800;
    noiseFilter.Q.value = 1;
    noiseGain.gain.setValueAtTime(0.2, now + 0.01);
    noiseGain.gain.exponentialRampToValueAtTime(0.001, now + 0.08);
    noiseSource.connect(noiseFilter);
    noiseFilter.connect(noiseGain);
    noiseGain.connect(ctx.destination);
    noiseSource.start(now + 0.01);

    // === Part 3: Second click (shutter close) ===
    const click2Osc = ctx.createOscillator();
    const click2Gain = ctx.createGain();
    click2Osc.type = "square";
    click2Osc.frequency.setValueAtTime(1200, now + 0.06);
    click2Osc.frequency.exponentialRampToValueAtTime(150, now + 0.09);
    click2Gain.gain.setValueAtTime(0.2, now + 0.06);
    click2Gain.gain.exponentialRampToValueAtTime(0.001, now + 0.09);
    click2Osc.connect(click2Gain);
    click2Gain.connect(ctx.destination);
    click2Osc.start(now + 0.06);
    click2Osc.stop(now + 0.1);

  }, [getAudioContext]);

  // Play countdown beep sound
  const playBeep = useCallback(() => {
    const ctx = getAudioContext();
    if (!ctx) return;

    if (ctx.state === "suspended") {
      ctx.resume();
    }

    const now = ctx.currentTime;

    // Simple beep tone
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();

    osc.type = "sine";
    osc.frequency.setValueAtTime(880, now); // A5 note

    gain.gain.setValueAtTime(0.3, now);
    gain.gain.exponentialRampToValueAtTime(0.001, now + 0.15);

    osc.connect(gain);
    gain.connect(ctx.destination);

    osc.start(now);
    osc.stop(now + 0.15);
  }, [getAudioContext]);

  return {
    playShutter,
    playBeep,
  };
}
