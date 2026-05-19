"use client";

import Link from "next/link";
import { useRef } from "react";
import { SwiperNav } from "@/components/home/shared/SwiperNav";
import { useMobileSwiper } from "@/components/home/shared/useMobileSwiper";
import { actionsSiteItems } from "@/lib/homeSections";
import { mediaUrl } from "@/lib/media";

export function ActionsSiteSection() {
  const containerRef = useRef<HTMLDivElement>(null);
  const prevRef = useRef<HTMLDivElement>(null);
  const nextRef = useRef<HTMLDivElement>(null);

  useMobileSwiper(containerRef, prevRef, nextRef);

  return (
    <section className="sn_actions_site py-80 py-lg-160">
      <div className="container-fluid">
        <div ref={containerRef} className="swiper swiperActionsSite">
          <div className="swiper-wrapper">
            {actionsSiteItems.map((item) => (
              <div key={item.title} className="swiper-slide">
                <div className="action-site text-center">
                  <div>
                    <div className="img pb-20 pb-sm-40">
                      {/* eslint-disable-next-line @next/next/no-img-element */}
                      <img src={mediaUrl(item.icon)} alt="" />
                    </div>
                    <h4 className="title h4">{item.title}</h4>
                    <div className="txt">{item.text}</div>
                  </div>
                  <Link href={item.href}>{item.linkLabel}</Link>
                </div>
              </div>
            ))}
          </div>
          <SwiperNav light prevRef={prevRef} nextRef={nextRef} />
        </div>
      </div>
    </section>
  );
}
