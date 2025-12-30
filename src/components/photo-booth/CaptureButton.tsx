"use client";

interface CaptureButtonProps {
  onCapture: () => void;
  disabled: boolean;
}

export default function CaptureButton({
  onCapture,
  disabled,
}: CaptureButtonProps) {
  return (
    <button
      onClick={onCapture}
      className="group cursor-pointer disabled:cursor-not-allowed"
      disabled={disabled}
      title="Take photo (Space)"
    >
      {/* Outer glow ring */}
      <div
        className={`
          relative w-16 h-16 rounded-full
          flex items-center justify-center
          transition-all duration-200
          ${disabled ? "opacity-50" : ""}
        `}
      >
        {/* Outer ring */}
        <div
          className={`
            absolute inset-0 rounded-full
            border-[3px] border-white/80
            transition-all duration-200
            ${disabled ? "" : "group-hover:border-white group-hover:scale-105"}
          `}
          style={{
            boxShadow: '0 0 20px rgba(255,255,255,0.3)',
          }}
        />

        {/* Inner filled circle */}
        <div
          className={`
            w-11 h-11 rounded-full
            bg-white
            transition-all duration-150
            shadow-inner
            ${disabled ? "" : "group-hover:scale-95 group-active:scale-90 group-active:bg-stone-100"}
          `}
        />
      </div>
    </button>
  );
}
