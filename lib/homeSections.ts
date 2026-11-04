import { BOOK_APPOINTMENT_HREF } from "./routes";

export type GrowCta = {
  href: string;
  label: string;
  className?: string;
};

export type LaunchBox = {
  image: string;
  title: string;
  abstractHtml: string;
  cta: GrowCta;
};

export type DesignColumn = {
  title: string;
  image: string;
  textHtml: string;
};

export type NewsScrollItem = {
  image: string;
  title: string;
  text: string;
};

export type ActionSiteItem = {
  icon: string;
  title: string;
  text: string;
  href: string;
  linkLabel: string;
};

export type MagazineArticle = {
  id: string;
  title: string;
  abstract: string;
  href: string;
  category: { label: string; href: string };
  image?: string;
};

export const bespokeTextSection = {
  titleHtml: "Bespoke <strong>furniture</strong><br />design.",
  subtitle: "Numerous Maknisa professionals near you",
};

export const launchBoxes: LaunchBox[] = [
  {
    image: "/media/immagini/13155_z_lancio-01.jpg",
    title: "Walk-in wardrobes",
    abstractHtml:
      "<p><strong>Custom-sized walk-in wardrobes</strong>, designed to fit your budget, to customise your space.</p>",
    cta: {
      href: "/ww/bedroom-furniture",
      label: "All walk-in wardrobes",
      className: "sn_btn_grow _small mt-20 mt-md-40",
    },
  },
  {
    image: "/media/immagini/13156_z_lancio-02.jpg",
    title: "Multi-functional systems",
    abstractHtml:
      "<p>Practical and dynamic <strong>concealed settings</strong> without sacrificing Maknisa style.</p>",
    cta: {
      href: "/ww/multi-functional-modules",
      label: "All multi-functional systems",
      className: "sn_btn_grow _small mt-20 mt-md-40",
    },
  },
  {
    image: "/media/immagini/13157_z_lancio-03.jpg",
    title: "Outdoor kitchens",
    abstractHtml:
      "<p>Extend the Maknisa living experience outdoors: our Formalia kitchen adapts to multiple needs and settings.</p>",
    cta: {
      href: "/ww/formalia-outdoor",
      label: "Explore Formalia",
      className: "sn_btn_grow _small mt-20 mt-md-40",
    },
  },
];

export const designColumns: DesignColumn[] = [
  {
    title: "Your budget.",
    image: "/media/immagini/13161_z_progettazione-02.jpg",
    textHtml:
      "<p><strong>Furnishing</strong> your <strong>dream home</strong> with Maknisa is easy and affordable, with a range of solutions to match your budget. And with so many promotions on offer, your dream home is closer than you think.</p>",
  },
  {
    title: "Your ideas.",
    image: "/media/immagini/13160_z_progettazione-01.jpg",
    textHtml:
      "<p>Is there a dream project you're longing to bring to life? With Maknisa every detail of your home takes shape: endless combinations of materials, colours and innovative solutions to create custom-sized projects.</p>",
  },
  {
    title: "Our dealers’ expertise.",
    image: "/media/immagini/13162_z_progettazione-03.jpg",
    textHtml:
      "<p>Rely on our expert dealers for every step of the process, from initial measurements to final assembly. Their experience ensures results that will exceed your expectations, seamlessly blending aesthetics, functionality, and budget.</p>",
  },
];

export const newsScrollingSection = {
  eyebrow: "Hassle-free.",
  title:
    "Quality, assistance and guarantees that accompany your furniture over time.",
  introHtml:
    "Choosing Maknisa means relying on a partner that focuses on performance and reliability, cutting-edge technologies and sustainability.<br /><br />To ensure the best value for your money.",
  items: [
    {
      image: "/media/immagini/13163_z_8877_z_box-01_1.jpg",
      title: "Furniture designed to stand the test of time.",
      text: "Quality made in Italy, timeless design, and flexible modularity in a home that adapts to your life and surpasses your every expectation.",
    },
    {
      image: "/media/immagini/13164_z_8878_z_box-02_1.jpg",
      title: "Satisfied customers constitute the true wealth of a company.",
      text: "Experience unparalleled support, both before and after you buy. Our award-winning service is even recognised by the German Institute for Quality and Finance.",
    },
    {
      image: "/media/immagini/13168_z_8879_z_box-03_1.jpg",
      title:
        "5 years of dedicated support for your kitchens, living rooms and multi-functional modules",
      text: "Today your home has one more reason to be peaceful. Your kitchen, living room, and multi-functional modules are finally protected for a full 5 years.",
    },
    {
      image: "/media/immagini/13169_z_image.jpg",
      title: "No Problem Bathrooms",
      text: "5-year guaranteed assistance on your new bathroom furniture, including technical support and covering any unforeseen problems, so you can relax and enjoy your new space.",
    },
    {
      image: "/media/immagini/13170_z_img-3.jpg",
      title: "International certifications",
      text: "Certifications, ISO 9001 Quality Systems, Made in Italy, ultra-low formaldehyde emissions and product circularity for your safety.",
    },
  ] satisfies NewsScrollItem[],
};

