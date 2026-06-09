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

export const collectionsMenu: NavGroup = {
  label: "Collections",
  links: [
    { label: "Kitchens", href: "/ww/kitchens", title: "Kitchens" },
    { label: "Bathrooms", href: "/ww/bathrooms", title: "Bathrooms" },
    { label: "Living", href: "/ww/living", title: "Living" },
    { label: "Night", href: "/ww/bedroom-furniture", title: "Night" },
    {
      label: "Tables, chairs and stools",
      href: "/ww/tables-chairs-stools",
      title: "Tables, chairs and stools",
    },
    { label: "Outdoor", href: "/ww/formalia-outdoor", title: "Outdoor" },
    {
      label: "Multi-functional modules",
      href: "/ww/multi-functional-modules",
      title: "Multi-functional modules",
    },
    { label: "Inspire me", href: "/ww/inspire-me", title: "Inspire me" },
    {
      label: "Marble & tiles",
      href: "/ww/marble-tiles",
      title: "Marble & Tiles | Maknisa",
    },
    { label: "Lighting", href: "/ww/lighting", title: "Lighting | Maknisa" },
  ],
};

export const productsLink: NavLink = {
  label: "Products",
  href: "/ww/products",
  title: "Products | Maknisa",
};

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
    label: "Find a dealer",
    href: "/ww/find-a-dealer",
    title: "Find a Dealer: to see the products in person | Maknisa",
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
  {
    code: "cn",
    label: "Chinese",
    href: "https://www.scavolini.cn/",
    external: true,
  },
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
    title: "How to contact Maknisa in Italy and around the world | Maknisa",
  },
  {
    label: "Tables, chairs and stools",
    href: "/ww/tables-chairs-stools",
    title: "Kitchen Tables, Living Room Chairs and Stools | Maknisa",
  },
  { label: "Dealers Area", href: "http://www.scavolini.net/", external: true },
  {
    label: "Request catalogue",
    href: "/ww/request-catalogue",
    title: "General catalogue | Maknisa",
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
