"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import { Camera, Heart, ArrowRight, Aperture } from "lucide-react";
import { supabase } from "@/lib/supabase";
import type { VisitorRow } from "../types/types";
import { formatCount, getRelativeVisitorTime } from "../utils/formatCount";
import GcashModal from "@/components/GcashModal";

export default function Home() {
  const [isOpenGcashModal, setIsOpenGcashModal] = useState(false);
  const [visitor, setVisitor] = useState<VisitorRow | null>(null);
  const [count, setCount] = useState<number | null>(null);
  const hasIncremented = useRef(false);

  // Animation states
  const [phase, setPhase] = useState<"loading" | "reveal" | "complete">("loading");

  useEffect(() => {
    // Start reveal animation
    const revealTimer = setTimeout(() => setPhase("reveal"), 300);
    const completeTimer = setTimeout(() => setPhase("complete"), 1500);

    return () => {
      clearTimeout(revealTimer);
      clearTimeout(completeTimer);
    };
  }, []);

  // Supabase visitor tracking
  useEffect(() => {
    if (!supabase) return;

    const client = supabase;

    const fetchVisitorCount = async () => {
      const { data } = await client
        .from("visitors")
        .select("*")
        .eq("id", 1)
        .single<VisitorRow>();

      if (data) {
        setVisitor(data);

        if (!hasIncremented.current) {
          hasIncremented.current = true;
          await client
            .from("visitors")
            .update({ count: data.count + 1 })
            .eq("id", 1);
        }
      }
    };

    fetchVisitorCount();
  }, []);

  useEffect(() => {
    if (!supabase) return;

    const client = supabase;

    const incrementVisitorCount = async () => {
      if (count !== null && !hasIncremented.current) {
        hasIncremented.current = true;
        await client
          .from("visitors")
          .update({ count: count + 1 })
          .eq("id", 1);
      }
    };

    incrementVisitorCount();
  }, [count]);

  useEffect(() => {
    if (!supabase) return;

    const client = supabase;

    const channel = client
      .channel("realtime-visitors")
      .on(
        "postgres_changes",
        { event: "UPDATE", schema: "public", table: "visitors" },
        (payload) => {
          const updatedCount = payload.new.count;
          setCount(updatedCount);
        }
      )
      .subscribe();

    return () => {
      client.removeChannel(channel);
    };
  }, []);

  const isRevealed = phase === "reveal" || phase === "complete";

  return (
    <div className="min-h-screen bg-[#d4c4b5] relative overflow-hidden">
      {/* Background layers */}
      <div
        className="fixed inset-0 pointer-events-none"
        style={{
          background: `linear-gradient(135deg, #d9cec0 0%, #c9b8a8 50%, #d4c4b5 100%)`,
        }}
      />

      {/* Paper texture */}
      <div
        className="fixed inset-0 pointer-events-none opacity-20"
        style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noise'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%' height='100%' filter='url(%23noise)'/%3E%3C/svg%3E")`,
        }}
      />

      {/* Decorative circles */}
      <div
        className={`
          absolute top-20 -left-32 w-64 h-64 rounded-full
          bg-gradient-to-br from-stone-300/30 to-transparent
          transition-all duration-1000 ease-out
          ${isRevealed ? "opacity-100 scale-100" : "opacity-0 scale-50"}
        `}
      />
      <div
        className={`
          absolute -bottom-20 -right-20 w-80 h-80 rounded-full
          bg-gradient-to-tl from-stone-400/20 to-transparent
          transition-all duration-1000 ease-out delay-200
          ${isRevealed ? "opacity-100 scale-100" : "opacity-0 scale-50"}
        `}
      />

      {/* Floating leaf accents */}
      <div
        className={`
          absolute top-1/4 -left-10 opacity-20
          transition-all duration-700 ease-out
          ${isRevealed ? "translate-x-0 opacity-20" : "-translate-x-full opacity-0"}
        `}
        style={{ transitionDelay: "400ms" }}
      >
        <LeafSVG size={100} rotation={-15} />
      </div>
      <div
        className={`
          absolute bottom-1/3 -right-8 opacity-20
          transition-all duration-700 ease-out
          ${isRevealed ? "translate-x-0 opacity-20" : "translate-x-full opacity-0"}
        `}
        style={{ transitionDelay: "600ms" }}
      >
        <LeafSVG size={80} rotation={160} flipped />
      </div>

      {/* GCash Modal */}
      {isOpenGcashModal && (
        <GcashModal
          isOpen={isOpenGcashModal}
          onClose={() => setIsOpenGcashModal(false)}
        />
      )}

      {/* Main content */}
      <div className="relative z-10 min-h-screen flex flex-col items-center justify-center px-6">
        {/* Camera icon with animation */}
        <div
          className={`
            relative mb-8
            transition-all duration-700 ease-out
            ${isRevealed ? "opacity-100 scale-100 translate-y-0" : "opacity-0 scale-75 translate-y-4"}
          `}
        >
          {/* Outer ring pulse */}
          <div
            className={`
              absolute inset-0 -m-6 rounded-full border border-stone-400/30
              transition-all duration-1000 ease-out
              ${phase === "complete" ? "scale-150 opacity-0" : "scale-100 opacity-100"}
            `}
          />
          <div
            className={`
              absolute inset-0 -m-3 rounded-full border border-stone-400/20
              transition-all duration-800 ease-out delay-100
              ${phase === "complete" ? "scale-125 opacity-0" : "scale-100 opacity-100"}
            `}
          />

          {/* Camera icon container */}
          <div className="w-24 h-24 rounded-full bg-white shadow-lg flex items-center justify-center">
            <Aperture
              size={40}
              className={`
                text-stone-600
                transition-transform duration-500
                ${phase === "complete" ? "rotate-90" : "rotate-0"}
              `}
            />
          </div>
        </div>

        {/* Title */}
        <h1
          className={`
            photobooth-title text-6xl sm:text-7xl lg:text-8xl text-stone-700
            transition-all duration-700 ease-out
            ${isRevealed ? "opacity-100 translate-y-0" : "opacity-0 translate-y-6"}
          `}
          style={{ transitionDelay: "150ms" }}
        >
          Photo Booth
        </h1>

        {/* Subtitle */}
        <p
          className={`
            mt-4 text-stone-500 text-center max-w-sm
            transition-all duration-700 ease-out
            ${isRevealed ? "opacity-100 translate-y-0" : "opacity-0 translate-y-4"}
          `}
          style={{ transitionDelay: "300ms" }}
        >
          Capture moments, create memories
        </p>

        {/* Decorative line */}
        <div
          className={`
            my-8 h-px bg-stone-400/40
            transition-all duration-700 ease-out
            ${isRevealed ? "w-24 opacity-100" : "w-0 opacity-0"}
          `}
          style={{ transitionDelay: "450ms" }}
        />

        {/* Action buttons */}
        <div
          className={`
            flex flex-col sm:flex-row items-center gap-4
            transition-all duration-700 ease-out
            ${isRevealed ? "opacity-100 translate-y-0" : "opacity-0 translate-y-6"}
          `}
          style={{ transitionDelay: "550ms" }}
        >
          {/* Start button */}
          <Link
            href="/photo-booth"
            className="
              group flex items-center gap-3
              bg-stone-700 text-white
              px-8 py-4 rounded-full
              font-medium tracking-wide
              cursor-pointer transition-all duration-300
              hover:bg-stone-800 hover:shadow-xl hover:scale-105
            "
          >
            <Camera size={20} />
            <span>Start Capturing</span>
            <ArrowRight
              size={18}
              className="transition-transform duration-300 group-hover:translate-x-1"
            />
          </Link>

          {/* Support button */}
          <button
            onClick={() => setIsOpenGcashModal(true)}
            className="
              flex items-center gap-2
              bg-white/80 backdrop-blur-sm
              text-stone-600
              px-6 py-4 rounded-full
              font-medium
              cursor-pointer transition-all duration-300
              hover:bg-white hover:shadow-lg hover:scale-105
              border border-stone-200
            "
          >
            <Heart size={18} className="text-rose-400" />
            <span>Support</span>
          </button>
        </div>

        {/* Support message */}
        <p
          className={`
            mt-8 text-stone-400 text-sm text-center max-w-xs
            transition-all duration-700 ease-out
            ${isRevealed ? "opacity-100 translate-y-0" : "opacity-0 translate-y-4"}
          `}
          style={{ transitionDelay: "700ms" }}
        >
          Your support helps me continue my studies. Every contribution matters.
        </p>

        {/* Footer info */}
        <div
          className={`
            absolute bottom-8 left-0 right-0
            flex flex-col items-center gap-1
            transition-all duration-700 ease-out
            ${isRevealed ? "opacity-100 translate-y-0" : "opacity-0 translate-y-4"}
          `}
          style={{ transitionDelay: "850ms" }}
        >
          <p className="text-stone-400 text-xs tracking-wider">
            v2.1.0
            {visitor && (
              <>
                <span className="mx-2">•</span>
                <span className="text-stone-600 font-medium">
                  {(formatCount(visitor?.count ?? null) || "").replace(
                    /\.0(?=[kMB])/,
                    ""
                  )}{" "}
                  visitors
                </span>
              </>
            )}
          </p>
          {visitor?.updated_at && (
            <p className="text-stone-400/60 text-xs">
              {getRelativeVisitorTime(visitor.updated_at)}
            </p>
          )}
        </div>
      </div>
    </div>
  );
}

// Leaf SVG component
function LeafSVG({
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
        opacity="0.7"
      />
      <path
        d="M50 20 Q48 80, 50 140"
        stroke="#2d5a3d"
        strokeWidth="2"
        fill="none"
        opacity="0.5"
      />
      <path
        d="M50 40 Q35 50, 25 55
           M50 60 Q32 72, 22 80
           M50 80 Q35 92, 28 102"
        stroke="#2d5a3d"
        strokeWidth="1"
        fill="none"
        opacity="0.3"
      />
      <path
        d="M50 40 Q65 50, 75 55
           M50 60 Q68 72, 78 80
           M50 80 Q65 92, 72 102"
        stroke="#2d5a3d"
        strokeWidth="1"
        fill="none"
        opacity="0.3"
      />
    </svg>
  );
}
