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
  handleSelectFilter,
}: FilterSelectorProps) => {
  return (
    <div className="grid grid-cols-5 sm:grid-cols-6 md:grid-cols-7 gap-2">
      {filters.map((filter) => {
        const isSelected = selectedFilter.name === filter.name;
        return (
          <button
            key={filter.name}
            onClick={() => handleSelectFilter(filter)}
            className={`
              group flex flex-col items-center gap-1
              p-1.5 rounded-lg cursor-pointer
              transition-colors duration-150
              ${isSelected ? "bg-stone-200/50" : "hover:bg-stone-200/30"}
            `}
          >
            {/* Filter preview image */}
            <div
              className={`
                w-11 h-11 rounded-md overflow-hidden
                ${isSelected ? "ring-2 ring-stone-600" : ""}
              `}
            >
              <img
                src="/maila.jpg"
                className="w-full h-full object-cover"
                style={{ filter: filter.value }}
                alt={filter.name}
              />
            </div>

            {/* Filter name */}
            <span
              className={`
                text-[10px] leading-tight text-center truncate w-full
                ${isSelected ? "text-stone-700 font-medium" : "text-stone-500"}
              `}
            >
              {filter.name}
            </span>
          </button>
        );
      })}
    </div>
  );
};

export default FilterSelection;
