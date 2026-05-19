import type { CompanySlug } from "@/lib/company-pages";
import { AboutCompanyPage } from "./AboutCompanyPage";
import { CommunicationCompanyPage } from "./CommunicationCompanyPage";
import { ContactsCompanyPage } from "./ContactsCompanyPage";
import { HistoricCompanyPage } from "./HistoricCompanyPage";
import { PolicyCompanyPage } from "./PolicyCompanyPage";
import { QualityCompanyPage } from "./QualityCompanyPage";
import { StoresCompanyPage } from "./StoresCompanyPage";

export function CompanyPageRenderer({ slug }: { slug: CompanySlug }) {
  switch (slug) {
    case "company":
      return <AboutCompanyPage />;
    case "communication":
      return <CommunicationCompanyPage />;
    case "company-policy":
      return <PolicyCompanyPage />;
    case "quality":
      return <QualityCompanyPage />;
    case "contacts":
      return <ContactsCompanyPage />;
    case "maknisa-store":
      return <StoresCompanyPage />;
    case "historic-brands":
      return <HistoricCompanyPage />;
    default:
      return null;
  }
}
