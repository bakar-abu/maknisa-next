import Link from "next/link";
import { MagazineBreadcrumbs } from "@/components/magazine/MagazineBreadcrumbs";
import { CatalogueServiceCard } from "@/components/catalogue/CatalogueServiceCard";
import { BOOK_APPOINTMENT_HREF } from "@/lib/appointment";
import type { CatalogueListingCard } from "@/lib/catalogue";
import { getMagazineListArticles, MAGAZINE_HREF } from "@/lib/magazine";

import "@/app/styles/catalogue-landing.css";

type CatalogueListingPageProps = {
  cards: CatalogueListingCard[];
};

export function CatalogueListingPage({ cards }: CatalogueListingPageProps) {
  const relatedArticles = getMagazineListArticles()
    .filter((article) => article.image)
    .slice(0, 3);

  return (
    <main id="main-content" role="main" className="mk-catalogue-landing">
      <div className="mk-catalogue-landing__container">
        <header className="mk-catalogue-landing__header">
          <MagazineBreadcrumbs
            items={[{ label: "Home", href: "/" }, { label: "Catalogue" }]}
          />
          <h1 className="mk-catalogue-landing__title">Catalogue</h1>
          <p className="mk-catalogue-landing__intro">
            Browse Maknisa catalogues by service — kitchens, surfaces, woodwork,
            interior design, furniture, and lighting. Hover a card to preview,
            then click the image to download that service catalogue.
          </p>
        </header>

        <div className="mk-catalogue-landing__grid row">
          {cards.map((card) => (
            <div
              key={card.slug}
              className="col-6 col-lg-4 mk-catalogue-landing__col"
            >
              <CatalogueServiceCard card={card} />
            </div>
          ))}
        </div>

        <div className="mk-catalogue-landing__appointment">
          <p className="mk-catalogue-landing__appointment-lead">
            Can&apos;t find what you&apos;re looking for?
          </p>
          <p className="mk-catalogue-landing__appointment-text">
            Book a personalised appointment with our team to customise your
            project — from layout and materials to finishes and installation.
          </p>
          <Link
            href={BOOK_APPOINTMENT_HREF}
            className="mk-catalogue-landing__appointment-cta"
          >
            Book an appointment
          </Link>
        </div>

        {relatedArticles.length > 0 ? (
          <section
            className="mk-catalogue-landing__related"
            aria-labelledby="catalogue-related-heading"
          >
            <div className="mk-catalogue-landing__related-head">
              <div>
                <h2
                  id="catalogue-related-heading"
                  className="mk-catalogue-landing__related-title"
                >
                  Related inspiration
                </h2>
                <p className="mk-catalogue-landing__related-sub">
                  Ideas and guides from the Maknisa Magazine to help you plan
                  your project.
                </p>
              </div>
              <Link
                href={MAGAZINE_HREF}
                className="mk-catalogue-landing__related-link"
              >
                View all articles
              </Link>
            </div>

            <div className="mk-catalogue-landing__related-grid">
              {relatedArticles.map((article) => (
                <Link
                  key={article.id}
                  href={article.href}
                  className="mk-catalogue-related-card"
                >
                  <span className="mk-catalogue-related-card__media">
                    {article.image ? (
                      // eslint-disable-next-line @next/next/no-img-element
                      <img src={article.image} alt="" loading="lazy" />
                    ) : null}
                  </span>
                  <h3 className="mk-catalogue-related-card__title">
                    {article.title}
                  </h3>
                  <p className="mk-catalogue-related-card__excerpt">
                    {article.excerpt}
                  </p>
                  <span className="mk-catalogue-related-card__more">
                    Read more
                  </span>
                </Link>
              ))}
            </div>
          </section>
        ) : null}
      </div>
    </main>
  );
}
