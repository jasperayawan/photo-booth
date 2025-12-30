"use client";

import { ExternalLink, Sparkles, Printer } from "lucide-react";
import { BANNER_CONFIG, type Sponsor } from "@/data/premium";

interface DownloadBannerProps {
  sponsor?: Sponsor | null;
  onPrintClick?: () => void;
  showPrintOption?: boolean;
}

export default function DownloadBanner({
  sponsor = BANNER_CONFIG.sponsor,
  onPrintClick,
  showPrintOption = true,
}: DownloadBannerProps) {
  if (!BANNER_CONFIG.enabled) return null;

  // If there's an active sponsor
  if (sponsor && sponsor.active) {
    return (
      <div className="mt-3 p-3 bg-stone-50 rounded-lg border border-stone-100">
        <a
          href={sponsor.link}
          target="_blank"
          rel="noopener noreferrer"
          className="flex items-center gap-3 group"
        >
          {sponsor.logo && (
            <img
              src={sponsor.logo}
              alt={sponsor.name}
              className="w-8 h-8 object-contain rounded"
            />
          )}
          <div className="flex-1 min-w-0">
            <p className="text-xs text-stone-400">Sponsored</p>
            <p className="text-sm text-stone-600 font-medium truncate group-hover:text-stone-800 transition-colors">
              {sponsor.message || `Powered by ${sponsor.name}`}
            </p>
          </div>
          <ExternalLink size={14} className="text-stone-400 group-hover:text-stone-600 transition-colors" />
        </a>
      </div>
    );
  }

  // Default banner with print option
  return (
    <div className="mt-3 p-3 bg-gradient-to-r from-stone-50 to-amber-50/50 rounded-lg border border-stone-100">
      <div className="flex items-center justify-between gap-3">
        <div className="flex items-center gap-2">
          <Sparkles size={14} className="text-amber-500" />
          <p className="text-xs text-stone-500">
            {BANNER_CONFIG.fallbackMessage}
          </p>
        </div>

        {showPrintOption && onPrintClick && (
          <button
            onClick={onPrintClick}
            className="
              flex items-center gap-1.5
              text-xs font-medium text-stone-600
              px-3 py-1.5 rounded-full
              bg-white border border-stone-200
              hover:border-stone-300 hover:bg-stone-50
              transition-all cursor-pointer
            "
          >
            <Printer size={12} />
            Print
          </button>
        )}
      </div>

      {/* Upgrade hint */}
      <div className="mt-2 flex items-center gap-2">
        <p className="text-[10px] text-stone-400">
          Remove watermark & ads with Pro
        </p>
        <a
          href="#pricing"
          className="text-[10px] text-amber-600 hover:text-amber-700 font-medium"
        >
          Upgrade
        </a>
      </div>
    </div>
  );
}

/**
 * Minimal inline banner for modals
 */
export function InlineBanner({ onPrintClick }: { onPrintClick?: () => void }) {
  return (
    <div className="flex items-center justify-center gap-4 text-xs text-stone-400 mt-2">
      <span>photobooth.app</span>
      {onPrintClick && (
        <>
          <span className="text-stone-300">|</span>
          <button
            onClick={onPrintClick}
            className="flex items-center gap-1 text-stone-500 hover:text-stone-700 transition-colors cursor-pointer"
          >
            <Printer size={12} />
            Order Print
          </button>
        </>
      )}
    </div>
  );
}
