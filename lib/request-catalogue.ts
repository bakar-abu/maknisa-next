import { storesContent } from "./company-pages";
import { REQUEST_CATALOGUE_HREF } from "./catalogue";
import { site } from "./site";

export { REQUEST_CATALOGUE_HREF };

export type CatalogueRequestFormData = {
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  showroom: string;
  catalogueType: string;
  deliveryAddress: string;
  message: string;
};

export const catalogueRequestShowrooms = storesContent.map((store) => ({
  value: store.id,
  label: store.city,
}));

export const catalogueTypeOptions = [
  { value: "general", label: "General Maknisa catalogue" },
  { value: "kitchens", label: "Kitchens catalogue" },
  { value: "furniture", label: "Furniture catalogue" },
  { value: "marble-tiles", label: "Marble & tiles catalogue" },
  { value: "lights", label: "Lighting catalogue" },
  { value: "woodwork", label: "Woodwork catalogue" },
];

export const catalogueRequestContent = {
  title: "Request catalogue",
  metaDescription: `Request a printed or digital Maknisa catalogue. ${site.name} will send collection brochures for kitchens, furniture, lighting, and more.`,
  intro:
    "Tell us which catalogue you need and how we can reach you. Our team will follow up with the right brochure for your project.",
  asideTitle: "What you will receive",
  asideItems: [
    "Curated Maknisa collection brochures for your selected category",
    "Guidance on finishes, materials, and showroom availability",
    "Follow-up from a Maknisa consultant if you need design support",
  ],
  successTitle: "Thank you — your catalogue request was sent",
  successMessage:
    "We will contact you shortly with the catalogue details or delivery options.",
};

export function emptyCatalogueRequestForm(): CatalogueRequestFormData {
  return {
    firstName: "",
    lastName: "",
    email: "",
    phone: "",
    showroom: "",
    catalogueType: "general",
    deliveryAddress: "",
    message: "",
  };
}
