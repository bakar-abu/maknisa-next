"use client";

import { useRef } from "react";
import { SwiperNav } from "@/components/home/shared/SwiperNav";
import { useMobileSwiper } from "@/components/home/shared/useMobileSwiper";
import { newsScrollingSection } from "@/lib/homeSections";
import { mediaUrl } from "@/lib/media";

export function NewsScrollingSection() {
  const containerRef = useRef<HTMLDivElement>(null);
  const prevRef = useRef<HTMLDivElement>(null);
  const nextRef = useRef<HTMLDivElement>(null);

  useMobileSwiper(containerRef, prevRef, nextRef);

  return (
    <section className="sn_news_scrolling py-80 py-lg-160 bg-light">
      <div className="sn_news_scrolling_content">
        <div className="col-sx">
          <div className="title pb-30 pb-sm-40">{newsScrollingSection.eyebrow}</div>
          <h1 className="h3 pb-40 pb-sm-80">{newsScrollingSection.title}</h1>
          <div
            className="txt"
            dangerouslySetInnerHTML={{ __html: newsScrollingSection.introHtml }}
          />
        </div>
        <div className="col-dx">
          <div ref={containerRef} className="swiper swiperNewsScrolling">
            <div className="swiper-wrapper">
              {newsScrollingSection.items.map((item) => (
                <div key={item.title} className="swiper-slide">
                  <div className="box-news">
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img src={mediaUrl(item.image)} alt="" />
                    <div className="content">
                      <div className="h5">{item.title}</div>
                      <p>{item.text}</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
            <SwiperNav prevRef={prevRef} nextRef={nextRef} />
          </div>
        </div>
      </div>
    </section>
  );
}
