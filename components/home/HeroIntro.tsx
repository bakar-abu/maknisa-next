import Link from "next/link";

/** Homepage hero — local asset in public/images */
const HERO_IMAGE = "/images/hero-section.png";

export function HeroIntro() {
  return (
    <>
      <span className="label-scopri" hidden>
        Discover
      </span>
      <section className="sn_intro_video" aria-label="Hero section">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          className="desktop mk-hero-section__img"
          src={HERO_IMAGE}
          alt="Maknisa luxury kitchen collection"
          loading="eager"
          fetchPriority="high"
        />
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          className="mobile mk-hero-section__img"
          src={HERO_IMAGE}
          alt="Maknisa luxury kitchen collection"
          loading="eager"
          fetchPriority="high"
        />
        <Link
          href="/ww/kitchens"
          className="sn_btn_grow _text_light"
          title="Discover the story"
        >
          <span className="tx">Discover the story</span>
          <span
            className="sq"
            aria-hidden="true"
            data-title="Discover the story"
          />
        </Link>
      </section>
    </>
  );
}
