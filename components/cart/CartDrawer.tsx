"use client";

import Link from "next/link";
import { useCart } from "@/components/cart/CartProvider";
import { cartItemToOrderLine } from "@/lib/cart/types";
import { formatPkr } from "@/lib/format-price";

export function CartDrawer() {
  const {
    items,
    itemCount,
    drawerOpen,
    closeDrawer,
    removeItem,
    updateQuantity,
    openOrderModal,
    clearCart,
  } = useCart();

  if (!drawerOpen) return null;

  return (
    <div className="mk-cart-drawer" role="presentation">
      <button
        type="button"
        className="mk-cart-drawer__backdrop"
        aria-label="Close cart"
        onClick={closeDrawer}
      />
      <aside className="mk-cart-drawer__panel" role="dialog" aria-modal="true" aria-label="Shopping cart">
        <header className="mk-cart-drawer__header">
          <h2>Your cart</h2>
          <button type="button" className="mk-cart-drawer__close" onClick={closeDrawer}>
            Close
          </button>
        </header>

        {items.length === 0 ? (
          <div className="mk-cart-drawer__empty">
            <p>Your cart is empty.</p>
          </div>
        ) : (
          <>
            <ul className="mk-cart-drawer__list">
              {items.map((item) => (
                <li key={item.lineId} className="mk-cart-drawer__item">
                  <div className="mk-cart-drawer__item-media">
                    {item.image ? (
                      // eslint-disable-next-line @next/next/no-img-element
                      <img src={item.image} alt="" />
                    ) : null}
                  </div>
                  <div className="mk-cart-drawer__item-body">
                    <Link href={item.href} className="mk-cart-drawer__item-title" onClick={closeDrawer}>
                      {item.productTitle}
                    </Link>
                    <p className="mk-cart-drawer__item-meta">{item.categoryLabel}</p>
                    {item.color ? (
                      <p className="mk-cart-drawer__item-option">Color: {item.color}</p>
                    ) : null}
                    {item.size ? (
                      <p className="mk-cart-drawer__item-option">Size: {item.size}</p>
                    ) : null}
                    {item.pieces ? (
                      <p className="mk-cart-drawer__item-option">Pieces: {item.pieces}</p>
                    ) : null}
                    {item.price !== null ? (
                      <p className="mk-cart-drawer__item-price">{formatPkr(item.price)}</p>
                    ) : null}
                    <div className="mk-cart-drawer__qty">
                      <button
                        type="button"
                        aria-label="Decrease quantity"
                        onClick={() => updateQuantity(item.lineId, item.quantity - 1)}
                      >
                        −
                      </button>
                      <span>{item.quantity}</span>
                      <button
                        type="button"
                        aria-label="Increase quantity"
                        onClick={() => updateQuantity(item.lineId, item.quantity + 1)}
                      >
                        +
                      </button>
                    </div>
                    <button
                      type="button"
                      className="mk-cart-drawer__remove"
                      onClick={() => removeItem(item.lineId)}
                    >
                      Remove
                    </button>
                  </div>
                </li>
              ))}
            </ul>

            <footer className="mk-cart-drawer__footer">
              <p className="mk-cart-drawer__count">
                {itemCount} item{itemCount === 1 ? "" : "s"}
              </p>
              <button
                type="button"
                className="mk-cart-drawer__checkout"
                onClick={() =>
                  openOrderModal({
                    items: items.map(cartItemToOrderLine),
                    orderType: "cart_checkout",
                    onSuccess: clearCart,
                  })
                }
              >
                Checkout
              </button>
            </footer>
          </>
        )}
      </aside>
    </div>
  );
}
