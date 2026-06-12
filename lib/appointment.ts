import { storesContent } from "./company-pages";
import { BOOK_APPOINTMENT_HREF } from "./routes";
import { SERVICE_PAGES } from "./services";
import { site } from "./site";

export { BOOK_APPOINTMENT_HREF };

export const appointmentShowrooms = storesContent.map((store) => ({
  value: store.id,
  label: store.city,
}));

export const appointmentServices = SERVICE_PAGES.map((page) => ({
  value: page.slug,
  label: page.label,
}));

export const appointmentContent = {
  title: "Book an appointment",
  metaDescription: `Book a personalised design appointment with ${site.name}. Tell us about your project and our team will get in touch.`,
  intro:
    "Share a few details about your project and preferred showroom. Our design consultants will contact you to arrange a personalised appointment.",
  successTitle: "Thank you — we have received your request",
  successMessage:
    "A member of the Maknisa team will contact you shortly to confirm your appointment.",
};

export type AppointmentFormData = {
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  showroom: string;
  service: string;
  preferredDate: string;
  message: string;
};

export const emptyAppointmentForm = (): AppointmentFormData => ({
  firstName: "",
  lastName: "",
  email: "",
  phone: "",
  showroom: "",
  service: "",
  preferredDate: "",
  message: "",
});
