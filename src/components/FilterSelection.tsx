import React from "react";
import { ForwardRefExoticComponent, RefAttributes } from "react";
import { LucideProps } from "lucide-react"; 

interface Filter {
  name: string;
  value: string;
  icon: ForwardRefExoticComponent<Omit<LucideProps, "ref"> & RefAttributes<SVGSVGElement>>;
  color: string;
}

interface FilterSelectorProps {
  filters: Filter[];
  selectedFilter: Filter;
  setSelectedFilter: (filter: Filter) => void;
}

const FilterSelection = ({
  filters,
  selectedFilter,
  setSelectedFilter,
}: FilterSelectorProps) => {
  return <div className="flex flex-wrap gap-2">
    {filters.map((filter) => (
      <button
        key={filter.name}
        onClick={() => setSelectedFilter(filter)}
        className={`flex-col text-white cursor-pointer border-white/20 hover:scale-105 transition-transform flex justify-center items-center ${
          selectedFilter.name === filter.name ? "ring-2 ring-white" : ""
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
