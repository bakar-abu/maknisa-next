"use client";

import { useEffect, useState } from "react";
import type { CatalogServiceCategoryRecord } from "@/lib/cms/catalog-admin";
import { ImageUploadField } from "@/components/admin/content/editors/shared/ImageUploadField";
import { ConfirmSaveDialog } from "@/components/admin/content/ConfirmSaveDialog";

type CatalogCategoryModalProps = {
  open: boolean;
  mode: "create" | "edit";
  category: CatalogServiceCategoryRecord;
  template: "collection_grid" | "products_catalog";
  saving?: boolean;
  onClose: () => void;
  onSave: (category: CatalogServiceCategoryRecord) => Promise<void>;
};

function parseIdList(value: string): number[] {
  return value
    .split(/[,\s]+/)
    .map((part) => Number(part.trim()))
    .filter((id) => Number.isFinite(id) && id > 0);
}

export function CatalogCategoryModal({
  open,
  mode,
  category,
  template,
  saving = false,
  onClose,
  onSave,
}: CatalogCategoryModalProps) {
  const [draft, setDraft] = useState(category);
  const [confirmOpen, setConfirmOpen] = useState(false);
  const [productTypeIdsInput, setProductTypeIdsInput] = useState("");
  const [filterTagIdsInput, setFilterTagIdsInput] = useState("");

  useEffect(() => {
    if (open) {
      setDraft(category);
      setProductTypeIdsInput(category.productTypeIds.join(", "));
      setFilterTagIdsInput(category.filterTagIds.join(", "));
    }
  }, [open, category]);

  if (!open) return null;

  const isCatalog = template === "products_catalog";

  return (
    <>
      <div className="admin-cms-modal" role="presentation">
        <button
          type="button"
          className="admin-cms-dialog__backdrop"
          aria-label="Close category editor"
          onClick={onClose}
        />
        <div className="admin-cms-modal__panel" role="dialog" aria-modal="true">
          <div className="admin-cms-modal__header">
            <h3>{mode === "create" ? "Add category" : "Edit category"}</h3>
            <p className="admin-cms-modal__subtitle">
              {isCatalog
                ? "Furniture & lights categories filter products by product type IDs on the listing page."
                : "Collection-grid categories filter products by finish/style tag IDs."}
            </p>
          </div>
          <div className="admin-cms-modal__body admin-cms-form-grid">
            <label className="admin-cms-field">
              <span>Label</span>
              <input
                value={draft.label}
                onChange={(event) => setDraft({ ...draft, label: event.target.value })}
              />
            </label>
            <label className="admin-cms-field">
              <span>Slug</span>
              <input
                value={draft.slug}
                onChange={(event) => setDraft({ ...draft, slug: event.target.value })}
              />
            </label>
            <label className="admin-cms-field">
              <span>Heading</span>
              <input
                value={draft.heading ?? ""}
                onChange={(event) => setDraft({ ...draft, heading: event.target.value })}
              />
            </label>
            {isCatalog ? (
              <label className="admin-cms-field">
                <span>Explore label</span>
                <input
                  value={draft.exploreLabel ?? ""}
                  onChange={(event) => setDraft({ ...draft, exploreLabel: event.target.value })}
                  placeholder="Customize your order"
                />
              </label>
            ) : null}
            {isCatalog ? (
              <label className="admin-cms-field admin-cms-field--full">
                <span>Product type IDs</span>
                <input
                  value={productTypeIdsInput}
                  onChange={(event) => setProductTypeIdsInput(event.target.value)}
                  placeholder="e.g. 105, 106 for sofas"
                />
                <span className="admin-cms-field-hint">
                  Comma-separated IDs from the product type catalogue (101 chair, 105 sofa, 701
                  pendant, etc.).
                </span>
              </label>
            ) : (
              <label className="admin-cms-field admin-cms-field--full">
                <span>Filter tag IDs</span>
                <input
                  value={filterTagIdsInput}
                  onChange={(event) => setFilterTagIdsInput(event.target.value)}
                  placeholder="e.g. 1, 2, 3"
                />
                <span className="admin-cms-field-hint">
                  Legacy tag IDs from the source collection JSON used to filter the grid.
                </span>
              </label>
            )}
            <ImageUploadField
              label="Hero image"
              value={draft.imageUrl ?? ""}
              onChange={(url) => setDraft({ ...draft, imageUrl: url })}
            />
          </div>
          <div className="admin-cms-modal__footer">
            <button type="button" className="admin-dash__btn admin-dash__btn--light" onClick={onClose}>
              Cancel
            </button>
            <button
              type="button"
              className="admin-dash__btn admin-dash__btn--dark"
              onClick={() => setConfirmOpen(true)}
            >
              Save category
            </button>
          </div>
        </div>
      </div>
      <ConfirmSaveDialog
        open={confirmOpen}
        title="Save category?"
        message="This updates the category on the live service page."
        saving={saving}
        onCancel={() => setConfirmOpen(false)}
        onConfirm={async () => {
          await onSave({
            ...draft,
            productTypeIds: isCatalog ? parseIdList(productTypeIdsInput) : draft.productTypeIds,
            filterTagIds: isCatalog ? draft.filterTagIds : parseIdList(filterTagIdsInput),
          });
          setConfirmOpen(false);
          onClose();
        }}
      />
    </>
  );
}
