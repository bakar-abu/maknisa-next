"use client";

import { useRef } from "react";
import { SwiperNav } from "@/components/home/shared/SwiperNav";
import { useMobileSwiper } from "@/components/home/shared/useMobileSwiper";
import { designColumns } from "@/lib/homeSections";
import { mediaUrl } from "@/lib/media";

export function DesignColumnsSection() {
  const containerRef = useRef<HTMLDivElement>(null);
  const prevRef = useRef<HTMLDivElement>(null);
  const nextRef = useRef<HTMLDivElement>(null);

  useMobileSwiper(containerRef, prevRef, nextRef);

  return (
    <section className="sn_box-3-column py-40 py-md-80">
      <div className="container-fluid">
        <div ref={containerRef} className="swiper swiperProgettazione">
          <div className="swiper-wrapper">
            {designColumns.map((column) => (
              <div key={column.title} className="swiper-slide">
                <div className="box-progettazione">
                  <h5 className="title h5">{column.title}</h5>
                  <div className="content">
                    <picture>
                      <img src={mediaUrl(column.image)} alt="" />
                    </picture>
                    <div
                      className="txt"
                      dangerouslySetInnerHTML={{ __html: column.textHtml }}
                    />
                  </div>
                </div>
              </div>
            ))}
          </div>
          <SwiperNav prevRef={prevRef} nextRef={nextRef} />
        </div>
      </div>
    </section>
  );
}
