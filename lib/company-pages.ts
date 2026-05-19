import { site } from "./site";

export const COMPANY_SLUGS = [
  "company",
  "communication",
  "company-policy",
  "quality",
  "contacts",
  "maknisa-store",
  "historic-brands",
] as const;

export type CompanySlug = (typeof COMPANY_SLUGS)[number];

export type Breadcrumb = { label: string; href?: string };

export type GridAltRow = {
  title: string;
  body: string;
  image: string;
  align: "left" | "right";
  cta?: { label: string; href: string };
};

export type AccordionItem = { title: string; body: string };

export type StoreLocation = {
  id: string;
  city: string;
  title: string;
  address: string;
  phone?: string;
  email?: string;
  image: string;
};

export type PressItem = {
  year: string;
  title: string;
  excerpt: string;
  image?: string;
};

export type CompanyPageConfig = {
  slug: CompanySlug;
  title: string;
  metaDescription: string;
  breadcrumbs: Breadcrumb[];
  type:
    | "about"
    | "communication"
    | "policy"
    | "quality"
    | "contacts"
    | "stores"
    | "historic";
};

const media = {
  aboutHero: "https://www.scavolini.com/media/immagini/10535_t_bg_azienda.jpg",
  commBanner:
    "https://scavolini-cdn.thron.com/delivery/public/image/scavolini/829e30ed-94ba-4b01-b6df-95e9139e3c4a/nuctwf/std/1280x0/comunicazione_banner.jpg",
  qualityHero:
    "https://scavolini-cdn.thron.com/delivery/public/image/scavolini/2800ba9b-ba21-4e54-905f-b9046cf6b6b0/nuctwf/std/1280x0/Qualita.jpg",
  store1:
    "https://scavolini-cdn.thron.com/delivery/public/image/scavolini/5989f123-c44d-41f4-9aaf-fe6aa2c1a0a9/nuctwf/std/900x0/MANTOVA_MG_9545.jpg",
  historic: [
    "https://www.scavolini.com/media/immagini/10047_z_box-slider-01.jpg",
    "https://www.scavolini.com/media/immagini/10048_z_box-slider-02.jpg",
    "https://www.scavolini.com/media/immagini/10049_z_box-slider-03.jpg",
    "https://www.scavolini.com/media/immagini/10050_z_box-slider-04.jpg",
    "https://www.scavolini.com/media/immagini/10051_z_box-slider-05.jpg",
    "https://www.scavolini.com/media/immagini/10052_z_box-slider-06.jpg",
  ],
  gridWater:
    "https://scavolini-cdn.thron.com/delivery/public/image/scavolini/ef808838-985e-4a29-b483-6a327c966b2c/nuctwf/std/800x0/_0000s_0027_acqua.jpg",
  gridProduct:
    "https://scavolini-cdn.thron.com/delivery/public/image/scavolini/0929234f-ff62-4f8a-b86d-b6afe6bc6410/nuctwf/std/800x0/controlli_e_prove.jpg",
  gridSustain:
    "https://scavolini-cdn.thron.com/delivery/public/image/scavolini/09e545fd-d3b7-4c5a-801e-d6a1e0739aaa/nuctwf/std/800x0/sostebibilita_prodotto.jpg",
};

export const companyPages: Record<CompanySlug, CompanyPageConfig> = {
  company: {
    slug: "company",
    title: "About us",
    metaDescription:
      "Discover Maknisa — Pakistan's leading furniture store for kitchens, living, tiles, lights, and doors.",
    breadcrumbs: [{ label: "Home", href: "/" }, { label: "About us" }],
    type: "about",
  },
  communication: {
    slug: "communication",
    title: "Communication",
    metaDescription:
      "Maknisa brand communication, campaigns, and stories from our showrooms and collections.",
    breadcrumbs: [{ label: "Home", href: "/" }, { label: "Communication" }],
    type: "communication",
  },
  "company-policy": {
    slug: "company-policy",
    title: "Company Policy",
    metaDescription: "Maknisa company values, quality commitments, and customer policy.",
    breadcrumbs: [{ label: "Home", href: "/" }, { label: "Company Policy" }],
    type: "policy",
  },
  quality: {
    slug: "quality",
    title: "Quality and Sustainability",
    metaDescription:
      "Maknisa commitment to product quality, durable materials, and responsible furnishing.",
    breadcrumbs: [
      { label: "Home", href: "/" },
      { label: "Quality and Sustainability" },
    ],
    type: "quality",
  },
  contacts: {
    slug: "contacts",
    title: "Contact us",
    metaDescription: `Contact ${site.name}: phone, email, and showroom address in Lahore.`,
    breadcrumbs: [{ label: "Home", href: "/" }, { label: "Contact us" }],
    type: "contacts",
  },
  "maknisa-store": {
    slug: "maknisa-store",
    title: "Maknisa Stores",
    metaDescription:
      "Visit Maknisa showrooms in Lahore, Karachi, Faisalabad, Rawalpindi, and Islamabad.",
    breadcrumbs: [{ label: "Home", href: "/" }, { label: "Maknisa Stores" }],
    type: "stores",
  },
  "historic-brands": {
    slug: "historic-brands",
    title: "Historic Brands",
    metaDescription:
      "Signature Maknisa collections and product lines trusted across Pakistan.",
    breadcrumbs: [{ label: "Home", href: "/" }, { label: "Historic Brands" }],
    type: "historic",
  },
};

