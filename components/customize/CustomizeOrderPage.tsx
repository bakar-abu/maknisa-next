import { Suspense } from "react";
import { CustomizeOrderForm } from "@/components/customize/CustomizeOrderForm";
import { MagazineBreadcrumbs } from "@/components/magazine/MagazineBreadcrumbs";
import { customizeOrderContent } from "@/lib/customize-order";

import "@/app/styles/customize-order.css";

export function CustomizeOrderPage() {
  return (
    <main id="main-content" role="main" className="mk-customize-page">
      <div className="mk-customize-page__container">
        <header className="mk-customize-page__header">
          <MagazineBreadcrumbs
            items={[
              { label: "Home", href: "/" },
              { label: customizeOrderContent.title },
            ]}
          />
          <h1 className="mk-customize-page__title">{customizeOrderContent.title}</h1>
          <p className="mk-customize-page__intro">{customizeOrderContent.intro}</p>
        </header>

        <Suspense fallback={<p className="mk-customize-page__loading">Loading form…</p>}>
          <CustomizeOrderForm />
        </Suspense>
      </div>
    </main>
  );
}
