"use client";

import { useEffect, useState } from "react";
import type {
  CatalogProductAdminRecord,
  CatalogServiceCategoryRecord,
} from "@/lib/cms/catalog-admin";

type CatalogAssignProductModalProps = {
  open: boolean;
  serviceId: string;
  assignedProductIds: string[];
  categories: CatalogServiceCategoryRecord[];
  saving?: boolean;
  onClose: () => void;
  onAssign: (productId: string, primaryCategoryId: string | null) => Promise<void>;
};

export function CatalogAssignProductModal({
  open,
  serviceId,
  assignedProductIds,
  categories,
  saving = false,
  onClose,
  onAssign,
}: CatalogAssignProductModalProps) {
  const [loading, setLoading] = useState(false);
  const [products, setProducts] = useState<CatalogProductAdminRecord[]>([]);
  const [categoryId, setCategoryId] = useState("");
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!open) return;
    async function load() {
      setLoading(true);
      setError(null);
      try {
        const response = await fetch("/api/admin/catalog/products");
        const data = (await response.json().catch(() => ({}))) as {
          products?: CatalogProductAdminRecord[];
          error?: string;
        };
        if (!response.ok) throw new Error(data.error ?? "Failed to load products.");
        setProducts(data.products ?? []);
      } catch (loadError) {
        setError(loadError instanceof Error ? loadError.message : "Unable to load products.");
        setProducts([]);
      } finally {
        setLoading(false);
      }
    }
    void load();
  }, [open]);

  if (!open) return null;

  const available = products.filter((product) => !assignedProductIds.includes(product.id));

  return (
    <div className="admin-cms-modal" role="presentation">
      <button
        type="button"
        className="admin-cms-dialog__backdrop"
        aria-label="Close assign product dialog"
        onClick={onClose}
      />
      <div className="admin-cms-modal__panel admin-cms-modal__panel--wide" role="dialog" aria-modal="true">
        <div className="admin-cms-modal__header">
          <h3>Add existing product to catalogue</h3>
        </div>
        <div className="admin-cms-modal__body">
          <label className="admin-cms-field">
            <span>Assign to category</span>
            <select value={categoryId} onChange={(event) => setCategoryId(event.target.value)}>
              <option value="">Uncategorized</option>
              {categories.map((category) => (
                <option key={category.id} value={category.id}>
                  {category.label}
                </option>
              ))}
            </select>
          </label>

          {loading ? <p className="admin-cms-loading">Loading products…</p> : null}
          {error ? <p className="admin-cms-error">{error}</p> : null}

          <div className="admin-cms-magazine__grid admin-catalog-assign-grid">
            {available.map((product) => (
              <article key={product.id} className="admin-cms-magazine-card">
                <div className="admin-cms-magazine-card__media">
                  {product.images[0]?.url ? (
                    // eslint-disable-next-line @next/next/no-img-element
                    <img src={product.images[0].url} alt="" />
                  ) : (
                    <div className="admin-cms-magazine-card__placeholder">No image</div>
                  )}
                </div>
                <div className="admin-cms-magazine-card__body">
                  <h3>{product.title}</h3>
                  <p>{product.slug}</p>
                  <button
                    type="button"
                    className="admin-dash__btn admin-dash__btn--dark"
                    disabled={saving}
                    onClick={() =>
                      void onAssign(product.id, categoryId || null).then(onClose)
                    }
                  >
                    Add to catalogue
                  </button>
                </div>
              </article>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
