"use client";

import { useCart } from "@/components/cart/CartProvider";

function CartIcon() {
  return (
    <svg viewBox="0 0 24 24" aria-hidden="true" focusable="false">
      <path
        d="M7 4h-2l-1 2h2l3.6 7.59-1.35 2.45a2 2 0 0 0 1.75 2.95H19v-2H10.42a.25.25 0 0 1-.22-.37L10.1 14h7.45a2 2 0 0 0 1.92-1.45L21.6 6H7.21l-.94-2Zm-1 16a2 2 0 1 0 0 4 2 2 0 0 0 0-4Zm10 0a2 2 0 1 0 .001 3.999A2 2 0 0 0 16 20Z"
        fill="currentColor"
      />
    </svg>
  );
}

export function FloatingCartWidget() {
  const { itemCount, hydrated, openDrawer } = useCart();

  if (!hydrated || itemCount === 0) return null;

  return (
    <button
      type="button"
      className="mk-floating-contact__btn mk-floating-contact__btn--cart"
      aria-label={`Open cart with ${itemCount} item${itemCount === 1 ? "" : "s"}`}
      title="View cart"
      onClick={openDrawer}
    >
      <CartIcon />
      <span className="mk-floating-contact__badge" aria-hidden="true">
        {itemCount > 99 ? "99+" : itemCount}
      </span>
    </button>
  );
}
