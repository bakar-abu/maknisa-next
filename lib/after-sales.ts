import { site } from "./site";

const kitchenImage =
  "https://scavolini-cdn.thron.com/delivery/public/image/scavolini/5a75a686-eea5-4650-80f9-a32a51cee68a/nuctwf/std/635x0/no-problem-10.jpg";
const bathroomImage =
  "https://scavolini-cdn.thron.com/delivery/public/image/scavolini/9b49c185-76eb-40ec-b4f4-c4e3d73a8e2e/nuctwf/std/635x0/no-problem-bathroom-5.jpg";

export type WarrantyFaqItem = { title: string; body: string };

export type WarrantyColumn = { title: string; body: string };

export type WarrantyBlock = {
  anchorId: string;
  align: "left" | "right";
  bgLight?: boolean;
  image: string;
  title: string;
  categories: string[];
  intro: string;
  peaceTitle: string;
  columns: WarrantyColumn[];
  faq: WarrantyFaqItem[];
  accordionId: string;
};

export const afterSalesContent = {
  title: "After-Sales Services",
  metaDescription:
    "Dedicated after-sales support, warranties, and customer care for Maknisa kitchens, living, bathrooms, and furniture.",
  breadcrumbs: [
    { label: "Home", href: "/" },
    { label: "After-Sales Services" },
  ] as const,
  intro: `Buying a ${site.name} product always comes with dedicated guaranteed support that protects your kitchen, living space, bathroom, and peace of mind for years to come.`,
  customerCareLabel: "customer care page",
  customerCareHref: "/ww/company/contacts",
  registerBanner: {
    title: `Have you already purchased a ${site.name} product? Register it!`,
    body: `Enter your details, complete the form, and stay connected with ${site.name} for product care, tips, and after-sales assistance for the most important rooms in your home.`,
    cta: { label: "Register your product", href: "/ww/register-your-product" },
  },
  anchorQuestion: "What product did you buy / do you want to buy?",
  anchors: [
    { label: "Kitchens", anchorId: "kitchen-living" },
    { label: "Living", anchorId: "kitchen-living" },
    { label: "Multi-functional modules", anchorId: "kitchen-living" },
    { label: "Bathrooms", anchorId: "bathrooms" },
  ],
  warranties: [
    {
      anchorId: "kitchen-living",
      align: "right",
      bgLight: true,
      image: kitchenImage,
      title: `${site.name} No Problem 5`,
      categories: ["Kitchens", "Living", "Multi-functional modules"],
      intro: `Welcome to ${site.name} No Problem — extended warranty support for kitchens, living areas, and multi-functional modules. Share your feedback and suggestions so we can help you get the most from your home. Contact our team or your dealer to register your purchase and activate support.`,
      peaceTitle: "5 years of peace of mind:",
      columns: [
        {
          title: "Product quality",
          body: `For ${site.name}, quality means robust, reliable materials and design that lasts, so the value of your investment is reflected in everyday use. Choosing a trusted brand means certainty in materials, finishes, and installation support.`,
        },
        {
          title: "Quality control",
          body: `${site.name} works with qualified suppliers and checks products before delivery. Where needed, materials and fittings are tested to meet performance and safety expectations for residential use.`,
        },
        {
          title: "The warranty",
          body: `${site.name} guarantees modular kitchen and living-room units against manufacturing defects reported within the warranty period from delivery to the authorised dealer, subject to the terms below.`,
        },
      ],
      faq: [
        {
          title: "Who can make use of the warranty:",
          body: "This warranty is provided solely for the consumer who first purchases the product and may not be transferred, even if the kitchen or living unit is sold to a third party.",
        },
        {
          title: "What is excluded from the warranty:",
          body: "Excluded are items that are not modular kitchen or living units (e.g. electrical appliances, TVs, mixers) and any parts covered by the manufacturer's own warranty. Disputes for excluded items must be addressed to the relevant manufacturer.",
        },
        {
          title: "When the warranty applies:",
          body: "The warranty applies when: (a) the product is used domestically, not professionally, and installed in a suitable habitable location; (b) installation was carried out by qualified personnel; (c) maintenance follows the product instruction booklet; (d) the product has not been neglected, misused, or tampered with; (e) the defect is not due to normal wear, impact damage, or force majeure.",
        },
        {
          title: "What solutions the warranty envisages:",
          body: "If a manufacturing defect is confirmed, we will supply a replacement element or arrange repair under warranty. Other costs (call-out, labour, shipping beyond the part) remain the consumer's responsibility and are paid to the dealer carrying out the work.",
        },
        {
          title: "How to activate the warranty:",
          body: "Contact the dealer where you made your purchase and provide your warranty code from delivery documentation. Report any defect within 30 days of noticing it.",
        },
        {
          title: "Law and court:",
          body: "Warranty terms are governed by applicable local law. Disputes are handled through the agreed jurisdiction in your purchase contract.",
        },
      ],
      accordionId: "sn_accordion_kitchen_faq",
    },
    {
      anchorId: "bathrooms",
      align: "left",
      image: bathroomImage,
      title: `${site.name} No Problem Bathrooms — 5 years`,
      categories: ["Bathrooms"],
      intro: `Welcome to ${site.name} No Problem Bathrooms — extended warranty support for bathroom furnishings. We are here to help you protect and enjoy your bathroom project with confidence.`,
      peaceTitle: "",
      columns: [],
      faq: [
        {
          title: "What does the warranty cover:",
          body: `${site.name} guarantees bathroom furnishings against manufacturing defects appearing within the warranty period from delivery to the authorised dealer. After that period, the warranty expires.`,
        },
        {
          title: "Who can make use of the warranty:",
          body: "The warranty applies only to the consumer who first purchased the bathroom furnishings and is not transferable.",
        },
        {
          title: "What is excluded from the warranty:",
          body: "Fixed bathroom fittings (sinks, WCs, baths, mixers, lights) are excluded, as are items already covered by another manufacturer's warranty.",
        },
        {
          title: "When the warranty applies:",
          body: "The bathroom must be used domestically, installed correctly by qualified personnel, maintained per the instruction booklet, and free from misuse, tampering, or damage from wear and exceptional events.",
        },
        {
          title: "What solutions the warranty envisages:",
          body: "If a manufacturing defect is confirmed, we will supply replacement parts or arrange repair. Labour and call-out costs are paid to the dealer performing the intervention.",
        },
        {
          title: "How to activate the warranty:",
          body: "Contact your dealer with the warranty code issued at shipment. Report defects within 30 days of discovery.",
        },
        {
          title: "Law and court:",
          body: "Warranty terms are governed by applicable local law and the jurisdiction stated in your purchase agreement.",
        },
      ],
      accordionId: "sn_accordion_bathroom_faq",
    },
  ] satisfies WarrantyBlock[],
};
