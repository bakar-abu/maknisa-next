import Link from "next/link";
import { MagazineBreadcrumbs } from "@/components/magazine/MagazineBreadcrumbs";
import { CatalogueServiceCard } from "@/components/catalogue/CatalogueServiceCard";
import type { CatalogueListingCard } from "@/lib/catalogue";
import { cataloguePageDefaults } from "@/lib/catalogue-page";
import type { MagazineListArticle } from "@/lib/magazine";

import "@/app/styles/catalogue-landing.css";

export type CatalogueListingContent = {
  title: string;
  intro: string;
  appointmentLead: string;
  appointmentText: string;
  appointmentCtaLabel: string;
  appointmentCtaHref: string;
  relatedTitle: string;
  relatedSubtitle: string;
  relatedViewAllLabel: string;
  relatedViewAllHref: string;
  relatedEnabled: boolean;
};

type CatalogueListingPageProps = {
  cards: CatalogueListingCard[];
  content?: CatalogueListingContent;
  relatedArticles?: MagazineListArticle[];
};

export function CatalogueListingPage({
  cards,
  content,
  relatedArticles = [],
}: CatalogueListingPageProps) {
  const pageContent = content ?? {
    title: cataloguePageDefaults.title,
    intro: cataloguePageDefaults.intro,
    appointmentLead: cataloguePageDefaults.appointmentLead,
    appointmentText: cataloguePageDefaults.appointmentText,
    appointmentCtaLabel: cataloguePageDefaults.appointmentCtaLabel,
    appointmentCtaHref: cataloguePageDefaults.appointmentCtaHref,
    relatedTitle: cataloguePageDefaults.relatedTitle,
    relatedSubtitle: cataloguePageDefaults.relatedSubtitle,
    relatedViewAllLabel: cataloguePageDefaults.relatedViewAllLabel,
    relatedViewAllHref: cataloguePageDefaults.relatedViewAllHref,
    relatedEnabled: cataloguePageDefaults.relatedEnabled,
  };

  return (
    <main id="main-content" role="main" className="mk-catalogue-landing">
      <div className="mk-catalogue-landing__container">
        <header className="mk-catalogue-landing__header">
          <MagazineBreadcrumbs
            items={[{ label: "Home", href: "/" }, { label: pageContent.title }]}
          />
          <h1 className="mk-catalogue-landing__title">{pageContent.title}</h1>
          <p className="mk-catalogue-landing__intro">{pageContent.intro}</p>
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
            {pageContent.appointmentLead}
          </p>
          <p className="mk-catalogue-landing__appointment-text">
            {pageContent.appointmentText}
          </p>
          <Link
            href={pageContent.appointmentCtaHref}
            className="mk-catalogue-landing__appointment-cta"
          >
            {pageContent.appointmentCtaLabel}
          </Link>
        </div>

        {pageContent.relatedEnabled && relatedArticles.length > 0 ? (
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
                  {pageContent.relatedTitle}
                </h2>
                <p className="mk-catalogue-landing__related-sub">
                  {pageContent.relatedSubtitle}
                </p>
              </div>
              <Link
                href={pageContent.relatedViewAllHref}
                className="mk-catalogue-landing__related-link"
              >
                {pageContent.relatedViewAllLabel}
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
                  <span className="mk-catalogue-related-card__more">Read more</span>
                </Link>
              ))}
            </div>
          </section>
        ) : null}
      </div>
    </main>
  );
}
