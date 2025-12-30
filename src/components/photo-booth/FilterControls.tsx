"use client";

import { Palette } from "lucide-react";
import { filters } from "../../data/filters";
import { usePhotoBooth } from "../../contexts/PhotoBoothContext";
import FilterSelection from "../FilterSelection";

export default function FilterControls() {
  const { state, setSelectedFilter, setFilterIntensity } = usePhotoBooth();
  const { selectedFilter, filterIntensity } = state;

  return (
    <div>
      <h3 className="text-stone-500 text-xs uppercase tracking-wide mb-3 flex items-center gap-2">
        <Palette className="w-3.5 h-3.5" />
        Filters
      </h3>
      <FilterSelection
        filters={filters}
        handleSelectFilter={setSelectedFilter}
        setFilterIntensity={setFilterIntensity}
        selectedFilter={selectedFilter}
        setSelectedFilter={setSelectedFilter}
      />

      {/* Filter intensity slider */}
      {selectedFilter.value !== "none" && (
        <div className="flex items-center gap-3 mt-3">
          <span className="text-stone-500 text-xs">Intensity</span>
          <input
            type="range"
            min={0}
            max={1}
            step={0.01}
            value={filterIntensity}
            onChange={(e) => setFilterIntensity(Number(e.target.value))}
            className="flex-1 accent-stone-700 h-1 bg-stone-300 rounded-full appearance-none cursor-pointer"
          />
          <span className="text-stone-600 text-xs font-mono w-8 text-right">
            {Math.round(filterIntensity * 100)}%
          </span>
        </div>
      )}
    </div>
  );
}
