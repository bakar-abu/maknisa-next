import type {
  AboutPageContent,
  CommunicationPageContent,
  ContactsPageContent,
  HistoricPageContent,
  PolicyPageContent,
  QualityPageContent,
  StoresPageContent,
} from "@/lib/cms/company-page";
import type { CompanySlug } from "@/lib/company-pages";
import { AboutCompanyPage } from "./AboutCompanyPage";
import { CommunicationCompanyPage } from "./CommunicationCompanyPage";
import { ContactsCompanyPage } from "./ContactsCompanyPage";
import { HistoricCompanyPage } from "./HistoricCompanyPage";
import { PolicyCompanyPage } from "./PolicyCompanyPage";
import { QualityCompanyPage } from "./QualityCompanyPage";
import { StoresCompanyPage } from "./StoresCompanyPage";

export function CompanyPageRenderer({
  slug,
  content,
}: {
  slug: CompanySlug;
  content: unknown;
}) {
  switch (slug) {
    case "company":
      return <AboutCompanyPage content={content as AboutPageContent} />;
    case "communication":
      return <CommunicationCompanyPage content={content as CommunicationPageContent} />;
    case "company-policy":
      return <PolicyCompanyPage content={content as PolicyPageContent} />;
    case "quality":
      return <QualityCompanyPage content={content as QualityPageContent} />;
    case "contacts":
      return <ContactsCompanyPage content={content as ContactsPageContent} />;
    case "maknisa-store":
      return <StoresCompanyPage content={content as StoresPageContent} />;
    case "historic-brands":
      return <HistoricCompanyPage content={content as HistoricPageContent} />;
    default:
      return null;
  }
}
