import type { CatalogueListingCard } from "@/lib/catalogue";

function DownloadIcon() {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      aria-hidden="true"
    >
      <path
        d="M12 3v12m0 0l4-4m-4 4L8 11"
        stroke="currentColor"
        strokeWidth="1.75"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M4 17v2a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2v-2"
        stroke="currentColor"
        strokeWidth="1.75"
        strokeLinecap="round"
      />
    </svg>
  );
}

type CatalogueServiceCardProps = {
  card: CatalogueListingCard;
};

export function CatalogueServiceCard({ card }: CatalogueServiceCardProps) {
  return (
    <article className="mk-catalogue-card">
      <div className="mk-catalogue-card__media">
        <a
          href={card.downloadHref}
          className="mk-catalogue-card__visual"
          aria-label={`Download ${card.label} catalogue`}
        >
          <div className="mk-catalogue-card__image">
            {card.image ? (
              // eslint-disable-next-line @next/next/no-img-element
              <img
                src={card.image}
                alt=""
                className="mk-catalogue-card__img mk-catalogue-card__img--primary"
                loading="lazy"
              />
            ) : null}
            {card.hoverImage ? (
              // eslint-disable-next-line @next/next/no-img-element
              <img
                src={card.hoverImage}
                alt=""
                className="mk-catalogue-card__img mk-catalogue-card__img--hover"
                loading="lazy"
              />
            ) : null}
            <span className="mk-catalogue-card__shade" aria-hidden="true" />
            <h2 className="mk-catalogue-card__title">
              <span className="mk-catalogue-card__title-text mk-catalogue-card__title-text--label">
                {card.label}
              </span>
              <span className="mk-catalogue-card__title-text mk-catalogue-card__title-text--download">
                <DownloadIcon />
                Download catalogue
              </span>
            </h2>
          </div>
        </a>

        <span
          className="mk-catalogue-card__info"
          title="Click on the image to download the catalogue"
          aria-label="Click on the image to download the catalogue"
        >
          i
        </span>
      </div>
    </article>
  );
}
