import { Camera, Palette, Sparkles, Zap, Star, Heart } from "lucide-react";

export const filters = [
  { name: "None", value: "none", icon: Camera, color: "bg-gray-500" },
  { name: "Vintage", value: "sepia(100%) contrast(120%)", icon: Palette, color: "bg-amber-500" },
  { name: "B&W", value: "grayscale(100%)", icon: Sparkles, color: "bg-gray-700" },
  { name: "Vibrant", value: "saturate(200%) contrast(120%)", icon: Zap, color: "bg-purple-500" },
  { name: "Cool", value: "hue-rotate(180deg) saturate(150%)", icon: Star, color: "bg-blue-500" },
  { name: "Warm", value: "hue-rotate(30deg) saturate(130%)", icon: Heart, color: "bg-red-500" },
  { name: "Twilight", value: "blur(2px) grayscale(100%)", icon: Heart, color: "bg-red-500" },
];

export const frames = [
  { name: "None", style: "" },
  { name: "Classic", style: "border-8 border-white shadow-2xl" },
  { name: "Polaroid", style: "border-8 border-white border-b-16 shadow-2xl bg-white p-2" },
  { name: "Neon", style: "border-4 border-pink-400 shadow-lg shadow-pink-400/50" },
  { name: "Gold", style: "border-6 border-yellow-400 shadow-lg shadow-yellow-400/30" },
];

export const delayOptions = [
  { label: "1s", value: 1 },
  { label: "3s", value: 3 },
  { label: "5s", value: 5 },
  { label: "10s", value: 10 },
];

// Options for selecting a countdown timer delay before capturing a photo.

export const photoCountOptions = [1, 2, 3, 4, 5, 6];