export const aboutContent = {
  heroSubtitle: "Pakistan's No 1 Furniture store",
  verticalLabel: "Us",
  paragraphs: [
    `We provide much more than beautiful home furniture and decorations. At ${site.name}, you will find inspiration, expert guidance, and everything you need to bring your interior projects to life — from living and dining pieces to tiles, lights, doors, and kitchen solutions.`,
    `Our expert team puts professional and creative effort into every project. Whatever the scope, we are committed to practical solutions and outstanding results — the same approach behind our tagline: bringing a smile to your face.`,
    `The newest challenges in architecture and design inspire us to offer products capable of shaping space with style. We modernise classic ideas so finished interiors feel both current and timeless.`,
  ],
  pillars: [
    {
      title: "Our Mission",
      body: "Meticulously curated collections rooted in quality craftsmanship. A brand that blends contemporary design with reliable materials — from furniture and décor to tiles, lighting, and kitchen fittings.",
    },
    {
      title: "Our Story",
      body: "As we continue exceeding the expectations of customers, retailers, designers, and builders, we remain the go-to source for chic, dependable furnishings across Pakistan.",
    },
    {
      title: "Design & Showrooms",
      body: "Visit our display showrooms in Karachi, Lahore, Faisalabad, Rawalpindi, and Islamabad. Our skilled staff listen to your ideas, shape your vision, and help you select the right products for every room.",
    },
  ],
  heroImage: media.aboutHero,
};

export const communicationContent = {
  verticalLabel: "Communication",
  subtitle: "Advertising, promotion and information",
  intro: `For ${site.name}, communication is more than promotion: every catalogue, campaign, and showroom experience is a chapter in a story we write with passion. A story that connects with families across Pakistan who trust us for furniture, tiles, lights, and complete home solutions.`,
  bannerImage: media.commBanner,
  pressTitle: "Campaigns & highlights",
  pressIntro: `From our Bubble Collection to kitchen and living ranges, we share projects that reflect how ${site.name} furnishes real homes — with quality products and attentive service.`,
  pressItems: [
    {
      year: "2026",
      title: "Style With Maknisa",
      excerpt:
        "Express yourself and create memories — our flagship message celebrating personalised interiors and showroom design support.",
    },
    {
      year: "2025",
      title: "We Love How We Do It",
      excerpt:
        "A campaign focused on real projects: practical solutions, beautiful outcomes, and the teams behind every installation.",
    },
    {
      year: "2024",
      title: "Maknisa Creates Magic",
      excerpt:
        "Highlighting innovative materials and collections — from cloud beds and bubble sofas to tiles, lighting, and door systems.",
    },
    {
      year: "2023",
      title: "Modern Design Living",
      excerpt:
        "Pendants, chandeliers, and coordinated room schemes — helping customers discover lighting and furniture that elevates everyday spaces.",
    },
  ] satisfies PressItem[],
  socialTitle: "Follow Maknisa",
  socialText:
    "Stay updated on new collections, showroom events, and design inspiration on our social channels.",
};

export const policyContent = {
  quote: "Satisfied customers are the real assets of an enterprise",
  quoteBody: `This is the principle on which ${site.name} has built its reputation across Pakistan. Customer satisfaction means products and services that meet expectations — with clear communication, fair pricing, and respect for your home project from first visit to final installation.`,
  valuesIntro: "Our daily commitments are based on the following values:",
  values: [
    {
      title: "Quality",
      body: "Continuously improving the reliability of furniture, tiles, lighting, and installation services.",
    },
    {
      title: "Meticulousness",
      body: "Preventing issues in measurement, delivery, and fitting through careful planning at every step.",
    },
    {
      title: "Innovation",
      body: "Researching new materials, finishes, and layouts to meet modern lifestyles in Pakistan.",
    },
    {
      title: "Responsibility",
      body: "Considering the impact of our recommendations on your budget, space, and long-term use.",
    },
    {
      title: "Ethics",
      body: "Transparent dealings with customers, suppliers, and showroom partners.",
    },
    {
      title: "Service",
      body: "After-sales support and design assistance so you feel confident in every purchase.",
    },
  ] satisfies AccordionItem[],
  aimsIntro:
    "Our standards contribute towards achieving the following goals:",
  aims: [
    "Designing and supplying beautiful, reliable, functional furnishings at competitive value",
    "Guaranteeing clear product information and honest timelines",
    "Making deliveries and installations as smooth as possible",
    "Continuously improving showroom and online customer experience",
    "Raising awareness on quality materials and proper maintenance",
    "Supporting customers with design advice for kitchens, bathrooms, and living spaces",
  ],
  closing: `The success of our approach depends on involving every team member — from showroom consultants to logistics — in delivering the ${site.name} experience.`,
};

