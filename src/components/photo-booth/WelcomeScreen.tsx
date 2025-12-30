"use client";

import { useState, useEffect } from "react";
import { Camera } from "lucide-react";

interface WelcomeScreenProps {
  onComplete: () => void;
}

export default function WelcomeScreen({ onComplete }: WelcomeScreenProps) {
  const [phase, setPhase] = useState<"initial" | "reveal" | "exit">("initial");

  useEffect(() => {
    // Phase 1: Initial state (brief pause)
    const revealTimer = setTimeout(() => {
      setPhase("reveal");
    }, 100);

    // Phase 2: Start exit after reveal animation
    const exitTimer = setTimeout(() => {
      setPhase("exit");
    }, 2200);

    // Phase 3: Complete and unmount
    const completeTimer = setTimeout(() => {
      onComplete();
    }, 2800);

    return () => {
      clearTimeout(revealTimer);
      clearTimeout(exitTimer);
      clearTimeout(completeTimer);
    };
  }, [onComplete]);

  return (
    <div
      className={`
        fixed inset-0 z-[100] flex items-center justify-center
        bg-[#d4c4b5]
        transition-opacity duration-500 ease-out
        ${phase === "exit" ? "opacity-0 pointer-events-none" : "opacity-100"}
      `}
    >
      {/* Warm gradient background */}
      <div
        className="absolute inset-0"
        style={{
          background: `linear-gradient(135deg, #d9cec0 0%, #c9b8a8 50%, #d4c4b5 100%)`,
        }}
      />

      {/* Animated content */}
      <div className="relative z-10 flex flex-col items-center">
        {/* Camera icon with pulse */}
        <div
          className={`
            relative mb-6
            transition-all duration-700 ease-out
            ${phase === "reveal" ? "opacity-100 scale-100" : "opacity-0 scale-75"}
          `}
          style={{ transitionDelay: "100ms" }}
        >
          {/* Outer ring animation */}
          <div
            className={`
              absolute inset-0 -m-4 rounded-full
              border-2 border-stone-400/30
              transition-all duration-1000 ease-out
              ${phase === "reveal" ? "scale-150 opacity-0" : "scale-100 opacity-100"}
            `}
            style={{ transitionDelay: "400ms" }}
          />
          <div
            className={`
              absolute inset-0 -m-2 rounded-full
              border border-stone-400/20
              transition-all duration-800 ease-out
              ${phase === "reveal" ? "scale-125 opacity-0" : "scale-100 opacity-100"}
            `}
            style={{ transitionDelay: "600ms" }}
          />

          {/* Camera icon container */}
          <div className="w-20 h-20 rounded-full bg-white/80 backdrop-blur-sm shadow-lg flex items-center justify-center">
            <Camera size={36} className="text-stone-600" />
          </div>
        </div>

        {/* Title */}
        <h1
          className={`
            photobooth-title text-6xl lg:text-7xl text-stone-700
            transition-all duration-700 ease-out
            ${phase === "reveal" ? "opacity-100 translate-y-0" : "opacity-0 translate-y-4"}
          `}
          style={{ transitionDelay: "300ms" }}
        >
          Photo Booth
        </h1>

        {/* Subtitle */}
        <p
          className={`
            mt-3 text-stone-500 text-sm tracking-widest uppercase
            transition-all duration-700 ease-out
            ${phase === "reveal" ? "opacity-100 translate-y-0" : "opacity-0 translate-y-4"}
          `}
          style={{ transitionDelay: "500ms" }}
        >
          Capture your moments
        </p>

        {/* Decorative line */}
        <div
          className={`
            mt-6 h-px bg-stone-400/40
            transition-all duration-700 ease-out
            ${phase === "reveal" ? "w-32 opacity-100" : "w-0 opacity-0"}
          `}
          style={{ transitionDelay: "700ms" }}
        />

        {/* Loading dots */}
        <div
          className={`
            mt-6 flex gap-2
            transition-all duration-500 ease-out
            ${phase === "reveal" ? "opacity-100" : "opacity-0"}
          `}
          style={{ transitionDelay: "900ms" }}
        >
          <div
            className="w-2 h-2 rounded-full bg-stone-400 animate-bounce"
            style={{ animationDelay: "0ms" }}
          />
          <div
            className="w-2 h-2 rounded-full bg-stone-400 animate-bounce"
            style={{ animationDelay: "150ms" }}
          />
          <div
            className="w-2 h-2 rounded-full bg-stone-400 animate-bounce"
            style={{ animationDelay: "300ms" }}
          />
        </div>
      </div>

      {/* Decorative leaves (static, matching main page) */}
      <div className="absolute -left-10 top-1/4 opacity-20">
        <LeafDecoration size={120} rotation={-20} />
      </div>
      <div className="absolute -right-8 top-1/3 opacity-20">
        <LeafDecoration size={100} rotation={200} flipped />
      </div>
      <div className="absolute left-10 bottom-20 opacity-15">
        <LeafDecoration size={80} rotation={-35} />
      </div>
      <div className="absolute -right-5 bottom-1/4 opacity-15">
        <LeafDecoration size={90} rotation={160} flipped />
      </div>
    </div>
  );
}

// Simple leaf decoration for welcome screen
function LeafDecoration({
  size = 100,
  rotation = 0,
  flipped = false,
}: {
  size?: number;
  rotation?: number;
  flipped?: boolean;
}) {
  return (
    <svg
      width={size}
      height={size * 1.5}
      viewBox="0 0 100 150"
      style={{
        transform: `rotate(${rotation}deg) scaleX(${flipped ? -1 : 1})`,
      }}
    >
      <path
        d="M50 10
           C20 30, 10 70, 15 100
           C20 120, 35 140, 50 145
           C65 140, 80 120, 85 100
           C90 70, 80 30, 50 10Z"
        fill="#4a7c59"
        opacity="0.6"
      />
      <path
        d="M50 20 Q48 80, 50 140"
        stroke="#2d5a3d"
        strokeWidth="2"
        fill="none"
        opacity="0.4"
      />
    </svg>
  );
}
