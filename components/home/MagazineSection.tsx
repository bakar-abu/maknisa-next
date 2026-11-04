"use client";

import Link from "next/link";
import { GrowButton } from "@/components/home/shared/GrowButton";
import type { MagazineContent } from "@/lib/cms/home-page";
import { magazineSection } from "@/lib/homeSections";
import { mediaUrl } from "@/lib/media";

type MagazineSectionProps = {
  content?: MagazineContent;
};

export function MagazineSection({ content }: MagazineSectionProps) {
  const section = content ?? magazineSection;

  return (
    <section className="sn_magazine py-80 py-lg-160">
      <div className="container-fluid">
        <div className="row">
          <div className="col-12 col-xl-10 offset-xl-1">
            <div className="cont-head pb-0 pb-sm-40 pb-md-80">
              <div className="cont-head__header">
                <div className="title h1">{section.title}</div>
                <div
                  className="txt"
                  dangerouslySetInnerHTML={{ __html: section.introHtml }}
                />
              </div>
              <div className="cont-head__link">
                <GrowButton
                  href={section.allArticlesCta.href}
                  label={section.allArticlesCta.label}
                />
              </div>
            </div>
            <div className="listing-news">
              {section.articles.map((article) => (
                <div key={article.id} className="card-news">
                  {article.image ? (
                    <picture>
                      <img
                        src={
                          article.image.startsWith("http")
                            ? article.image
                            : mediaUrl(article.image)
                        }
                        alt=""
                      />
                    </picture>
                  ) : null}
                  <div className="content-main">
                    <div className="content">
                      <h3 className="title h3" id={`news-title-${article.id}`}>
                        {article.title}
                      </h3>
                      <div className="abstract">{article.abstract}</div>
                      <GrowButton
                        href={article.href}
                        label="Read all"
                        className="sn_btn_grow _small"
                        id={`news-link-${article.id}`}
                        ariaLabelledBy={`news-link-${article.id} news-title-${article.id}`}
                      />
                    </div>
                    <div className="category">
                      <Link
                        href={article.category.href}
                        title={article.category.label}
                        aria-label={`Category: ${article.category.label}`}
                      >
                        {article.category.label}
                      </Link>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
