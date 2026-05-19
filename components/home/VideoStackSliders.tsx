"use client";

import { homeVideoSections } from "@/lib/homeSliders";
import { VideoSliderSection } from "./VideoSliderSection";

export function VideoStackSliders() {
  return (
    <>
      <span className="label-scopri" hidden>
        Discover
      </span>
      {homeVideoSections.map((section, index) => (
        <VideoSliderSection key={section.title} section={section} index={index} />
      ))}
    </>
  );
}
