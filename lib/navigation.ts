import { BOOK_APPOINTMENT_HREF } from "./routes";
import { MAGAZINE_HREF } from "./magazine";
import { SERVICE_PAGES, servicePageHref } from "./services";
import { site } from "./site";

export type NavLink = {
  label: string;
  href: string;
  title?: string;
  external?: boolean;
};

export type NavGroup = {
  label: string;
  links: NavLink[];
  highlight?: {
    image: string;
    text: string;
    cta: NavLink;
  };
};

export const servicesMenu: NavGroup = {
  label: "Services",
  links: SERVICE_PAGES.map((page) => ({
    label: page.label,
    href: servicePageHref(page.slug),
    title: page.label,
  })),
};

/** @deprecated Use servicesMenu */
export const collectionsMenu = servicesMenu;

export const companyMenu: NavGroup = {
  label: "Company",
  links: [
    { label: "About us", href: "/ww/company/company", title: "About us" },
    {
      label: "Communication",
      href: "/ww/company/communication",
      title: "Communication",
    },
    {
      label: "Company Policy",
      href: "/ww/company/company-policy",
      title: "Company Policy",
    },
    {
      label: "Quality and Sustainability",
      href: "/ww/company/quality",
      title: "Quality and Sustainability",
    },
    { label: "Contact us", href: "/ww/company/contacts", title: "Contact us" },
    {
      label: "Maknisa Stores",
      href: "/ww/company/maknisa-store",
      title: "Maknisa Stores",
    },
    {
      label: "Historic Brands",
      href: "/ww/company/historic-brands",
      title: "Historic Brands",
    },
  ],
  highlight: {
    image: "/media/immagini/10053_t_marchio-storico-highlitgh.jpg",
    text: "Discover signature Maknisa collections — furniture, tiles, lighting, and kitchens trusted across Pakistan.",
    cta: {
      label: "Discover more",
      href: "/ww/company/historic-brands",
      title: "Historic Brands",
    },
  },
};

export const serviceLinks: NavLink[] = [
  {
    label: "After-Sales Services",
    href: "/ww/after-sales-services",
    title: "Many After-Sales Services, Customer Care | Maknisa",
  },
  {
    label: "Book an appointment",
    href: BOOK_APPOINTMENT_HREF,
    title: "Book an appointment with Maknisa",
  },
];

export const languages = [
  { code: "ww", label: "English", href: "/", active: true },
  { code: "it", label: "Italian", href: "/it" },
  { code: "de", label: "German", href: "/de" },
  { code: "es", label: "Spanish", href: "/es" },
  { code: "us", label: "U.S. English", href: "/us" },
  { code: "fr", label: "French", href: "/fr" },
  { code: "ru", label: "Russian", href: "/ru" },
  { code: "gr", label: "Greek", href: "/gr" },
  { code: "ur", label: "Urdu", href: "/ur" },
];

export const footerMenuLinks: NavLink[] = [
  {
    label: "Register your product",
    href: "/ww/register-your-product",
    title: "Register your Kitchen, Bathroom or Living Room | Maknisa",
  },
  {
    label: "Contact us",
    href: "/ww/company/contacts",
    title: "How to contact Maknisa in Pakistan and around the world | Maknisa",
  },
  {
    label: "Tables, chairs and stools",
    href: "/ww/tables-chairs-stools",
    title: "Kitchen Tables, Living Room Chairs and Stools | Maknisa",
  },
  {
    label: "Maknisa Stores",
    href: "/ww/company/maknisa-store",
    title: "Visit Maknisa showrooms | Maknisa",
  },
  {
    label: "Request catalogue",
    href: "/ww/request-catalogue",
    title: "General catalogue | Maknisa",
  },
  {
    label: "Magazine",
    href: MAGAZINE_HREF,
    title: "Interior design magazine: Kitchens Bathrooms Living | Maknisa",
  },
  { label: "FAQ", href: "/ww/magazine/faq", title: "FAQ" },
  { label: "Maknisa Biz", href: "/ww/maknisa-biz", title: "Maknisa Biz" },
];

export const footerLegalLinks: NavLink[] = [
  { label: "Copyright", href: "/ww/copyright", title: "Copyright | Maknisa" },
  { label: "Privacy", href: "/ww/privacy", title: "Privacy | Maknisa" },
  {
    label: "Cookie Policy",
    href: "/ww/cookie-policy",
    title: "Cookie Policy | Maknisa",
  },
  { label: "Compliance", href: "/ww/compliance", title: "Compliance" },
];

export const socialLinks = [
  {
    label: `Follow ${site.name} on Facebook`,
    href: "https://www.facebook.com/profile.php?id=61587874235637",
    icon: "facebook",
  },
  {
    label: `Follow ${site.name} on Twitter`,
    href: "https://twitter.com/maknisapk",
    icon: "twitter",
  },
  {
    label: `Follow ${site.name} on Instagram`,
    href: "https://www.instagram.com/maknisaofficial",
    icon: "instagram",
  },
  {
    label: `Follow ${site.name} on TikTok`,
    href: "https://www.tiktok.com/@maknisa.official",
    icon: "tiktok",
  },
] as const;
