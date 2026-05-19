"use client";

import dynamic from "next/dynamic";
import { BespokeTextSection } from "@/components/home/BespokeTextSection";
import { EnvironmentVideoSection } from "@/components/home/EnvironmentVideoSection";
import { LaunchBoxesSection } from "@/components/home/LaunchBoxesSection";
import { MagazineSection } from "@/components/home/MagazineSection";

const VideoStackSliders = dynamic(
  () =>
    import("@/components/home/VideoStackSliders").then((m) => m.VideoStackSliders),
  { ssr: false },
);

const DesignColumnsSection = dynamic(
  () =>
    import("@/components/home/DesignColumnsSection").then(
      (m) => m.DesignColumnsSection,
    ),
  { ssr: false },
);

const NewsScrollingSection = dynamic(
  () =>
    import("@/components/home/NewsScrollingSection").then(
      (m) => m.NewsScrollingSection,
    ),
  { ssr: false },
);

const ActionsSiteSection = dynamic(
  () =>
    import("@/components/home/ActionsSiteSection").then((m) => m.ActionsSiteSection),
  { ssr: false },
);

export function HomeClientSections() {
  return (
    <>
      <VideoStackSliders />
      <BespokeTextSection />
      <LaunchBoxesSection />
      <DesignColumnsSection />
      <NewsScrollingSection />
      <EnvironmentVideoSection />
      <ActionsSiteSection />
      <MagazineSection />
    </>
  );
}
