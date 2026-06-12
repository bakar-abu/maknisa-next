"use client";

import { useEffect } from "react";

type CatalogOptionModalProps = {
  open: boolean;
  title: string;
  onClose: () => void;
  children: React.ReactNode;
};

export function CatalogOptionModal({
  open,
  title,
  onClose,
  children,
}: CatalogOptionModalProps) {
  useEffect(() => {
    if (!open) return;
    const onKey = (event: KeyboardEvent) => {
      if (event.key === "Escape") onClose();
    };
    document.body.classList.add("mk-catalog-pdp-modal-open");
    window.addEventListener("keydown", onKey);
    return () => {
      document.body.classList.remove("mk-catalog-pdp-modal-open");
      window.removeEventListener("keydown", onKey);
    };
  }, [open, onClose]);

  if (!open) return null;

  return (
    <div className="mk-catalog-pdp-modal" role="dialog" aria-modal="true" aria-labelledby="catalog-option-title">
      <button
        type="button"
        className="mk-catalog-pdp-modal__backdrop"
        aria-label="Close"
        onClick={onClose}
      />
      <div className="mk-catalog-pdp-modal__panel">
        <header className="mk-catalog-pdp-modal__head">
          <h2 id="catalog-option-title" className="mk-catalog-pdp-modal__title">
            {title}
          </h2>
          <button type="button" className="mk-catalog-pdp-modal__close" onClick={onClose} aria-label="Close">
            ×
          </button>
        </header>
        <div className="mk-catalog-pdp-modal__body">{children}</div>
      </div>
    </div>
  );
}