export const environmentVideoSection = {
  desktopVideo: "/ww/downloads/18666/2983/video-ambiente-compresso.mp4",
  mobileVideo: "/ww/downloads/18666/2984/video-ambiente-mobile-compresso.m4v",
  title: "With Maknisa, you protect the environment.",
  subtitle: "Because Maknisa invests in sustainability",
  cta: {
    href: "/ww/company/quality",
    label: "The principles of Maknisa Green Mind",
  },
  keyPhrases: [
    { className: "key-01", text: "avoid wasting water and eliminate pollutants" },
    { className: "key-02", text: "reduce polluting emissions" },
    { className: "key-03", text: "durability" },
    { className: "key-04", text: "recycle waste" },
    { className: "key-05", text: "certified by the environmental management system" },
    { className: "key-06", text: "use sustainable kitchen accessories" },
  ],
};

export const actionsSiteItems: ActionSiteItem[] = [
  {
    icon: "/media/immagini/13173_t_8880_t_CalendarCheck_1.svg",
    title: "Book an appointment",
    text: "Book your customised appointment with your nearest dealer today and start designing your dream kitchen.",
    href: BOOK_APPOINTMENT_HREF,
    linkLabel: "Book an appointment",
  },
  {
    icon: "/media/immagini/13174_t_8881_t_DownloadSimple_1.svg",
    title: "Download the catalogue",
    text: "Discover the variety of all our solutions, designed to meet your needs and desires.",
    href: "/ww/request-catalogue",
    linkLabel: "Download the catalogue",
  },
  {
    icon: "/media/immagini/13175_t_8882_t_PaperPlaneRight_1.svg",
    title: "Subscribe to our newsletter",
    text: "The most popular and beloved kitchen in Italy. Subscribe to the newsletter and find out why!",
    href: "/ww/register-to-our-newsletter",
    linkLabel: "Subscribe to our newsletter",
  },
];

export const magazineSection = {
  title: "Magazine",
  introHtml:
    "<p><strong>Kitchens, living rooms, bathrooms</strong> and so much more: dive into a world of styles and discover new<strong> furnishing trends </strong>in the Maknisa Magazine.</p>",
  allArticlesCta: { href: "/ww/magazine", label: "All articles" },
  articles: [
    {
      id: "19266",
      title: "Furnishing the kitchen and bathroom in the same colour",
      abstract: "3 trendy colours for a matching kitchen and bathroom",
      href: "/ww/furnishing-the-kitchen-and-bathroom-in-the-same-colour",
      category: {
        label: "Colours and materials",
        href: "/ww/magazine/colours-and-materials",
      },
    },
    {
      id: "19034",
      title: "Kitchen, living room and bathroom wall systems",
      abstract: "Kitchen, living room and bathroom wall systems",
      href: "/ww/kitchen-living-room-and-bathroom-wall-systems",
      image:
        "https://scavolini-cdn.thron.com/delivery/public/image/scavolini/67a181ce-21f6-4d31-95de-92059dde6e2e/nuctwf/std/573x0/MOTUS_pag_48.jpg",
      category: {
        label: "Furnishing advice",
        href: "/ww/magazine/furnishing-advice",
      },
    },
    {
      id: "19217",
      title: "BoxLife cabinets to furnish the bedroom",
      abstract: "Wardrobe cabinets, containers and concealed bed",
      href: "/ww/boxlife-cabinets-to-furnish-the-bedroom",
      image:
        "https://scavolini-cdn.thron.com/delivery/public/image/scavolini/02dabbdf-e9eb-43fb-bb8c-c40a918fa165/nuctwf/std/573x0/BoxLife_pag_33.jpg",
      category: { label: "Furnishings", href: "/ww/magazine/furnishings" },
    },
  ] satisfies MagazineArticle[],
};
