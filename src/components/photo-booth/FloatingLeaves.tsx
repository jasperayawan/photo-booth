"use client";

// Floating leaves decoration component
export default function FloatingLeaves() {
  return (
    <div className="fixed inset-0 pointer-events-none overflow-hidden z-0">
      {/* Left side leaves */}
      <div className="absolute -left-10 top-1/4 animate-sway-slow">
        <Leaf size={120} rotation={-20} opacity={0.9} />
      </div>
      <div className="absolute -left-5 top-2/3 animate-sway-medium">
        <Leaf size={80} rotation={15} opacity={0.8} />
      </div>
      <div className="absolute left-10 bottom-20 animate-sway-slow" style={{ animationDelay: '-2s' }}>
        <Leaf size={60} rotation={-35} opacity={0.7} />
      </div>

      {/* Right side leaves */}
      <div className="absolute -right-8 top-1/3 animate-sway-medium" style={{ animationDelay: '-1s' }}>
        <Leaf size={100} rotation={200} opacity={0.85} flipped />
      </div>
      <div className="absolute -right-5 bottom-1/4 animate-sway-slow" style={{ animationDelay: '-3s' }}>
        <Leaf size={90} rotation={160} opacity={0.75} flipped />
      </div>
      <div className="absolute right-16 top-20 animate-sway-medium" style={{ animationDelay: '-0.5s' }}>
        <Leaf size={50} rotation={180} opacity={0.6} flipped />
      </div>

      {/* Bottom accent */}
      <div className="absolute left-1/4 -bottom-10 animate-sway-slow" style={{ animationDelay: '-1.5s' }}>
        <LeafBranch size={150} rotation={-10} opacity={0.8} />
      </div>
    </div>
  );
}

// Single leaf SVG
function Leaf({
  size = 100,
  rotation = 0,
  opacity = 1,
  flipped = false
}: {
  size?: number;
  rotation?: number;
  opacity?: number;
  flipped?: boolean;
}) {
  return (
    <svg
      width={size}
      height={size * 1.5}
      viewBox="0 0 100 150"
      style={{
        transform: `rotate(${rotation}deg) scaleX(${flipped ? -1 : 1})`,
        opacity,
      }}
    >
      {/* Leaf shape */}
      <path
        d="M50 10
           C20 30, 10 70, 15 100
           C20 120, 35 140, 50 145
           C65 140, 80 120, 85 100
           C90 70, 80 30, 50 10Z"
        fill="url(#leafGradient)"
      />
      {/* Center vein */}
      <path
        d="M50 20 Q48 80, 50 140"
        stroke="#2d5a3d"
        strokeWidth="2"
        fill="none"
        opacity="0.6"
      />
      {/* Side veins */}
      <path
        d="M50 40 Q35 50, 25 55
           M50 60 Q32 72, 22 80
           M50 80 Q35 92, 28 102
           M50 100 Q40 110, 35 118"
        stroke="#2d5a3d"
        strokeWidth="1"
        fill="none"
        opacity="0.4"
      />
      <path
        d="M50 40 Q65 50, 75 55
           M50 60 Q68 72, 78 80
           M50 80 Q65 92, 72 102
           M50 100 Q60 110, 65 118"
        stroke="#2d5a3d"
        strokeWidth="1"
        fill="none"
        opacity="0.4"
      />
      <defs>
        <linearGradient id="leafGradient" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#4a7c59" />
          <stop offset="50%" stopColor="#3d6b4f" />
          <stop offset="100%" stopColor="#2d5a3d" />
        </linearGradient>
      </defs>
    </svg>
  );
}

// Leaf branch with stem
function LeafBranch({
  size = 150,
  rotation = 0,
  opacity = 1
}: {
  size?: number;
  rotation?: number;
  opacity?: number;
}) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 150 150"
      style={{
        transform: `rotate(${rotation}deg)`,
        opacity,
      }}
    >
      {/* Stem */}
      <path
        d="M10 140 Q50 100, 75 60 Q90 30, 100 10"
        stroke="#5a4a3a"
        strokeWidth="3"
        fill="none"
        strokeLinecap="round"
      />
      {/* Leaves on branch */}
      <g transform="translate(70, 50) rotate(-30)">
        <path
          d="M0 0 C-15 10, -20 30, -15 45 C-10 55, 0 60, 10 55 C20 50, 25 30, 20 15 C15 5, 5 -5, 0 0Z"
          fill="url(#branchLeafGradient)"
        />
      </g>
      <g transform="translate(85, 35) rotate(-60)">
        <path
          d="M0 0 C-12 8, -16 24, -12 36 C-8 44, 0 48, 8 44 C16 40, 20 24, 16 12 C12 4, 4 -4, 0 0Z"
          fill="url(#branchLeafGradient)"
        />
      </g>
      <g transform="translate(55, 70) rotate(10)">
        <path
          d="M0 0 C-12 8, -16 24, -12 36 C-8 44, 0 48, 8 44 C16 40, 20 24, 16 12 C12 4, 4 -4, 0 0Z"
          fill="url(#branchLeafGradient)"
        />
      </g>
      <defs>
        <linearGradient id="branchLeafGradient" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#5a8f6a" />
          <stop offset="50%" stopColor="#4a7c59" />
          <stop offset="100%" stopColor="#3d6b4f" />
        </linearGradient>
      </defs>
    </svg>
  );
}