export const qualityContent = {
  heroImage: media.qualityHero,
  heroIntro: `${site.name}'s daily commitment spans product quality, careful material selection, skilled installation, and attentive customer care — so every kitchen, bathroom, and living project meets the standards our clients expect.`,
  anchors: [
    { label: "Responsible sourcing", anchor: "responsible" },
    { label: "Product quality", anchor: "product_quality" },
    { label: "Craftsmanship", anchor: "craftsmanship" },
  ],
  greenMind: {
    title: "Responsible furnishing",
    intro: `${site.name} considers long-lasting products and thoughtful consumption a priority. Choosing durable furniture and quality tiles means less waste and better value for your home.`,
    rows: [
      {
        title: "Materials that last",
        body: "We select finishes and structures suited to daily use — from upholstered seating to kitchen fronts and bathroom units.",
        image: media.gridWater,
        align: "left" as const,
      },
      {
        title: "Efficient home solutions",
        body: "Our lighting and solar ranges help customers plan energy-conscious upgrades alongside interior design.",
        image: media.gridSustain,
        align: "right" as const,
      },
    ] satisfies GridAltRow[],
  },
  qualitySafety: {
    title: "Quality and craftsmanship",
    intro: `When advising on kitchens, bathrooms, and living rooms, ${site.name} focuses on design, strength, and safety — applying proven suppliers and installation practices.`,
    rows: [
      {
        title: "Product quality",
        body: "Reliable materials with lasting design and fair pricing — supported by showroom inspection and clear specifications.",
        image: media.gridProduct,
        align: "right" as const,
      },
      {
        title: "Expert installation",
        body: "Skilled teams coordinate fitting for kitchens, wardrobes, and built-in elements so finished spaces work as intended.",
        image: media.gridWater,
        align: "left" as const,
      },
    ] satisfies GridAltRow[],
  },
};

export const contactsContent = {
  headquarters: {
    name: site.name,
    address: site.address,
    phone: site.phone,
    email: site.email,
    emailOfficial: site.emailOfficial,
  },
  offices: [
    {
      title: `${site.name} — Lahore (Head office)`,
      city: "Lahore",
      phone: site.phone,
      email: site.email,
    },
  ],
};

export const storesContent: StoreLocation[] = [
  {
    id: "lahore",
    city: "Lahore",
    title: `${site.name} Lahore`,
    address: site.address,
    phone: site.phone,
    email: site.email,
    image: media.store1,
  },
  {
    id: "karachi",
    city: "Karachi",
    title: `${site.name} Karachi`,
    address: "Showroom — Karachi (contact head office for directions)",
    phone: site.phone,
    email: site.email,
    image: media.store1,
  },
  {
    id: "faisalabad",
    city: "Faisalabad",
    title: `${site.name} Faisalabad`,
    address: "Showroom — Faisalabad (contact head office for directions)",
    phone: site.phone,
    email: site.email,
    image: media.store1,
  },
  {
    id: "rawalpindi",
    city: "Rawalpindi",
    title: `${site.name} Rawalpindi`,
    address: "Showroom — Rawalpindi (contact head office for directions)",
    phone: site.phone,
    email: site.email,
    image: media.store1,
  },
  {
    id: "islamabad",
    city: "Islamabad",
    title: `${site.name} Islamabad`,
    address: "Showroom — Islamabad (contact head office for directions)",
    phone: site.phone,
    email: site.email,
    image: media.store1,
  },
];

export const historicContent = {
  verticalLabel: "Historic Brands",
  paragraphs: [
    `${site.name} has grown into one of Pakistan's most recognised furniture and interiors brands — trusted for kitchens, living spaces, bathrooms, tiles, lighting, and doors.`,
    `Our signature collections — including the Bubble Collection and coordinated room systems — reflect years of serving families, designers, and builders who expect Italian-inspired design adapted for local homes.`,
    `We continue investing in showrooms and product ranges so customers can experience materials in person and plan projects with confidence.`,
  ],
  sliderImages: media.historic,
};

export function getCompanyPage(slug: string): CompanyPageConfig | undefined {
  return companyPages[slug as CompanySlug];
}

export function getAllCompanySlugs(): CompanySlug[] {
  return [...COMPANY_SLUGS];
}
