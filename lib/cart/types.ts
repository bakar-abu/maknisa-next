export type CartItem = {
  lineId: string;
  productId: string;
  productTitle: string;
  serviceSlug: string;
  categoryLabel: string;
  image: string;
  href: string;
  price: number | null;
  quantity: number;
  color?: string;
  size?: string;
  pieces?: string;
};

export type CartItemInput = Omit<CartItem, "lineId" | "quantity"> & {
  quantity?: number;
};

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

export type ProductOrderType = "buy_now" | "cart_checkout";

export type ProductOrderFormData = {
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  showroom: string;
  message: string;
};

export function buildCartLineId(input: {
  productId: string;
  color?: string;
  size?: string;
  pieces?: string;
}): string {
  return [input.productId, input.color ?? "", input.size ?? "", input.pieces ?? ""].join("::");
}

export function cartItemToOrderLine(item: CartItem): ProductOrderLineItem {
  return {
    productId: item.productId,
    productTitle: item.productTitle,
    serviceSlug: item.serviceSlug,
    categoryLabel: item.categoryLabel,
    image: item.image,
    price: item.price,
    quantity: item.quantity,
    color: item.color,
    size: item.size,
    pieces: item.pieces,
  };
}
