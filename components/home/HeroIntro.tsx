import Link from "next/link";
import { mediaUrl } from "@/lib/media";

const HERO_DESKTOP = "/media/immagini/hero-desktop.jpg";
const HERO_MOBILE = "/media/immagini/hero-mobile.jpg";

export function HeroIntro() {
  return (
    <>
      <span className="label-scopri" hidden>
        Discover
      </span>
      <section className="sn_intro_video">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img className="desktop" src={mediaUrl(HERO_DESKTOP)} alt="" />
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img className="mobile" src={mediaUrl(HERO_MOBILE)} alt="" />
        <Link
          href="/collections"
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
