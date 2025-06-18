import React from "react";
import type { Filter } from "@/types/types";


interface FilterSelectorProps {
  filters: Filter[];
  handleSelectFilter: (filter: Filter) => void;
  setFilterIntensity: (intensity: number) => void;
  selectedFilter: Filter;
  setSelectedFilter: (filter: Filter) => void;
}

const FilterSelection = ({
  filters,
  selectedFilter,
  setFilterIntensity,
  setSelectedFilter,
  handleSelectFilter
}: FilterSelectorProps) => {
  return <div className="flex flex-wrap gap-2">
    {filters.map((filter) => (
      <button
        key={filter.name}
        onClick={() => handleSelectFilter(filter)}
        className={`flex-col text-white cursor-pointer border-white/20 hover:scale-105 transition-transform flex justify-center items-center ${
          selectedFilter.name === filter.name ? "bg-zinc-800" : ""
        }`}
      > 
        <img
          src="/maila.jpg"
          className="w-10 h-10 rounded-full object-cover"
          style={{ filter: filter.value }}
          alt={filter.name}
        />
        <span className="text-sm text-zinc-400">{filter.name}</span>
      </button>
    ))}
  </div>;
};

export default FilterSelection;
