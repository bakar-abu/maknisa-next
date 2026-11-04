"use client";

import type { HomeVideoSection } from "@/lib/homeSliders";
import { VideoSliderSection } from "./VideoSliderSection";

type VideoStackSlidersProps = {
  sections: HomeVideoSection[];
};

export function VideoStackSliders({ sections }: VideoStackSlidersProps) {
  return (
    <>
      <span className="label-scopri" hidden>
        Discover
      </span>
      {sections.map((section, index) => (
        <VideoSliderSection key={`${section.title}-${index}`} section={section} index={index} />
      ))}
    </>
  );
}
