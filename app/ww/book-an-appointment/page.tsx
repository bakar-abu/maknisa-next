import type { Metadata } from "next";
import { BookAppointmentPage } from "@/components/appointment/BookAppointmentPage";
import { appointmentContent } from "@/lib/appointment";
import { site } from "@/lib/site";

export const metadata: Metadata = {
  title: `${appointmentContent.title} | ${site.name}`,
  description: appointmentContent.metaDescription,
};

export default function BookAppointmentRoute() {
  return <BookAppointmentPage />;
}
