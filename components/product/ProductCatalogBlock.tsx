import Link from "next/link";

type ProductCatalogBlockProps = {
  productTitle: string;
  collectionTitle: string;
  coverImage: string;
  collectionHref: string;
};

export function ProductCatalogBlock({
  productTitle,
  collectionTitle,
  coverImage,
  collectionHref,
}: ProductCatalogBlockProps) {
  return (
    <div className="mk-pdp__catalog">
      <div className="mk-pdp__catalog-copy">
        <h2>The catalog</h2>
        <p>
          The monographic volume dedicated to {productTitle}, part of our{" "}
          {collectionTitle.toLowerCase()} collection.
        </p>
        <Link href={collectionHref} className="mk-pdp__catalog-download">
          Download
        </Link>
      </div>
      <div className="mk-pdp__catalog-card" aria-hidden>
        <span className="mk-pdp__catalog-card-title">{productTitle}</span>
        {coverImage ? (
          <div className="mk-pdp__catalog-card-img">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src={coverImage} alt="" />
          </div>
        ) : null}
        <span className="mk-pdp__catalog-card-brand">Maknisa</span>
      </div>
    </div>
  );
}
