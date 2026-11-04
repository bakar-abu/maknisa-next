import Link from "next/link";
import { MagazineBreadcrumbs } from "@/components/magazine/MagazineBreadcrumbs";
import { MagazineGridCard } from "@/components/magazine/MagazineGridCard";
import { getMagazineCategories } from "@/lib/magazine";
import type { MagazineListArticle } from "@/lib/magazine";

type MagazineListingPageProps = {
  articles: MagazineListArticle[];
};

export function MagazineListingPage({ articles }: MagazineListingPageProps) {
  const categories = getMagazineCategories();

  return (
    <main id="main-content" role="main">
      <section className="sn_intro_text mt-80 mb-40">
        <div className="container">
          <div className="row justify-content-center">
            <div className="col-12 mb-40">
              <MagazineBreadcrumbs
                items={[
                  { label: "Home", href: "/" },
                  { label: "Magazine" },
                ]}
              />
            </div>
            <div className="col-12">
              <h1 className="h1 m-0">Magazine</h1>
            </div>
          </div>
        </div>
      </section>

      <section className="sn_grid_magazine mt-40 mb-90 mb-lg-180">
        <div className="container">
          <div className="row">
            <div className="col-12 mb-60">
              <div className="sn_grid_magazine_categories">
                {categories.map((cat) => (
                  <Link
                    key={cat.href}
                    href={cat.href}
                    className={cat.href === "/ww/magazine" ? "_active" : ""}
                    title={cat.title}
                    aria-current={
                      cat.href === "/ww/magazine" ? "page" : undefined
                    }
                  >
                    {cat.label}
                  </Link>
                ))}
              </div>
            </div>
            <div className="col-12 sn_paragraph_xl mb-90">
              Kitchens, living rooms, bathrooms and so much more: dive into a
              world of styles and discover new furnishing trends in the Maknisa
              Magazine! Select the category you are interested in or browse
              through the articles specially chosen for you.
            </div>
            <div className="col-12">
              <div className="sn_grid_magazine_row row">
                <div className="sn_grid_magazine_sizer col-12 col-lg-4" />
                {articles.map((article) => (
                  <MagazineGridCard key={article.id} article={article} />
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}
