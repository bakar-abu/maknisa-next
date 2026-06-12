import { storesContent } from "./company-pages";
import { CUSTOMIZE_ORDER_HREF } from "./routes";
import { site } from "./site";

export { CUSTOMIZE_ORDER_HREF };

export type CustomizeFieldType = "select" | "text" | "textarea" | "number";

export type CustomizeFieldOption = {
  value: string;
  label: string;
};

export type CustomizeField = {
  id: string;
  label: string;
  type: CustomizeFieldType;
  required?: boolean;
  placeholder?: string;
  options?: CustomizeFieldOption[];
};

export type CustomizeServiceOption = {
  slug: string;
  label: string;
  configKey: string;
  description: string;
};

export type CustomizeOrderFormData = {
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  service: string;
  showroom: string;
  category: string;
  product: string;
  budgetRange: string;
  message: string;
  details: Record<string, string>;
};

const BUDGET_OPTIONS: CustomizeFieldOption[] = [
  { value: "", label: "Select a budget range" },
  { value: "under-500k", label: "Under Rs 500,000" },
  { value: "500k-1.5m", label: "Rs 500,000 – 1,500,000" },
  { value: "1.5m-3m", label: "Rs 1,500,000 – 3,000,000" },
  { value: "3m-plus", label: "Above Rs 3,000,000" },
  { value: "flexible", label: "Flexible / not sure yet" },
];

const TIMELINE_OPTIONS: CustomizeFieldOption[] = [
  { value: "", label: "Select timeline" },
  { value: "asap", label: "As soon as possible" },
  { value: "1-3-months", label: "1 – 3 months" },
  { value: "3-6-months", label: "3 – 6 months" },
  { value: "planning", label: "Still planning" },
];

export const customizeOrderShowrooms = storesContent.map((store) => ({
  value: store.id,
  label: store.city,
}));

export const customizeOrderServices: CustomizeServiceOption[] = [
  {
    slug: "Kitchens",
    label: "Kitchens",
    configKey: "kitchens",
    description: "Layout, cabinetry, worktops, and finishes tailored to your kitchen.",
  },
  {
    slug: "Marbels-Tiles",
    label: "Marble & Tiles",
    configKey: "marble-tiles",
    description: "Surfaces for floors, walls, kitchens, and bathrooms.",
  },
  {
    slug: "woodwork",
    label: "Woodwork",
    configKey: "woodwork",
    description: "Bespoke wardrobes, paneling, doors, and joinery.",
  },
  {
    slug: "interior-design",
    label: "Interior Design",
    configKey: "interior-design",
    description: "Room-by-room or full-home design direction.",
  },
  {
    slug: "furniture",
    label: "Furniture",
    configKey: "furniture",
    description: "Custom seating, tables, storage, and bedroom pieces.",
  },
  {
    slug: "Lights",
    label: "Lights",
    configKey: "lights",
    description: "Pendants, chandeliers, wall, floor, and table lighting.",
  },
];

export const customizeOrderContent = {
  title: "Customize your order",
  metaDescription: `Request a tailored ${site.name} quote — tell us about your project and our team will follow up with options for your space.`,
  intro:
    "Choose your service and share your requirements. Fields update based on the type of project so we can prepare the right consultation for you.",
  successTitle: "Thank you — your customization request was sent",
  successMessage:
    "Our team will review your details and contact you with next steps for your project.",
};

