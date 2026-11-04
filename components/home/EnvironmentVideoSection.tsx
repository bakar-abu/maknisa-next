"use client";

import { GrowButton } from "@/components/home/shared/GrowButton";
import type { EnvironmentVideoContent } from "@/lib/cms/home-page";
import { environmentVideoSection } from "@/lib/homeSections";
import { mediaUrl } from "@/lib/media";
import { resolveVideoUrl } from "@/lib/video-url";

type EnvironmentVideoSectionProps = {
  content?: EnvironmentVideoContent;
};

export function EnvironmentVideoSection({ content }: EnvironmentVideoSectionProps) {
  const section = content ?? environmentVideoSection;
  const desktopVideo = section.desktopVideo.startsWith("http")
    ? section.desktopVideo
    : mediaUrl(section.desktopVideo);
  const mobileVideo = section.mobileVideo.startsWith("http")
    ? section.mobileVideo
    : mediaUrl(section.mobileVideo);

  return (
    <section className="sn_video">
      <video
        className="desktop"
        src={resolveVideoUrl(desktopVideo)}
        autoPlay
        loop
        muted
        playsInline
        preload="metadata"
      />
      <video
        className="mobile"
        src={resolveVideoUrl(mobileVideo)}
        autoPlay
        loop
        muted
        playsInline
        preload="metadata"
      />
      <div className="claim">
        <h2 className="title h2">{section.title}</h2>
        <div className="txt">{section.subtitle}</div>
        <GrowButton
          href={section.cta.href}
          label={section.cta.label}
          className="sn_btn_grow _text_light"
        />
      </div>
      {section.keyPhrases.map((phrase) => (
        <div key={phrase.className} className={`key-phrase ${phrase.className}`}>
          {phrase.text}
        </div>
      ))}
    </section>
  );
}
