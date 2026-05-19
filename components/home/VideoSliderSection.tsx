"use client";

import Link from "next/link";
import { useCallback, useEffect, useRef, useState } from "react";
import type { Swiper as SwiperType } from "swiper";
import { Autoplay, EffectFade, Pagination, Thumbs } from "swiper/modules";
import { Swiper, SwiperSlide } from "swiper/react";
import type { HomeVideoSection } from "@/lib/homeSliders";
import { mediaUrl } from "@/lib/media";

import "swiper/css";
import "swiper/css/effect-fade";
import "swiper/css/pagination";

const AUTOPLAY_DELAY = 6500;

type VideoSliderSectionProps = {
  section: HomeVideoSection;
  index: number;
};

function loadVideosInSlide(slideEl: HTMLElement | null) {
  if (!slideEl) return;
  slideEl.querySelectorAll<HTMLVideoElement>("video").forEach((video) => {
    const url = video.getAttribute("data-url");
    if (!url || video.getAttribute("data-loaded") === "true") return;
    video.setAttribute("src", url);
    video.setAttribute("data-loaded", "true");
    video.load();
  });
}

function playActiveSlideVideos(slideEl: HTMLElement | null) {
  if (!slideEl) return;
  slideEl.querySelectorAll<HTMLVideoElement>("video").forEach((video) => {
    void video.play().catch(() => undefined);
  });
}

function pauseSlideVideos(slideEl: HTMLElement | null) {
  if (!slideEl) return;
  slideEl.querySelectorAll<HTMLVideoElement>("video").forEach((video) => {
    video.pause();
    video.currentTime = 0;
  });
}

function pauseAllSectionVideos(sectionEl: HTMLElement | null) {
  sectionEl?.querySelectorAll<HTMLVideoElement>("video").forEach((video) => {
    video.pause();
  });
}

/** Re-triggers the CSS progress bar on the active thumb slide. */
function restartThumbProgress(thumbsSwiper: SwiperType) {
  const slide = thumbsSwiper.slides[thumbsSwiper.activeIndex] as HTMLElement | undefined;
  if (!slide) return;
  slide.classList.remove("swiper-slide-thumb-active");
  void slide.offsetWidth;
  slide.classList.add("swiper-slide-thumb-active");
}

