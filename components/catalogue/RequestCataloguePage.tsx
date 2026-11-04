import { RequestCatalogueForm } from "@/components/catalogue/RequestCatalogueForm";
import { MagazineBreadcrumbs } from "@/components/magazine/MagazineBreadcrumbs";
import { catalogueRequestContent } from "@/lib/request-catalogue";

import "@/app/styles/book-appointment.css";

export function RequestCataloguePage() {
  return (
    <main id="main-content" role="main" className="mk-appointment-page">
      <div className="mk-appointment-page__container">
        <header className="mk-appointment-page__header">
          <MagazineBreadcrumbs
            items={[
              { label: "Home", href: "/" },
              { label: catalogueRequestContent.title },
            ]}
          />
          <h1 className="mk-appointment-page__title">{catalogueRequestContent.title}</h1>
          <p className="mk-appointment-page__intro">{catalogueRequestContent.intro}</p>
        </header>

        <div className="mk-appointment-page__layout">
          <aside className="mk-appointment-page__aside">
            <h2 className="mk-appointment-page__aside-title">
              {catalogueRequestContent.asideTitle}
            </h2>
            <ul className="mk-appointment-page__list">
              {catalogueRequestContent.asideItems.map((item) => (
                <li key={item}>{item}</li>
              ))}
            </ul>
          </aside>

          <div className="mk-appointment-page__form-wrap">
            <RequestCatalogueForm />
          </div>
        </div>
      </div>
    </main>
  );
}
