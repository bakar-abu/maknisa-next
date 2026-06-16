import Link from "next/link";

import { ProductCardCarousel } from "@/components/products/ProductCardCarousel";

import {

  getProductCardBadges,

  getProductCardMaterials,

  getProductCardPricing,

} from "@/lib/catalog-card-display";

import type { CatalogProduct } from "@/lib/catalog-types";

import { formatPkr } from "@/lib/format-price";

import { PRODUCT_TYPE_BY_ID } from "@/lib/product-types";

import { getCollectionPageTitle } from "@/lib/collections";



type ProductCatalogCardProps = {

  product: CatalogProduct;

  styleLabels: string[];

  variant?: "default" | "service";

  placement?: "default" | "promo-side-left" | "promo-side-right";

};



function ServiceProductCard({

  product,

  placement = "default",

}: {

  product: CatalogProduct;

  placement?: "default" | "promo-side-left" | "promo-side-right";

}) {

  const badges = getProductCardBadges(product);

  const materials = getProductCardMaterials(product);

  const pricing = getProductCardPricing(product);



  return (

    <figure
      className={`mk-bc-card mk-bc-card--wide${placement !== "default" ? ` mk-bc-card--${placement}` : ""}`}
      role="listitem"
    >

      {badges.length > 0 ? (

        <div className="mk-bc-card__badges">

          {badges.map((badge) => (

            <span

              key={badge.id}

              className={`mk-bc-card__badge mk-bc-card__badge--${badge.id}`}

            >

              {badge.label}

            </span>

          ))}

        </div>

      ) : null}



      <div className="mk-bc-card__image-container">

        <ProductCardCarousel

          images={product.images}

          alt={product.title}

          href={product.href}

        />

      </div>



      <figcaption className="mk-bc-card__figcaption">

        <Link

          href={product.href}

          className="mk-bc-card__product-link"

          aria-label={product.title}

          draggable={false}

        >

          <div className="mk-bc-card__name">{product.title}</div>



          <div className="mk-bc-card__materials">

            {materials.map((material, i) => (

              <span key={material}>

                {i > 0 ? (

                  <>

                    {" "}

                    <span className="mk-bc-card__bullet" aria-hidden="true">

                      •

                    </span>{" "}

                  </>

                ) : null}

                {material}

              </span>

            ))}

          </div>



          <div className="mk-bc-card__price-container">

            <div className="mk-bc-card__price-label">Rec. retail price</div>

            {pricing.price !== null ? (

              <>

                <div className="mk-bc-card__price">{formatPkr(pricing.price)}</div>

                {pricing.beforePrice !== null ? (

                  <div className="mk-bc-card__before-price">

                    Before {formatPkr(pricing.beforePrice)}

                  </div>

                ) : null}

                {pricing.fromPrice !== null ? (

                  <div className="mk-bc-card__from-price">

                    From {formatPkr(pricing.fromPrice)}

                  </div>

                ) : null}

              </>

            ) : (

              <div className="mk-bc-card__price">Price on request</div>

            )}

          </div>

        </Link>

      </figcaption>

    </figure>

  );

}



export function ProductCatalogCard({

  product,

  styleLabels,

  variant = "default",

  placement = "default",

}: ProductCatalogCardProps) {

  if (variant === "service") {

    return <ServiceProductCard product={product} placement={placement} />;

  }



  const typeLabel =

    PRODUCT_TYPE_BY_ID.get(product.primaryProductTypeId)?.label ?? "";



  const roomLabel = getCollectionPageTitle(product.collectionSlug);

  const { catalogImage } = product;



  return (

    <article className="mk-products__card" role="listitem">

      <Link

        href={product.href}

        className="mk-products__card-link"

        aria-label={product.title}

      >

        <div className="mk-products__card-media">

          {catalogImage ? (

            // eslint-disable-next-line @next/next/no-img-element

            <img

              src={catalogImage.src}

              srcSet={catalogImage.srcSet}

              sizes="(max-width: 576px) 50vw, (max-width: 1200px) 33vw, 25vw"

              alt={catalogImage.alt}

              className="mk-products__card-img"

              loading="lazy"

              decoding="async"

            />

          ) : (

            <div className="mk-products__card-placeholder" aria-hidden="true" />

          )}

          {product.onlineShop ? (

            <span className="mk-products__card-badge">Shop online</span>

          ) : null}

        </div>

        <div className="mk-products__card-body">

          <div className="mk-products__card-meta">

            <span className="mk-products__card-room">{roomLabel}</span>

            {typeLabel ? (

              <span className="mk-products__card-type">{typeLabel}</span>

            ) : null}

          </div>

          <h2 className="mk-products__card-title">{product.title}</h2>

          {styleLabels.length > 0 ? (

            <p className="mk-products__card-tags">

              {styleLabels.slice(0, 3).join(" · ")}

            </p>

          ) : null}

          <p className="mk-products__card-price">

            {product.price !== null

              ? `From ${formatPkr(product.price)}`

              : "Price on request"}

          </p>

        </div>

      </Link>

    </article>

  );

}

