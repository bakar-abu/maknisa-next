"use client";

import dynamic from "next/dynamic";
import type {
  ActionsSiteContent,
  BespokeTextContent,
  DesignColumnsContent,
  EnvironmentVideoContent,
  LaunchBoxesContent,
  MagazineContent,
  NewsScrollingContent,
  VideoSlidersContent,
} from "@/lib/cms/home-page";
import { homeVideoSections } from "@/lib/homeSliders";
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

export function HomeClientSections({
  bespokeContent,
  videoSlidersContent,
  launchBoxesContent,
  designColumnsContent,
  newsScrollingContent,
  environmentVideoContent,
  actionsSiteContent,
  magazineContent,
}: {
  bespokeContent?: BespokeTextContent;
  videoSlidersContent?: VideoSlidersContent;
  launchBoxesContent?: LaunchBoxesContent;
  designColumnsContent?: DesignColumnsContent;
  newsScrollingContent?: NewsScrollingContent;
  environmentVideoContent?: EnvironmentVideoContent;
  actionsSiteContent?: ActionsSiteContent;
  magazineContent?: MagazineContent;
}) {
  const videoSections = videoSlidersContent?.sections ?? homeVideoSections;

  return (
    <>
      <VideoStackSliders sections={videoSections} />
      <BespokeTextSection content={bespokeContent} />
      <LaunchBoxesSection boxes={launchBoxesContent?.boxes} />
      <DesignColumnsSection content={designColumnsContent} />
      <NewsScrollingSection content={newsScrollingContent} />
      <EnvironmentVideoSection content={environmentVideoContent} />
      <ActionsSiteSection content={actionsSiteContent} />
      <MagazineSection content={magazineContent} />
    </>
  );
}