export function VideoSliderSection({ section, index }: VideoSliderSectionProps) {
  const sectionRef = useRef<HTMLElement>(null);
  const paginationRef = useRef<HTMLDivElement>(null);
  const pauseIconRef = useRef<HTMLSpanElement>(null);
  const playIconRef = useRef<HTMLSpanElement>(null);
  const toggleRef = useRef<HTMLButtonElement>(null);

  const [thumbsSwiper, setThumbsSwiper] = useState<SwiperType | null>(null);
  const [videoSwiper, setVideoSwiper] = useState<SwiperType | null>(null);
  const [autoplayPaused, setAutoplayPaused] = useState(false);
  const [secondaryCta, setSecondaryCta] = useState<{
    href: string;
    label: string;
  } | null>(null);

  const primaryCta = section.ctas[0];
  const exploreCta = section.ctas.find((c) => c.className.includes("link-cucina"));

  const updateSecondaryCta = useCallback(
    (slideIndex: number) => {
      const thumb = section.thumbSlides[slideIndex];
      if (thumb && exploreCta) {
        setSecondaryCta({ href: thumb.link, label: `Explore ${thumb.title}` });
      }
    },
    [exploreCta, section.thumbSlides],
  );

  useEffect(() => {
    const el = sectionRef.current;
    if (!el) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        el.classList.toggle("active", entry.isIntersecting);
      },
      { threshold: 0.35, rootMargin: "-10% 0px -10% 0px" },
    );

    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  useEffect(() => {
    if (index !== 0) return;
    document.querySelector(".sn_slider_video")?.classList.add("first-video");
  }, [index]);

  useEffect(() => {
    if (!videoSwiper || !thumbsSwiper || videoSwiper.destroyed || thumbsSwiper.destroyed) {
      return;
    }
    videoSwiper.thumbs.init();
    videoSwiper.thumbs.update(true);
  }, [videoSwiper, thumbsSwiper]);

  const handleVideoSlideChange = useCallback(
    (swiper: SwiperType) => {
      swiper.slides.forEach((slide, i) => {
        if (i === swiper.activeIndex) {
          loadVideosInSlide(slide as HTMLElement);
          if (!autoplayPaused) {
            playActiveSlideVideos(slide as HTMLElement);
          }
        } else {
          pauseSlideVideos(slide as HTMLElement);
        }
      });
      updateSecondaryCta(swiper.activeIndex);

      if (!autoplayPaused && thumbsSwiper) {
        restartThumbProgress(thumbsSwiper);
      }
    },
    [autoplayPaused, thumbsSwiper, updateSecondaryCta],
  );

  const toggleAutoplay = () => {
    if (!videoSwiper) return;

    const pauseIcon = pauseIconRef.current;
    const playIcon = playIconRef.current;
    const toggleBtn = toggleRef.current;

    if (!autoplayPaused) {
      videoSwiper.autoplay?.stop();
      thumbsSwiper?.autoplay?.stop();
      pauseAllSectionVideos(sectionRef.current);
      sectionRef.current?.classList.add("is-autoplay-paused");
      if (pauseIcon) pauseIcon.style.display = "none";
      if (playIcon) playIcon.style.display = "block";
      toggleBtn?.setAttribute("aria-label", "Play automatic slide show");
      setAutoplayPaused(true);
    } else {
      videoSwiper.autoplay?.start();
      thumbsSwiper?.autoplay?.start();
      sectionRef.current?.classList.remove("is-autoplay-paused");
      if (pauseIcon) pauseIcon.style.display = "block";
      if (playIcon) playIcon.style.display = "none";
      toggleBtn?.setAttribute("aria-label", "Pause automatic slide show");
      setAutoplayPaused(false);

      const activeSlide = videoSwiper.slides[videoSwiper.activeIndex] as HTMLElement;
      loadVideosInSlide(activeSlide);
      playActiveSlideVideos(activeSlide);
      if (thumbsSwiper) restartThumbProgress(thumbsSwiper);
    }
  };

  return (
    <section
      ref={sectionRef}
      className={`sn_slider_video${index === 0 ? " first-video" : ""}`}
    >
      <div className="sn_slider_info">
        <h2 className="sn_slider_info_title h2 mb-23">{section.title}</h2>
        <div className="sn_slider_info_txt">{section.description}</div>
        <div className="sn_slider_info_actions mt-30 mt-sm-60">
          {primaryCta ? (
            <Link
              href={primaryCta.href}
              className={primaryCta.className}
              title={primaryCta.label}
            >
              <span className="tx">{primaryCta.label}</span>
              <span
                className="sq"
                aria-hidden="true"
                data-title={primaryCta.label}
              />
            </Link>
          ) : null}
          {exploreCta && secondaryCta ? (
            <Link
              href={secondaryCta.href}
              className={exploreCta.className}
              title={secondaryCta.label}
            >
              <span className="tx">{secondaryCta.label}</span>
              <span
                className="sq"
                aria-hidden="true"
                data-title={secondaryCta.label}
              />
            </Link>
          ) : null}
        </div>
      </div>

      <Swiper
        className="swiper swiperVideo"
        modules={[EffectFade, Autoplay, Pagination, Thumbs]}
        effect="fade"
        speed={600}
        allowTouchMove={false}
        autoplay={{ delay: AUTOPLAY_DELAY, disableOnInteraction: false }}
        thumbs={{
          swiper: thumbsSwiper && !thumbsSwiper.destroyed ? thumbsSwiper : null,
        }}
        onBeforeInit={(swiper) => {
          if (paginationRef.current) {
            swiper.params.pagination = {
              ...(typeof swiper.params.pagination === "object"
                ? swiper.params.pagination
                : {}),
              el: paginationRef.current,
            };
          }
        }}
        pagination={{
          type: "fraction",
          renderFraction: (currentClass, totalClass) =>
            `<span class="${currentClass}"></span> <span class="dividerClass"></span> <span class="${totalClass}"></span>`,
          formatFractionCurrent: (n) => (n < 10 ? `0${n}` : String(n)),
          formatFractionTotal: (n) => (n < 10 ? `0${n}` : String(n)),
        }}
        onSwiper={(swiper) => {
          setVideoSwiper(swiper);
          updateSecondaryCta(swiper.activeIndex);
        }}
        onInit={handleVideoSlideChange}
        onSlideChangeTransitionEnd={handleVideoSlideChange}
      >
        {section.slides.map((slide, slideIndex) => (
          <SwiperSlide key={slideIndex}>
            <video
              className="desktop"
              data-url={slide.desktop}
              muted
              loop
              playsInline
              preload="none"
            />
            <video
              className="mobile"
              data-url={slide.mobile}
              muted
              loop
              playsInline
              preload="none"
            />
          </SwiperSlide>
        ))}
        <div ref={paginationRef} className="swiper-pagination" />
        <button
          ref={toggleRef}
          type="button"
          className="swiper-autoplay-toggle"
          aria-label="Pause automatic slide show"
          onClick={toggleAutoplay}
        >
          <span ref={pauseIconRef} className="pause-icon" aria-hidden="true">
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
              <rect x="6" y="4" width="4" height="16" fill="currentColor" />
              <rect x="14" y="4" width="4" height="16" fill="currentColor" />
            </svg>
          </span>
          <span
            ref={playIconRef}
            className="play-icon"
            aria-hidden="true"
            style={{ display: "none" }}
          >
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
              <path d="M8 5v14l11-7z" fill="currentColor" />
            </svg>
          </span>
        </button>
      </Swiper>

      <Swiper
        className="swiper swiperThumb"
        modules={[Autoplay]}
        slidesPerView="auto"
        centeredSlides
        spaceBetween={16}
        watchSlidesProgress
        autoplay={{ delay: AUTOPLAY_DELAY, disableOnInteraction: false }}
        breakpoints={{
          1200: {
            slidesPerView: 5,
            spaceBetween: 0,
            autoplay: false,
            centeredSlides: true,
          },
        }}
        onSwiper={setThumbsSwiper}
        onSlideChange={(swiper) => {
          updateSecondaryCta(swiper.activeIndex);
        }}
      >
        {section.thumbSlides.map((thumb, thumbIndex) => (
          <SwiperSlide
            key={thumbIndex}
            data-link={thumb.link}
            onClick={() => videoSwiper?.slideTo(thumbIndex)}
          >
            <div className="title">{thumb.title}</div>
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src={mediaUrl(thumb.image)} alt={thumb.title} />
          </SwiperSlide>
        ))}
      </Swiper>
    </section>
  );
}
