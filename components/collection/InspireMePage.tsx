"use client";

import Link from "next/link";
import { useMemo, useState } from "react";
import { MagazineBreadcrumbs } from "@/components/magazine/MagazineBreadcrumbs";
import { Icon } from "@/components/icons/Icon";
import { CollectionProductCard } from "@/components/collection/CollectionProductCard";
import type { CollectionProduct } from "@/lib/collection-types";

type InspireImage = {
  id: string;
  src: string;
  alt: string;
  tagIds: number[];
};

const INSPIRE_IMAGES: InspireImage[] = [
  {
    id: "1305",
    src: "https://scavolini-cdn.thron.com/delivery/public/image/scavolini/69be7047-f400-4b92-a0c6-a90028140ba2/nuctwf/std/1280x0/REGOLA_pag_12.jpg",
    alt: "casual",
    tagIds: [561],
  },
  {
    id: "9593",
    src: "https://scavolini-cdn.thron.com/delivery/public/image/scavolini/fe133f5f-0596-4b83-b732-2c565c4c73c6/nuctwf/std/1280x0/Diesel%20Open%20Workshop%20UPDATE_pag_88089.jpg",
    alt: "loft",
    tagIds: [559],
  },
  {
    id: "10593",
    src: "https://scavolini-cdn.thron.com/delivery/public/image/scavolini/fba73b1e-77a3-4761-aa6d-3d31b6868dba/nuctwf/std/1280x0/classico-familya919.jpg",
    alt: "classic",
    tagIds: [291],
  },
  {
    id: "10010",
    src: "https://scavolini-cdn.thron.com/delivery/public/image/scavolini/15f694a5-a7c5-45e9-a1c2-14d2f57b8d77/nuctwf/std/1280x0/Libra_pag_34300a.jpg",
    alt: "design",
    tagIds: [510],
  },
  {
    id: "10513",
    src: "https://scavolini-cdn.thron.com/delivery/public/image/scavolini/fea19c39-3a44-4e7b-8b3c-4482db1b8b69/nuctwf/std/1280x0/MIRA_pag_10-1159a1.jpg",
    alt: "open space",
    tagIds: [555],
  },
];

const RESULT_PRODUCTS: CollectionProduct[] = [
  {
    id: "mira",
    title: "Mira",
    href: "/ww/kitchens",
    onlineShop: false,
    images: [INSPIRE_IMAGES[4].src],
    tagIds: [555, 510],
    categoryIds: [17],
  },
  {
    id: "libra",
    title: "Libra",
    href: "/ww/kitchens",
    onlineShop: false,
    images: [INSPIRE_IMAGES[3].src],
    tagIds: [510, 539],
    categoryIds: [17],
  },
];

export function InspireMePage() {
  const [likes, setLikes] = useState<Set<string>>(new Set());
  const [dislikes, setDislikes] = useState<Set<string>>(new Set());
  const [index, setIndex] = useState(0);
  const [done, setDone] = useState(false);
  const [activeTagIds, setActiveTagIds] = useState<number[]>([]);

  const remaining = INSPIRE_IMAGES.filter(
    (img) => !likes.has(img.id) && !dislikes.has(img.id),
  );
  const current = remaining[index] ?? null;

  const tagsById = useMemo(() => {
    const map = new Map<number, { id: number; label: string }>();
    for (const img of INSPIRE_IMAGES) {
      for (const id of img.tagIds) {
        map.set(id, { id, label: img.alt });
      }
    }
    return map;
  }, []);

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

  const filteredResults = RESULT_PRODUCTS.filter((p) =>
    activeTagIds.length === 0
      ? true
      : activeTagIds.every((id) => p.tagIds.includes(id)),
  );

  return (
    <main id="main-content" role="main">
      <section className="sn_intro_text mt-70 mb-50">
        <div className="container text-center">
          <div className="row justify-content-center">
            <div className="col-12 col-lg-10 col-xl-8 mx-md-0 mb-40">
              <MagazineBreadcrumbs
                items={[{ label: "Home", href: "/" }, { label: "Inspire me" }]}
              />
            </div>
            <div className="col-12 col-lg-10 col-xl-8 mx-md-0">
              <h1 className="h2 m-0">Inspire me</h1>
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
                  Browse the images and find your style.
                  <br />
                  Select the images you like the most{" "}
                  <Icon id="arrow-right" className="_face_like" /> or skip those
                  that do not match{" "}
                  <Icon id="arrow-right" className="_face_dislike" />.
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
                <span className="tx">See results</span>
                <span className="sq" aria-hidden="true" data-title="See results" />
              </button>
            </div>
          )}
        </section>
      ) : (
        <section className="sn_kitchens_grid mt-40 mb-90">
          <div className="container-fluid">
            <div className="text-center mb-60">
              <div className="h5 mb-20">Congratulations!</div>
              <p className="sn_paragraph_lg">
                You have completed the wizard. Below are results according to
                your choices.
              </p>
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
                <div className="h5 mb-30">Not satisfied with the results?</div>
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
                  <span className="tx">Try again</span>
                  <span className="sq" aria-hidden="true" data-title="Try again" />
                </button>
              </div>
            </div>
          </div>
        </section>
      )}
    </main>
  );
}
