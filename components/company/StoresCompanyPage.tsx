import { CompanyStoresGrid } from "@/components/company/CompanyStoresGrid";
import { storesContent } from "@/lib/company-pages";

export function StoresCompanyPage() {
  return (
    <main id="main-content" role="main">
      <CompanyStoresGrid stores={storesContent} />
    </main>
  );
}
