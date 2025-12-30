"use client";

import { Camera } from "lucide-react";
import type { CameraPermissionState } from "../../types/types";

interface CameraPermissionPromptProps {
  permission: CameraPermissionState;
  error: string | null;
  onRequestAccess: () => void;
  onRetry: () => void;
}

export default function CameraPermissionPrompt({
  permission,
  error,
  onRequestAccess,
  onRetry,
}: CameraPermissionPromptProps) {
  if (permission === "granted") {
    return null;
  }

  if (permission === "denied") {
    return (
      <div className="w-full h-64 bg-gray-800 flex items-center justify-center rounded-lg">
        <div className="text-center text-white p-6">
          <Camera className="w-8 h-8 mx-auto mb-4 text-red-400" />
          <h3 className="text-lg font-semibold mb-2">Camera Access Required</h3>
          <p className="text-sm text-gray-300 mb-4">{error}</p>
          <div className="flex justify-center items-center flex-col space-y-2">
            <button
              onClick={onRetry}
              className="flex justify-center items-center text-white hover:underline hover:cursor-pointer"
            >
              <Camera className="w-4 h-4 mr-2" />
              Try Again
            </button>
            <div className="text-xs text-gray-400">
              <p>To enable camera:</p>
              <p>1. Click the camera icon in your browser&apos;s address bar</p>
              <p>2. Select &quot;Allow&quot; for camera access</p>
              <p>3. Refresh the page</p>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // Prompt or pending state
  return (
    <div className="w-full h-64 bg-gray-800 flex justify-center items-center rounded-lg">
      <div className="text-center text-white">
        <Camera className="w-12 h-12 mx-auto mb-4 animate-pulse" />
        <p className="mb-2">
          {permission === "pending" ? "Requesting camera access..." : "Camera access needed"}
        </p>
        <button
          onClick={onRequestAccess}
          className="bg-[#ACFA17] text-black rounded px-4 py-2 mt-2 cursor-pointer hover:bg-[#9de614] transition-colors"
        >
          Allow Camera Access
        </button>
      </div>
    </div>
  );
}
