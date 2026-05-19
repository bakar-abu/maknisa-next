import Link from "next/link";
import type { MagazineListArticle } from "@/lib/magazine";

type MagazineGridCardProps = {
  article: MagazineListArticle;
};

export function MagazineGridCard({ article }: MagazineGridCardProps) {
  const colClass = article.large
    ? "sn_grid_magazine_col mb-40 col-12 col-lg-8"
    : "sn_grid_magazine_col mb-40 col-12 col-lg-4";

  return (
    <div className={colClass}>
      <div className="sn_magazine_i pb-40 _bb_gray">
        <Link
          id={`post-link-${article.id}`}
          href={article.href}
          className="sn_magazine_i_link stretched-link"
          aria-labelledby={`read-more-${article.id} post-title-${article.id}`}
        />
        {article.image ? (
          <picture className="mb-20">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src={article.image} alt="" className="img-fluid" />
          </picture>
        ) : null}
        {article.category.label && article.category.href ? (
          <Link href={article.category.href} className="sn_magazine_i_label">
            {article.category.label}
          </Link>
        ) : article.category.label ? (
          <span className="sn_magazine_i_label">{article.category.label}</span>
        ) : null}
        <h2
          id={`post-title-${article.id}`}
          className={`sn_magazine_i_title ${article.large ? "h3" : "h6"} mb-20`}
        >
          {article.title}
        </h2>
        <div className="sn_magazine_i_content mb-20">{article.excerpt}</div>
        <span className="sn_btn_grow">
          <span className="tx" id={`read-more-${article.id}`}>
            Read all
          </span>
          <span className="sq" aria-hidden="true" data-title="Read all" />
        </span>
      </div>
    </div>
  );
}
