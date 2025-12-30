"use client";

import FilterControls from "./FilterControls";
import FrameSelector from "./FrameSelector";
import TimerSelector from "./TimerSelector";
import PhotoCountSelector from "./PhotoCountSelector";

export default function ControlPanel() {
  return (
    <div className="glass-panel p-5 flex flex-col gap-y-4">
      <FilterControls />
      <div className="h-px bg-stone-300/50" />
      <FrameSelector />
      <div className="h-px bg-stone-300/50" />
      <div className="grid grid-cols-2 gap-4">
        <TimerSelector />
        <PhotoCountSelector />
      </div>
    </div>
  );
}
