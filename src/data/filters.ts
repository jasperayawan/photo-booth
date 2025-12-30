import { Camera, Palette, Sparkles, Zap, Star, Heart, Sun, Moon, Cloud, Flame } from "lucide-react";

export const filters = [
  // Basic
  { name: "None", value: "none", intensity: 1, icon: Camera, color: "bg-gray-500" },
  { name: "B&W", value: "grayscale(100%)", intensity: 1, icon: Sparkles, color: "bg-gray-700" },

  // Warm tones
  { name: "Vintage", value: "sepia(100%) contrast(120%)", intensity: 1, icon: Palette, color: "bg-amber-500" },
  { name: "Warm", value: "hue-rotate(30deg) saturate(130%)", intensity: 1, icon: Flame, color: "bg-orange-500" },
  { name: "Golden", value: "sepia(50%) saturate(140%) brightness(110%)", intensity: 1, icon: Sun, color: "bg-yellow-500" },

  // Cool tones
  { name: "Cool", value: "hue-rotate(180deg) saturate(150%)", intensity: 1, icon: Star, color: "bg-blue-500" },
  { name: "Arctic", value: "hue-rotate(200deg) saturate(80%) brightness(110%)", intensity: 1, icon: Cloud, color: "bg-cyan-400" },

  // Vibrant
  { name: "Vibrant", value: "saturate(200%) contrast(120%)", intensity: 1, icon: Zap, color: "bg-purple-500" },
  { name: "Pop Art", value: "saturate(300%) contrast(150%) brightness(110%)", intensity: 1, icon: Zap, color: "bg-pink-500" },

  // Moody
  { name: "Noir", value: "grayscale(100%) contrast(150%) brightness(90%)", intensity: 1, icon: Moon, color: "bg-gray-900" },
  { name: "Fade", value: "contrast(90%) brightness(110%) saturate(80%)", intensity: 1, icon: Cloud, color: "bg-slate-400" },
  { name: "Twilight", value: "hue-rotate(270deg) saturate(60%) brightness(90%)", intensity: 1, icon: Moon, color: "bg-indigo-600" },

  // Artistic
  { name: "Dreamy", value: "blur(1px) brightness(110%) saturate(120%)", intensity: 1, icon: Heart, color: "bg-pink-300" },
  { name: "Vignette", value: "contrast(110%) brightness(95%)", intensity: 1, icon: Camera, color: "bg-gray-600" },
  { name: "Retro", value: "sepia(40%) hue-rotate(-10deg) saturate(150%)", intensity: 1, icon: Palette, color: "bg-amber-600" },
];

export const frames = [
  // Basic
  { name: "None", style: "", strokeColor: "" },
  { name: "Classic", style: "border-8 border-white", strokeColor: "#ffffff" },
  { name: "Black", style: "border-8 border-black", strokeColor: "#000000" },

  // Colors
  { name: "Pink", style: "border-4 border-pink-400", strokeColor: "#ec4899" },
  { name: "Blue", style: "border-4 border-cyan-400", strokeColor: "#22d3ee" },
  { name: "Green", style: "border-4 border-lime-400", strokeColor: "#a3e635" },

  // Metallic
  { name: "Gold", style: "border-4 border-yellow-400", strokeColor: "#facc15" },
  { name: "Silver", style: "border-4 border-gray-300", strokeColor: "#d1d5db" },
  { name: "Rose", style: "border-4 border-rose-300", strokeColor: "#fda4af" },

  // Special
  { name: "Polaroid", style: "border-8 border-b-16 border-white", strokeColor: "#ffffff" },
  { name: "Vintage", style: "border-8 border-amber-100", strokeColor: "#fef3c7" },
];

export const delayOptions = [
  { label: "1s", value: 1 },
  { label: "3s", value: 3 },
  { label: "5s", value: 5 },
  { label: "10s", value: 10 },
];

export const loveWords = [
    "Love",
    "Affection",
    "Adoration",
    "Passion",
    "Devotion",
    "Fondness",
    "Cherish",
    "Sweetheart",
    "Romance",
    "Amour",
    "Admiration",
    "Tenderness",
    "Heartfelt",
    "Beloved",
    "Endearment",
    "LOL", "Goofy", "Silly", "Oops!", "Cringe", 
    "No Chill", "Epic Fail", "Meme King", "Clown Mode", "Snack Attack",
    "Bruh", "Chill Pill", "Zero Thoughts", "I'm Baby", "Vibe Check",
    "Lonely", "Tears", "Melancholy", "Broken", "Lost",
    "Rainy Days", "Empty", "Goodbye", "Miss You", "Fade Away",
    "Cold Inside", "Quiet Cry", "Still Waiting", "Painful Smile", "Gone",
    "You Got This", "Keep Going", "Stay Strong", "Rise Up", "Never Quit",
    "Focus", "Dream Big", "One Step", "Believe", "Unstoppable",
    "Be You", "Make It Happen", "Shine Bright", "Hustle Hard", "Growth",
    "Island Vibes", "Caffeine", "Sunkissed", "Midnight", "Retro",
    "Pixelated", "Tropical", "Snapshot", "Late Night", "No Signal",
    "Glitch", "Chroma", "Polaroid", "Infinite", "Flashback"
  ];


// Options for selecting a countdown timer delay before capturing a photo.

export const photoCountOptions = [1, 2, 3, 4, 5, 6];