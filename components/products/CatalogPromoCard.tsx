import Link from "next/link";
import type { CatalogPromoCard as CatalogPromoCardData } from "@/lib/catalog-promo-cards";
import type { PromoAlign } from "@/lib/catalog-grid-layout";
import { upscaleCatalogImage } from "@/lib/catalog-images";

type CatalogPromoCardProps = {
  promo: CatalogPromoCardData;
  align?: PromoAlign;
};

export function CatalogPromoCard({ promo, align = "left" }: CatalogPromoCardProps) {
  const imageSrc = promo.image
    ? upscaleCatalogImage(promo.image, 1600)
    : null;

  return (
    <article
      className={`mk-bc-promo mk-bc-promo--${align}`}
      aria-label={promo.heading}
    >
      <Link href={promo.href} className="mk-bc-promo__link">
        <span className="mk-bc-promo__media">
          {imageSrc ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img
              src={imageSrc}
              alt={promo.imageAlt}
              className="mk-bc-promo__image"
              loading="lazy"
              decoding="async"
            />
          ) : (
            <span className="mk-bc-promo__placeholder" aria-hidden="true" />
          )}
        </span>
        <span className="mk-bc-promo__texts">
          <span className="mk-bc-promo__pre">{promo.preHeading}</span>
          <span className="mk-bc-promo__heading">{promo.heading}</span>
          <span className="mk-bc-promo__cta">{promo.linkText}</span>
        </span>
      </Link>
    </article>
  );
}
