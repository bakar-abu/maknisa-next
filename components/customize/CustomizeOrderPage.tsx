import { Suspense } from "react";
import { CustomizeOrderForm } from "@/components/customize/CustomizeOrderForm";
import { MagazineBreadcrumbs } from "@/components/magazine/MagazineBreadcrumbs";
import { customizeOrderContent } from "@/lib/customize-order";
import type { CustomizePageContent } from "@/lib/cms/support-page";

import "@/app/styles/customize-order.css";

type CustomizeOrderPageProps = {
  content?: CustomizePageContent;
};

export function CustomizeOrderPage({ content }: CustomizeOrderPageProps = {}) {
  const pageContent = content ?? {
    title: customizeOrderContent.title,
    intro: customizeOrderContent.intro,
    successTitle: customizeOrderContent.successTitle,
    successMessage: customizeOrderContent.successMessage,
  };

  return (
    <main id="main-content" role="main" className="mk-customize-page">
      <div className="mk-customize-page__container">
        <header className="mk-customize-page__header">
          <MagazineBreadcrumbs
            items={[
              { label: "Home", href: "/" },
              { label: pageContent.title },
            ]}
          />
          <h1 className="mk-customize-page__title">{pageContent.title}</h1>
          <p className="mk-customize-page__intro">{pageContent.intro}</p>
        </header>

        <Suspense fallback={<p className="mk-customize-page__loading">Loading form…</p>}>
          <CustomizeOrderForm
            successTitle={pageContent.successTitle}
            successMessage={pageContent.successMessage}
          />
        </Suspense>
      </div>
    </main>
  );
}
