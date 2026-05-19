import Link from "next/link";
import { MagazineBreadcrumbs } from "@/components/magazine/MagazineBreadcrumbs";
import { GrowButton } from "@/components/home/shared/GrowButton";
import type { MagazineArticleDetail } from "@/lib/magazine";
import { getMagazineListArticles } from "@/lib/magazine";

type MagazineArticlePageProps = {
  article: MagazineArticleDetail;
};

export function MagazineArticlePage({ article }: MagazineArticlePageProps) {
  const related = getMagazineListArticles()
    .filter((a) => a.id !== article.id)
    .slice(0, 3);

  return (
    <main id="main-content" role="main">
      <section className="sn_intro_text mt-80 mb-100">
        <div className="container">
          <div className="row justify-content-center">
            <div className="col-10 col-sm-11 col-md-12 col-lg-10 col-xl-8 mb-40">
              <MagazineBreadcrumbs items={article.breadcrumbs} />
            </div>
          </div>
        </div>
        <div className="sn_vertical_text">
          <div className="sn_vertical_text_in py-10 py-lg-60">
            <div className="d-flex align-items-baseline d-lg-block">
              <div className="h1 m-0">Magazine</div>
            </div>
          </div>
        </div>
        <div className="container">
          <div className="row justify-content-center">
            <div className="col-10 col-sm-11 col-md-12 col-lg-10 col-xl-8">
              <h1 className="h1 mb-20">{article.title}</h1>
              {article.subtitle ? (
                <h2 className="h4 mb-40">{article.subtitle}</h2>
              ) : null}
            </div>
          </div>
        </div>
      </section>

      {article.heroImage ? (
        <section className="sn_image_full _left my-50 my-lg-80">
          <div className="container">
            <div className="row justify-content-center">
              <div className="col-10 col-sm-11 col-md-12 col-lg-10 col-xl-8">
                <picture>
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img src={article.heroImage} alt="" className="img-fluid w-100" />
                </picture>
              </div>
            </div>
          </div>
        </section>
      ) : null}

      <section className="sn_text my-50 my-lg-80">
        <div className="container">
          <div className="row justify-content-center">
            <div
              className="col-10 col-sm-11 col-md-12 col-lg-10 col-xl-8 sn_paragraph_md"
              dangerouslySetInnerHTML={{ __html: article.bodyHtml }}
            />
          </div>
        </div>
      </section>

      <section className="sn_share_full mt-80 mb-100 mt-lg-150 mb-lg-180">
        <div className="container">
          <div className="row justify-content-center">
            <div className="col-10 col-sm-11 col-md-12 col-lg-10 col-xl-8">
              <div className="h5 mb-20">Share</div>
            </div>
          </div>
        </div>
      </section>

      <section className="sn_slider_related pt-70 pb-120 pt-lg-100 pb-lg-190 mt-80 mt-lg-150 bg-light">
        <div className="container">
          <div className="row">
            <div className="col-12 col-xl-10 offset-xl-1">
              <h2 className="h3 mb-40">Related Contents</h2>
              <div className="listing-news">
                {related.map((item) => (
                  <div key={item.id} className="card-news">
                    {item.image ? (
                      <picture>
                        {/* eslint-disable-next-line @next/next/no-img-element */}
                        <img src={item.image} alt="" />
                      </picture>
                    ) : null}
                    <div className="content-main">
                      <div className="content">
                        <h3 className="title h3">{item.title}</h3>
                        <div className="abstract">{item.excerpt}</div>
                        <GrowButton
                          href={item.href}
                          label="Read all"
                          className="sn_btn_grow _small"
                        />
                      </div>
                      {item.category.label && item.category.href ? (
                        <div className="category">
                          <Link href={item.category.href} title={item.category.label}>
                            {item.category.label}
                          </Link>
                        </div>
                      ) : null}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}
