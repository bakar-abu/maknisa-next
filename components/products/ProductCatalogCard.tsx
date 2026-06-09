import Link from "next/link";
import type { CatalogProduct } from "@/lib/catalog-types";
import { formatPkr } from "@/lib/format-price";
import { PRODUCT_TYPE_BY_ID } from "@/lib/product-types";
import { getCollectionPageTitle } from "@/lib/collections";

type ProductCatalogCardProps = {
  product: CatalogProduct;
  styleLabels: string[];
};

export function ProductCatalogCard({
  product,
  styleLabels,
}: ProductCatalogCardProps) {
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
              sizes="(max-width: 576px) 100vw, (max-width: 992px) 50vw, 33vw"
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
