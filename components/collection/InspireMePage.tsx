"use client";

import { useMemo, useState } from "react";
import { MagazineBreadcrumbs } from "@/components/magazine/MagazineBreadcrumbs";
import { Icon } from "@/components/icons/Icon";
import { CollectionProductCard } from "@/components/collection/CollectionProductCard";
import type { CollectionProduct } from "@/lib/collection-types";
import {
  inspireMeDefaults,
  type InspireMePageContent,
} from "@/lib/inspire-me";

type InspireMePageProps = {
  content?: InspireMePageContent;
};

export function InspireMePage({ content }: InspireMePageProps = {}) {
  const pageContent = content ?? inspireMeDefaults;
  const inspireImages = pageContent.images;
  const resultProducts = pageContent.resultProducts;

  const [likes, setLikes] = useState<Set<string>>(new Set());
  const [dislikes, setDislikes] = useState<Set<string>>(new Set());
  const [index, setIndex] = useState(0);
  const [done, setDone] = useState(false);
  const [activeTagIds, setActiveTagIds] = useState<number[]>([]);

  const remaining = inspireImages.filter(
    (img) => !likes.has(img.id) && !dislikes.has(img.id),
  );
  const current = remaining[index] ?? null;

  const tagsById = useMemo(() => {
    const map = new Map<number, { id: number; label: string }>();
    for (const img of inspireImages) {
      for (const id of img.tagIds) {
        map.set(id, { id, label: img.alt });
      }
    }
    return map;
  }, [inspireImages]);

  const pick = (type: "like" | "dislike") => {
    if (!current) return;
    if (type === "like") {
      setLikes((prev) => new Set(prev).add(current.id));
      setActiveTagIds((prev) => [...new Set([...prev, ...current.tagIds])]);
    } else {
      setDislikes((prev) => new Set(prev).add(current.id));
    }
    if (remaining.length <= 1) setDone(true);
    else setIndex(0);
  };

  const filteredResults = resultProducts.filter((product: CollectionProduct) =>
    activeTagIds.length === 0
      ? true
      : activeTagIds.every((id) => product.tagIds.includes(id)),
  );

  return (
    <main id="main-content" role="main">
      <section className="sn_intro_text mt-70 mb-50">
        <div className="container text-center">
          <div className="row justify-content-center">
            <div className="col-12 col-lg-10 col-xl-8 mx-md-0 mb-40">
              <MagazineBreadcrumbs
                items={[{ label: "Home", href: "/" }, { label: pageContent.title }]}
              />
            </div>
            <div className="col-12 col-lg-10 col-xl-8 mx-md-0">
              <h1 className="h2 m-0">{pageContent.title}</h1>
            </div>
          </div>
        </div>
      </section>

      {!done ? (
        <section className="sn_inspire_selection mt-50 pb-180">
          <div className="container">
            <div className="row mb-100">
              <div className="sn_inspire_selection_intro col-12 col-md-10 col-lg-8 col-xl-6 mx-auto text-center">
                <div className="sn_paragraph_xxl">
                  {pageContent.wizardIntro[0] ? (
                    <>
                      {pageContent.wizardIntro[0]}
                      <br />
                    </>
                  ) : null}
                  {pageContent.wizardIntro[1] ? (
                    <>
                      {(() => {
                        const parts = pageContent.wizardIntro[1].split(/ or skip /i);
                        if (parts.length === 2) {
                          return (
                            <>
                              {parts[0]}{" "}
                              <Icon id="arrow-right" className="_face_like" /> or skip{" "}
                              {parts[1]}{" "}
                              <Icon id="arrow-right" className="_face_dislike" />.
                            </>
                          );
                        }
                        return pageContent.wizardIntro[1];
                      })()}
                    </>
                  ) : null}
                </div>
              </div>
            </div>
          </div>
          {current ? (
            <div className="container-md">
              <div className="row align-items-center">
                <div className="col-12 col-md-auto col-lg-2 offset-xl-1 text-center">
                  <button
                    type="button"
                    className="sn_inspire_selection_smile _like"
                    onClick={() => pick("like")}
                    aria-label="Like"
                  >
                    <Icon id="arrow-right" className="_face_like" />
                  </button>
                </div>
                <div className="col-12 col-md col-lg-8 col-xl-6 text-center py-40">
                  <picture>
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img
                      src={current.src}
                      alt={current.alt}
                      className="img-fluid"
                    />
                  </picture>
                </div>
                <div className="col-12 col-md-auto col-lg-2 text-center">
                  <button
                    type="button"
                    className="sn_inspire_selection_smile _dislike"
                    onClick={() => pick("dislike")}
                    aria-label="Dislike"
                  >
                    <Icon id="arrow-right" className="_face_dislike" />
                  </button>
                </div>
              </div>
            </div>
          ) : (
            <div className="text-center">
              <button
                type="button"
                className="sn_btn_grow"
                onClick={() => setDone(true)}
              >
                <span className="tx">{pageContent.seeResultsLabel}</span>
                <span
                  className="sq"
                  aria-hidden="true"
                  data-title={pageContent.seeResultsLabel}
                />
              </button>
            </div>
          )}
        </section>
      ) : (
        <section className="sn_kitchens_grid mt-40 mb-90">
          <div className="container-fluid">
            <div className="text-center mb-60">
              <div className="h5 mb-20">{pageContent.congratsTitle}</div>
              <p className="sn_paragraph_lg">{pageContent.congratsBody}</p>
            </div>
            <div className="sn_kitchens_grid_row row" role="list">
              {filteredResults.map((product) => (
                <CollectionProductCard
                  key={product.id}
                  product={product}
                  tagsById={tagsById}
                />
              ))}
            </div>
            <div className="sn_kitchens_grid_info mt-60">
              <div className="container text-center">
                <div className="h5 mb-30">{pageContent.unsatisfiedTitle}</div>
                <button
                  type="button"
                  className="sn_btn_grow"
                  onClick={() => {
                    setDone(false);
                    setLikes(new Set());
                    setDislikes(new Set());
                    setActiveTagIds([]);
                    setIndex(0);
                  }}
                >
                  <span className="tx">{pageContent.tryAgainLabel}</span>
                  <span
                    className="sq"
                    aria-hidden="true"
                    data-title={pageContent.tryAgainLabel}
                  />
                </button>
              </div>
            </div>
          </div>
        </section>
      )}
    </main>
  );
}