export const customizeServiceFields: Record<string, CustomizeField[]> = {
  kitchens: [
    {
      id: "kitchenStyle",
      label: "Kitchen style",
      type: "select",
      required: true,
      options: [
        { value: "", label: "Select a style" },
        { value: "modern", label: "Modern" },
        { value: "spanish", label: "Spanish" },
        { value: "classic", label: "Classic" },
        { value: "semi-classic", label: "Semi Classic" },
        { value: "italian", label: "Italian" },
      ],
    },
    {
      id: "layout",
      label: "Preferred layout",
      type: "select",
      required: true,
      options: [
        { value: "", label: "Select layout" },
        { value: "l-shape", label: "L-shaped" },
        { value: "u-shape", label: "U-shaped" },
        { value: "galley", label: "Galley" },
        { value: "island", label: "Island" },
        { value: "peninsula", label: "Peninsula" },
      ],
    },
    {
      id: "countertop",
      label: "Worktop material",
      type: "select",
      options: [
        { value: "", label: "Select material" },
        { value: "quartz", label: "Quartz" },
        { value: "granite", label: "Granite" },
        { value: "marble", label: "Marble" },
        { value: "porcelain", label: "Porcelain stoneware" },
      ],
    },
    {
      id: "cabinetFinish",
      label: "Cabinet finish",
      type: "select",
      options: [
        { value: "", label: "Select finish" },
        { value: "matte", label: "Matte" },
        { value: "gloss", label: "Gloss" },
        { value: "wood-veneer", label: "Wood veneer" },
        { value: "lacquer", label: "Lacquer" },
      ],
    },
    {
      id: "roomSize",
      label: "Approximate kitchen size",
      type: "text",
      placeholder: "e.g. 12 ft main run, island 6 ft",
    },
    {
      id: "timeline",
      label: "Project timeline",
      type: "select",
      options: TIMELINE_OPTIONS,
    },
  ],
  "marble-tiles": [
    {
      id: "application",
      label: "Application area",
      type: "select",
      required: true,
      options: [
        { value: "", label: "Select application" },
        { value: "floor", label: "Floor" },
        { value: "wall", label: "Wall" },
        { value: "kitchen-worktop", label: "Kitchen worktop" },
        { value: "bathroom", label: "Bathroom" },
        { value: "outdoor", label: "Outdoor" },
      ],
    },
    {
      id: "material",
      label: "Material type",
      type: "select",
      required: true,
      options: [
        { value: "", label: "Select material" },
        { value: "marble", label: "Marble" },
        { value: "porcelain", label: "Porcelain" },
        { value: "ceramic", label: "Ceramic" },
        { value: "natural-stone", label: "Natural stone" },
      ],
    },
    {
      id: "finish",
      label: "Surface finish",
      type: "select",
      options: [
        { value: "", label: "Select finish" },
        { value: "polished", label: "Polished" },
        { value: "matte", label: "Matte" },
        { value: "textured", label: "Textured" },
      ],
    },
    {
      id: "areaSize",
      label: "Approximate area",
      type: "text",
      placeholder: "e.g. 45 sqm floor, 18 sqm walls",
    },
    {
      id: "pattern",
      label: "Pattern preference",
      type: "select",
      options: [
        { value: "", label: "Select pattern" },
        { value: "single-tone", label: "Single tone" },
        { value: "marble-effect", label: "Marble effect" },
        { value: "geometric", label: "Geometric" },
        { value: "custom", label: "Custom layout" },
      ],
    },
  ],
  woodwork: [
    {
      id: "projectType",
      label: "Woodwork type",
      type: "select",
      required: true,
      options: [
        { value: "", label: "Select type" },
        { value: "wardrobe", label: "Wardrobe" },
        { value: "media-wall", label: "Media wall" },
        { value: "doors", label: "Doors" },
        { value: "paneling", label: "Paneling" },
        { value: "custom-joinery", label: "Custom joinery" },
      ],
    },
    {
      id: "woodFinish",
      label: "Wood / finish",
      type: "select",
      options: [
        { value: "", label: "Select finish" },
        { value: "oak", label: "Oak" },
        { value: "walnut", label: "Walnut" },
        { value: "painted", label: "Painted" },
        { value: "veneer", label: "Veneer" },
      ],
    },
    {
      id: "room",
      label: "Room / area",
      type: "select",
      options: [
        { value: "", label: "Select room" },
        { value: "living", label: "Living room" },
        { value: "bedroom", label: "Bedroom" },
        { value: "kitchen", label: "Kitchen" },
        { value: "office", label: "Office" },
        { value: "other", label: "Other" },
      ],
    },
    {
      id: "dimensions",
      label: "Dimensions or scope",
      type: "text",
      placeholder: "e.g. wall-to-wall wardrobe, 3 m wide",
    },
  ],
  "interior-design": [
    {
      id: "scope",
      label: "Project scope",
      type: "select",
      required: true,
      options: [
        { value: "", label: "Select scope" },
        { value: "living-room", label: "Living room" },
        { value: "bedroom", label: "Bedroom" },
        { value: "kitchen", label: "Kitchen" },
        { value: "bathroom", label: "Bathroom" },
        { value: "full-home", label: "Full home" },
      ],
    },
    {
      id: "style",
      label: "Preferred style",
      type: "select",
      required: true,
      options: [
        { value: "", label: "Select style" },
        { value: "modern", label: "Modern" },
        { value: "contemporary", label: "Contemporary" },
        { value: "classic", label: "Classic" },
        { value: "minimal", label: "Minimal" },
        { value: "eclectic", label: "Eclectic" },
      ],
    },
    {
      id: "propertyType",
      label: "Property type",
      type: "select",
      options: [
        { value: "", label: "Select property" },
        { value: "apartment", label: "Apartment" },
        { value: "house", label: "House" },
        { value: "commercial", label: "Commercial" },
      ],
    },
    {
      id: "timeline",
      label: "Project timeline",
      type: "select",
      options: TIMELINE_OPTIONS,
    },
  ],
  furniture: [
    {
      id: "category",
      label: "Furniture category",
      type: "select",
      required: true,
      options: [
        { value: "", label: "Select category" },
        { value: "sofas", label: "Sofas" },
        { value: "chairs", label: "Chairs" },
        { value: "tables", label: "Tables" },
        { value: "storage", label: "Storage" },
        { value: "bedroom", label: "Bedroom" },
      ],
    },
    {
      id: "material",
      label: "Material preference",
      type: "select",
      options: [
        { value: "", label: "Select material" },
        { value: "fabric", label: "Fabric" },
        { value: "leather", label: "Leather" },
        { value: "wood", label: "Wood" },
        { value: "metal", label: "Metal" },
        { value: "mixed", label: "Mixed materials" },
      ],
    },
    {
      id: "quantity",
      label: "Quantity",
      type: "number",
      placeholder: "1",
    },
    {
      id: "dimensions",
      label: "Size requirements",
      type: "text",
      placeholder: "e.g. sofa 220 cm, dining table for 6",
    },
  ],
  lights: [
    {
      id: "fixtureType",
      label: "Fixture type",
      type: "select",
      required: true,
      options: [
        { value: "", label: "Select type" },
        { value: "pendants", label: "Pendants" },
        { value: "chandeliers", label: "Chandeliers" },
        { value: "wall-lights", label: "Wall lights" },
        { value: "floor-lamps", label: "Floor lamps" },
        { value: "table-lamps", label: "Table lamps" },
      ],
    },
    {
      id: "room",
      label: "Room / area",
      type: "select",
      options: [
        { value: "", label: "Select room" },
        { value: "living", label: "Living" },
        { value: "dining", label: "Dining" },
        { value: "bedroom", label: "Bedroom" },
        { value: "kitchen", label: "Kitchen" },
        { value: "bathroom", label: "Bathroom" },
        { value: "outdoor", label: "Outdoor" },
      ],
    },
    {
      id: "finish",
      label: "Finish",
      type: "select",
      options: [
        { value: "", label: "Select finish" },
        { value: "brass", label: "Brass" },
        { value: "black", label: "Black" },
        { value: "chrome", label: "Chrome" },
        { value: "white", label: "White" },
      ],
    },
    {
      id: "quantity",
      label: "Quantity",
      type: "number",
      placeholder: "1",
    },
  ],
};

