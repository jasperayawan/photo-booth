import { Camera, Palette, Sparkles, Zap, Star, Heart } from "lucide-react";

export const filters = [
  { name: "None", value: "none", intensity: 1, icon: Camera, color: "bg-gray-500" },
  { name: "Vintage", value: "sepia(100%) contrast(120%)", intensity: 1, icon: Palette, color: "bg-amber-500" },
  { name: "B&W", value: "grayscale(100%)", intensity: 1, icon: Sparkles, color: "bg-gray-700" },
  { name: "Vibrant", value: "saturate(200%) contrast(120%)", intensity: 1, icon: Zap, color: "bg-purple-500" },
  { name: "Cool", value: "hue-rotate(180deg) saturate(150%)", intensity: 1, icon: Star, color: "bg-blue-500" },
  { name: "Warm", value: "hue-rotate(30deg) saturate(130%)", intensity: 1, icon: Heart, color: "bg-red-500" },
  { name: "Twilight", value: "blur(2px) grayscale(100%)", intensity: 1, icon: Heart, color: "bg-red-500" },
];

export const frames = [
  { name: "None", style: "", strokeColor: "" },
  { name: "Classic", style: "border-8 border-white shadow-2xl", strokeColor: "#ffffff" },
  { name: "Neon", style: "border-4 border-pink-400 shadow-lg shadow-pink-400/50", strokeColor: "#ec4899" }, // Tailwind pink-400
  { name: "Gold", style: "border-6 border-yellow-400 shadow-lg shadow-yellow-400/30", strokeColor: "#facc15" }, // Tailwind yellow-400
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