import Link from "next/link";
import { MagazineBreadcrumbs } from "@/components/magazine/MagazineBreadcrumbs";
import type { ServiceLandingCard } from "@/lib/services-landing";
import { site } from "@/lib/site";

import "@/app/styles/services-landing.css";

type ServicesLandingPageProps = {
  cards: ServiceLandingCard[];
};

export function ServicesLandingPage({ cards }: ServicesLandingPageProps) {
  return (
    <main id="main-content" role="main" className="mk-services-landing">
      <div className="container-fluid mk-services-landing__container">
        <header className="mk-services-landing__header">
          <MagazineBreadcrumbs
            items={[{ label: "Home", href: "/" }, { label: "Services" }]}
          />
          <h1 className="mk-services-landing__title">Services</h1>
        </header>

        <div className="mk-services-landing__grid row">
          {cards.map((card) => (
            <div
              key={card.slug}
              className="col-6 col-lg-4 mk-services-landing__col"
            >
              <Link
                href={card.href}
                className="mk-services-card"
                title={card.label}
              >
                <div className="mk-services-card__image">
                  {card.image ? (
                    // eslint-disable-next-line @next/next/no-img-element
                    <img
                      src={card.image}
                      alt=""
                      className="mk-services-card__img mk-services-card__img--primary"
                      loading="lazy"
                    />
                  ) : null}
                  {card.hoverImage ? (
                    // eslint-disable-next-line @next/next/no-img-element
                    <img
                      src={card.hoverImage}
                      alt=""
                      className="mk-services-card__img mk-services-card__img--hover"
                      loading="lazy"
                    />
                  ) : null}
                  <span className="mk-services-card__watermark" aria-hidden="true">
                    {site.name}
                  </span>
                </div>
                <h2 className="mk-services-card__label">{card.label}</h2>
              </Link>
            </div>
          ))}
        </div>
      </div>
    </main>
  );
}
