import type { Metadata } from "next";
import { BookAppointmentPage } from "@/components/appointment/BookAppointmentPage";
import { buildAppointmentPageContent } from "@/lib/cms/support-page";
import { fetchPublicSupportPageContent } from "@/lib/cms/fetch-support-page";
import { appointmentContent } from "@/lib/appointment";
import { site } from "@/lib/site";

export async function generateMetadata(): Promise<Metadata> {
  const cms = await fetchPublicSupportPageContent("book-an-appointment");
  const robots = {
    index: !cms.seo.noIndex,
    follow: !cms.seo.noFollow,
  };

  return {
    title: cms.seo.metaTitle || `${appointmentContent.title} | ${site.name}`,
    description: cms.seo.metaDescription || appointmentContent.metaDescription,
    robots,
  };
}

export default async function BookAppointmentRoute() {
  const cms = await fetchPublicSupportPageContent("book-an-appointment");
  const content = buildAppointmentPageContent(cms.sections);

  return <BookAppointmentPage content={content} />;
}
