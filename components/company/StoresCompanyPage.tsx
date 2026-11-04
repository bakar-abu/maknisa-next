import { CompanyStoresGrid } from "@/components/company/CompanyStoresGrid";
import type { StoresPageContent } from "@/lib/cms/company-page";
import { storesContent } from "@/lib/company-pages";

type StoresCompanyPageProps = {
  content?: StoresPageContent;
};

export function StoresCompanyPage({ content }: StoresCompanyPageProps) {
  return (
    <main id="main-content" role="main">
      <CompanyStoresGrid stores={content ?? storesContent} />
    </main>
  );
}
