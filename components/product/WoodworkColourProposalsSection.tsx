"use client";

import Link from "next/link";
import { useCallback, useId, useState } from "react";
import { WoodworkSliderArrow } from "@/components/product/WoodworkSliderArrow";
import type { WoodworkColourProposal } from "@/lib/woodwork-pdp-content";

type WoodworkColourProposalsSectionProps = {
  productTitle: string;
  proposals: WoodworkColourProposal[];
};

export function WoodworkColourProposalsSection({
  productTitle,
  proposals,
}: WoodworkColourProposalsSectionProps) {
  const uid = useId();
  const [activeIndex, setActiveIndex] = useState(0);

  const goTo = useCallback(
    (index: number) => {
      const normalized =
        ((index % proposals.length) + proposals.length) % proposals.length;
      setActiveIndex(normalized);
    },
    [proposals.length],
  );

  if (proposals.length === 0) return null;

  const active = proposals[activeIndex] ?? proposals[0];

  return (
    <section className="ww-colour-proposals" aria-labelledby={`${uid}-colour-title`}>
      <div className="ww-colour-proposals__grid">
        <div className="ww-colour-proposals__panel">
          <div className="ww-colour-proposals__panel-in">
            <h2 className="ww-colour-proposals__title" id={`${uid}-colour-title`}>
              Add colour to everyday life with {productTitle}
            </h2>

            <div className="ww-colour-proposals__thumbs">
              <div className="ww-colour-proposals__thumbs-in">
                <figure>
                  <div className="ww-colour-proposals__picker">
                    <button
                      type="button"
                      className="ww-colour-proposals__nav _prev"
                      aria-label="Previous colour"
                      onClick={() => goTo(activeIndex - 1)}
                    >
                      <WoodworkSliderArrow direction="prev" />
                    </button>

                    <div className="ww-colour-proposals__swatches">
                      <div
                        className="ww-colour-proposals__swatch"
                        style={{ backgroundColor: active.color }}
                        aria-hidden="true"
                      />
                    </div>

                    <button
                      type="button"
                      className="ww-colour-proposals__nav _next"
                      aria-label="Next colour"
                      onClick={() => goTo(activeIndex + 1)}
                    >
                      <WoodworkSliderArrow direction="next" />
                    </button>
                  </div>

                  <figcaption className="ww-colour-proposals__name">
                    {active.name}
                  </figcaption>
                </figure>
              </div>
            </div>

            <Link href="/ww/request-catalogue" className="ww-colour-proposals__colours-link">
              See all the different colours
            </Link>

            <Link
              href="/ww/request-catalogue"
              className="sn_btn_grow _small ww-colour-proposals__download"
              title="Download the complete colour chart"
            >
              <span className="tx">Download the complete colour chart</span>
              <span
                className="sq"
                aria-hidden="true"
                data-title="Download the complete colour chart"
              />
            </Link>
          </div>
        </div>

        <div className="ww-colour-proposals__visual" aria-live="polite">
          {proposals.map((proposal, index) => (
            <div
              key={`${uid}-scene-${index}`}
              className={
                activeIndex === index
                  ? "ww-colour-proposals__scene is-active"
                  : "ww-colour-proposals__scene"
              }
              aria-hidden={activeIndex !== index}
            >
              {proposal.image ? (
                // eslint-disable-next-line @next/next/no-img-element
                <img
                  src={proposal.image}
                  alt={`${productTitle} in ${proposal.name}`}
                  loading={index === 0 ? "eager" : "lazy"}
                />
              ) : (
                <div className="ww-colour-proposals__slide-placeholder" />
              )}
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
