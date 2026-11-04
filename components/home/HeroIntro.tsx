import Link from "next/link";
import type { HeroIntroContent } from "@/lib/cms/home-page";

type HeroIntroProps = {
  content?: HeroIntroContent;
};

const DEFAULT_HERO: HeroIntroContent = {
  heroImage: "/images/hero-section.png",
  heroImageAlt: "Maknisa luxury kitchen collection",
  ctaHref: "/services/Kitchens",
  ctaLabel: "Discover the story",
};

export function HeroIntro({ content = DEFAULT_HERO }: HeroIntroProps) {
  return (
    <>
      <span className="label-scopri" hidden>
        Discover
      </span>
      <section className="sn_intro_video" aria-label="Hero section">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          className="desktop mk-hero-section__img"
          src={content.heroImage}
          alt={content.heroImageAlt}
          loading="eager"
          fetchPriority="high"
        />
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          className="mobile mk-hero-section__img"
          src={content.heroImage}
          alt={content.heroImageAlt}
          loading="eager"
          fetchPriority="high"
        />
        <Link
          href={content.ctaHref}
          className="sn_btn_grow _text_light"
          title={content.ctaLabel}
        >
          <span className="tx">{content.ctaLabel}</span>
          <span
            className="sq"
            aria-hidden="true"
            data-title={content.ctaLabel}
          />
        </Link>
      </section>
    </>
  );
}