export const customizeBudgetField: CustomizeField = {
  id: "budgetRange",
  label: "Estimated budget",
  type: "select",
  options: BUDGET_OPTIONS,
};

export function customizeOrderHref(options?: {
  service?: string;
  category?: string;
  product?: string;
}): string {
  const params = new URLSearchParams();
  if (options?.service) params.set("service", options.service);
  if (options?.category) params.set("category", options.category);
  if (options?.product) params.set("product", options.product);
  const query = params.toString();
  return query ? `${CUSTOMIZE_ORDER_HREF}?${query}` : CUSTOMIZE_ORDER_HREF;
}

export function resolveCustomizeService(slug: string): CustomizeServiceOption | undefined {
  const normalized = slug.trim().toLowerCase();
  return customizeOrderServices.find(
    (service) => service.slug.toLowerCase() === normalized,
  );
}

export function getCustomizeFieldsForService(serviceSlug: string): CustomizeField[] {
  const service = resolveCustomizeService(serviceSlug);
  if (!service) return [];
  return customizeServiceFields[service.configKey] ?? [];
}

export function emptyCustomizeOrderForm(): CustomizeOrderFormData {
  return {
    firstName: "",
    lastName: "",
    email: "",
    phone: "",
    service: "",
    showroom: "",
    category: "",
    product: "",
    budgetRange: "",
    message: "",
    details: {},
  };
}

export function emptyDetailsForService(serviceSlug: string): Record<string, string> {
  const fields = getCustomizeFieldsForService(serviceSlug);
  return Object.fromEntries(fields.map((field) => [field.id, ""]));
}
