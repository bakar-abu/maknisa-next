"use client";

import { useState } from "react";
import { appointmentShowrooms } from "@/lib/appointment";
import type { ProductOrderFormData, ProductOrderLineItem, ProductOrderType } from "@/lib/cart/types";
import { formatPkr } from "@/lib/format-price";

type ProductOrderModalProps = {
  open: boolean;
  items: ProductOrderLineItem[];
  orderType: ProductOrderType;
  onClose: () => void;
  onSuccess: () => void;
};

const emptyForm = (): ProductOrderFormData => ({
  firstName: "",
  lastName: "",
  email: "",
  phone: "",
  showroom: "",
  message: "",
});

export function ProductOrderModal({
  open,
  items,
  orderType,
  onClose,
  onSuccess,
}: ProductOrderModalProps) {
  const [form, setForm] = useState<ProductOrderFormData>(emptyForm);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);

  if (!open) return null;

  async function handleSubmit(event: React.FormEvent) {
    event.preventDefault();
    setSubmitting(true);
    setError(null);

    try {
      const response = await fetch("/api/product-orders", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...form,
          orderType,
          items,
        }),
      });

      const data = (await response.json().catch(() => ({}))) as {
        ok?: boolean;
        error?: string;
      };

      if (!response.ok || !data.ok) {
        throw new Error(data.error ?? "Unable to place order.");
      }

      setSuccess(true);
      if (orderType === "cart_checkout") {
        onSuccess();
      }
    } catch (submitError) {
      setError(
        submitError instanceof Error ? submitError.message : "Unable to place order.",
      );
    } finally {
      setSubmitting(false);
    }
  }

  const title = orderType === "buy_now" ? "Buy now" : "Checkout";

  function handleClose() {
    if (success) {
      setForm(emptyForm());
      setSuccess(false);
    }
    onClose();
  }

  return (
    <div className="mk-cart-modal" role="presentation">
      <button
        type="button"
        className="mk-cart-modal__backdrop"
        aria-label="Close order form"
        onClick={handleClose}
      />
      <div className="mk-cart-modal__panel" role="dialog" aria-modal="true">
        <header className="mk-cart-modal__header">
          <div>
            <p className="mk-cart-modal__eyebrow">Product order</p>
            <h2>{title}</h2>
          </div>
          <button type="button" className="mk-cart-modal__close" onClick={handleClose}>
            Close
          </button>
        </header>

        {success ? (
          <div className="mk-cart-modal__success">
            <h3>Thank you — your order has been received</h3>
            <p>Our team will contact you shortly to confirm your order.</p>
            <button
              type="button"
              className="mk-cart-modal__submit"
              onClick={handleClose}
            >
              Close
            </button>
          </div>
        ) : (
          <form className="mk-cart-modal__body" onSubmit={handleSubmit}>
            <section className="mk-cart-modal__items" aria-label="Order items">
              <h3>Order summary</h3>
              <ul>
                {items.map((item) => (
                  <li key={`${item.productId}-${item.color ?? ""}-${item.size ?? ""}-${item.pieces ?? ""}`}>
                    <div>
                      <strong>{item.productTitle}</strong>
                      <span>
                        {item.quantity} × {item.serviceSlug}
                      </span>
                      {item.color ? <span>Color: {item.color}</span> : null}
                      {item.size ? <span>Size: {item.size}</span> : null}
                      {item.pieces ? <span>Pieces: {item.pieces}</span> : null}
                    </div>
                    {item.price !== null && item.price !== undefined ? (
                      <span>{formatPkr(item.price * item.quantity)}</span>
                    ) : null}
                  </li>
                ))}
              </ul>
            </section>

            <div className="mk-cart-modal__grid">
              <label>
                <span>First name *</span>
                <input
                  required
                  value={form.firstName}
                  onChange={(event) =>
                    setForm((current) => ({ ...current, firstName: event.target.value }))
                  }
                />
              </label>
              <label>
                <span>Last name *</span>
                <input
                  required
                  value={form.lastName}
                  onChange={(event) =>
                    setForm((current) => ({ ...current, lastName: event.target.value }))
                  }
                />
              </label>
              <label>
                <span>Email *</span>
                <input
                  type="email"
                  required
                  value={form.email}
                  onChange={(event) =>
                    setForm((current) => ({ ...current, email: event.target.value }))
                  }
                />
              </label>
              <label>
                <span>Phone *</span>
                <input
                  type="tel"
                  required
                  value={form.phone}
                  onChange={(event) =>
                    setForm((current) => ({ ...current, phone: event.target.value }))
                  }
                />
              </label>
              <label className="mk-cart-modal__full">
                <span>Preferred showroom</span>
                <select
                  value={form.showroom}
                  onChange={(event) =>
                    setForm((current) => ({ ...current, showroom: event.target.value }))
                  }
                >
                  <option value="">Select a showroom</option>
                  {appointmentShowrooms.map((showroom) => (
                    <option key={showroom.value} value={showroom.value}>
                      {showroom.label}
                    </option>
                  ))}
                </select>
              </label>
              <label className="mk-cart-modal__full">
                <span>Message</span>
                <textarea
                  rows={3}
                  value={form.message}
                  onChange={(event) =>
                    setForm((current) => ({ ...current, message: event.target.value }))
                  }
                />
              </label>
            </div>

            {error ? <p className="mk-cart-modal__error">{error}</p> : null}

            <button type="submit" className="mk-cart-modal__submit" disabled={submitting}>
              {submitting ? "Submitting…" : "Place order"}
            </button>
          </form>
        )}
      </div>
    </div>
  );
}
