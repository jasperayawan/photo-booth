"use client";

import { useEffect, useCallback } from "react";

interface KeyboardShortcutsConfig {
  onCapture?: () => void;
  onToggleMirror?: () => void;
  onToggleFullscreen?: () => void;
  onExitFullscreen?: () => void;
  enabled?: boolean;
  isGalleryOpen?: boolean;
}

export function useKeyboardShortcuts({
  onCapture,
  onToggleMirror,
  onToggleFullscreen,
  onExitFullscreen,
  enabled = true,
  isGalleryOpen = false,
}: KeyboardShortcutsConfig) {
  const handleKeyDown = useCallback(
    (event: KeyboardEvent) => {
      // Don't handle shortcuts if gallery is open (it has its own)
      // or if user is typing in an input
      if (
        !enabled ||
        isGalleryOpen ||
        event.target instanceof HTMLInputElement ||
        event.target instanceof HTMLTextAreaElement
      ) {
        return;
      }

      switch (event.key.toLowerCase()) {
        case " ": // Space - capture
          event.preventDefault();
          onCapture?.();
          break;
        case "m": // M - toggle mirror
          onToggleMirror?.();
          break;
        case "f": // F - toggle fullscreen
          onToggleFullscreen?.();
          break;
        case "escape": // Esc - exit fullscreen
          onExitFullscreen?.();
          break;
      }
    },
    [
      enabled,
      isGalleryOpen,
      onCapture,
      onToggleMirror,
      onToggleFullscreen,
      onExitFullscreen,
    ]
  );

  useEffect(() => {
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [handleKeyDown]);
}
