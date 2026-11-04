export type LeadTabId =
  | "customize-orders"
  | "appointments"
  | "catalogue-requests"
  | "product-orders";

export type CustomizeOrderStatus =
  | "new"
  | "contacted"
  | "quoted"
  | "won"
  | "lost"
  | "closed";

export type AppointmentStatus =
  | "new"
  | "contacted"
  | "scheduled"
  | "completed"
  | "cancelled";

export type CatalogueRequestStatus = "new" | "contacted" | "sent" | "closed";

export type ProductOrderStatus =
  | "new"
  | "contacted"
  | "confirmed"
  | "fulfilled"
  | "cancelled";

export type ProductOrderLineItem = {
  productId: string;
  productTitle: string;
  serviceSlug: string;
  categoryLabel?: string;
  image?: string;
  price?: number | null;
  quantity: number;
  color?: string;
  size?: string;
  pieces?: string;
};

export type ProductOrderSubmission = {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  showroom: string;
  message: string;
  orderType: "buy_now" | "cart_checkout";
  items: ProductOrderLineItem[];
  sourcePath: string;
  status: ProductOrderStatus;
  adminNotes: string;
  createdAt: string;
  updatedAt: string;
};

export type CustomizeOrderSubmission = {
  id: string;
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
  sourcePath: string;
  status: CustomizeOrderStatus;
  adminNotes: string;
  createdAt: string;
  updatedAt: string;
};

export type AppointmentSubmission = {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  showroom: string;
  service: string;
  preferredDate: string;
  message: string;
  sourcePath: string;
  status: AppointmentStatus;
  adminNotes: string;
  createdAt: string;
  updatedAt: string;
};

export type CatalogueRequestSubmission = {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  showroom: string;
  catalogueType: string;
  deliveryAddress: string;
  message: string;
  sourcePath: string;
  status: CatalogueRequestStatus;
  adminNotes: string;
  createdAt: string;
  updatedAt: string;
};

export type LeadsSummary = {
  customizeOrders: { total: number; open: number; today: number };
  appointments: { total: number; open: number; today: number };
  catalogueRequests: { total: number; open: number; today: number };
  productOrders: { total: number; open: number; today: number };
};

export const LEAD_TABS: Array<{ id: LeadTabId; label: string }> = [
  { id: "customize-orders", label: "Customization orders" },
  { id: "appointments", label: "Appointments" },
  { id: "catalogue-requests", label: "Catalogue requests" },
  { id: "product-orders", label: "Product orders" },
];

export const CUSTOMIZE_STATUS_LABELS: Record<CustomizeOrderStatus, string> = {
  new: "New",
  contacted: "Contacted",
  quoted: "Quoted",
  won: "Won",
  lost: "Lost",
  closed: "Closed",
};

export const APPOINTMENT_STATUS_LABELS: Record<AppointmentStatus, string> = {
  new: "New",
  contacted: "Contacted",
  scheduled: "Scheduled",
  completed: "Completed",
  cancelled: "Cancelled",
};

export const CATALOGUE_STATUS_LABELS: Record<CatalogueRequestStatus, string> = {
  new: "New",
  contacted: "Contacted",
  sent: "Sent",
  closed: "Closed",
};

export const PRODUCT_ORDER_STATUS_LABELS: Record<ProductOrderStatus, string> = {
  new: "New",
  contacted: "Contacted",
  confirmed: "Confirmed",
  fulfilled: "Fulfilled",
  cancelled: "Cancelled",
};

export const PRODUCT_ORDER_TYPE_LABELS = {
  buy_now: "Buy now",
  cart_checkout: "Cart checkout",
} as const;

const BUDGET_LABELS: Record<string, string> = {
  "under-500k": "Under Rs 500,000",
  "500k-1.5m": "Rs 500,000 – 1,500,000",
  "1.5m-3m": "Rs 1,500,000 – 3,000,000",
  "3m-plus": "Above Rs 3,000,000",
  flexible: "Flexible / not sure yet",
};

export function formatBudgetRange(value: string): string {
  if (!value) return "—";
  return BUDGET_LABELS[value] ?? value;
}

export function formatShowroom(value: string, showrooms: Record<string, string>): string {
  if (!value) return "—";
  return showrooms[value] ?? value;
}

export function formatCatalogueType(value: string): string {
  const labels: Record<string, string> = {
    general: "General catalogue",
    kitchens: "Kitchens",
    furniture: "Furniture",
    "marble-tiles": "Marble & tiles",
    lights: "Lighting",
    woodwork: "Woodwork",
  };
  if (!value) return "—";
  return labels[value] ?? value;
}

export function customerName(firstName: string, lastName: string): string {
  return `${firstName} ${lastName}`.trim();
}

export function formatLeadDate(value: string): string {
  return new Intl.DateTimeFormat("en-GB", {
    day: "numeric",
    month: "short",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  }).format(new Date(value));
}

export function formatProductOrderSummary(items: ProductOrderLineItem[]): string {
  if (items.length === 0) return "—";
  const first = items[0];
  const suffix = items.length > 1 ? ` +${items.length - 1} more` : "";
  return `${first.quantity}× ${first.productTitle}${suffix}`;
}
