"use client";

import { useEffect, useMemo, useState } from "react";
import type {
  CatalogProductAdminRecord,
  CatalogServiceCategoryRecord,
} from "@/lib/cms/catalog-admin";
import { getCollectionPageTitle, type GridCollectionSlug } from "@/lib/collections";
import {
  PRODUCT_TYPE_GROUPS,
  PRODUCT_TYPES,
  type ProductTypeGroup,
} from "@/lib/product-types";
import { ImageUploadField } from "@/components/admin/content/editors/shared/ImageUploadField";
import { ConfirmSaveDialog } from "@/components/admin/content/ConfirmSaveDialog";

type CatalogBuyProductModalProps = {
  open: boolean;
  mode: "create" | "edit";
  product: CatalogProductAdminRecord | null;
  categories: CatalogServiceCategoryRecord[];
  serviceId: string;
  serviceSlug: string;
  defaultCollectionSlug: string;
  collectionSlugOptions?: string[];
  saving?: boolean;
  onClose: () => void;
  onSave: (payload: Record<string, unknown>) => Promise<void>;
};

const FURNITURE_GROUPS: ProductTypeGroup[] = [
  "Seating",
  "Tables",
  "Bedroom",
  "Storage",
  "Outdoor",
];

const LIGHTS_GROUPS: ProductTypeGroup[] = ["Lighting"];

function emptyProduct(serviceId: string, collectionSlug: string): CatalogProductAdminRecord {
  return {
    id: "",
    slug: "",
    title: "",
    collectionSlug,
    onlineShop: false,
    primaryProductTypeId: null,
    price: null,
    priceBefore: null,
    fromPrice: null,
    isPublished: true,
    images: [],
    tagLegacyIds: [],
    categoryLegacyIds: [],
    content: {
      productId: "",
      intro: "",
      detailParagraph: "",
      craftedParagraph: "",
      quoteText: "",
      quoteAuthor: "",
      designerName: "",
      designerBio: "",
      designerQuote: "",
      extras: null,
      metaTitle: null,
      metaDescription: null,
    },
    serviceAssignments: [
      {
        serviceId,
        serviceSlug: "",
        serviceLabel: "",
        primaryCategoryId: null,
        primaryCategorySlug: null,
        primaryCategoryLabel: null,
      },
    ],
  };
}

function parsePriceInput(value: string): number | null {
  const digits = value.replace(/[^\d]/g, "");
  if (!digits) return null;
  const parsed = Number(digits);
  return Number.isFinite(parsed) ? parsed : null;
}

function formatPriceInput(value: number | null): string {
  return value !== null ? String(value) : "";
}

type CollectionTagOption = { id: number; label: string };

export function CatalogBuyProductModal({
  open,
  mode,
  product,
  categories,
  serviceId,
  serviceSlug,
  defaultCollectionSlug,
  collectionSlugOptions = [],
  saving = false,
  onClose,
  onSave,
}: CatalogBuyProductModalProps) {
  const [draft, setDraft] = useState<CatalogProductAdminRecord>(
    product ?? emptyProduct(serviceId, defaultCollectionSlug),
  );
  const [confirmOpen, setConfirmOpen] = useState(false);
  const [availableTags, setAvailableTags] = useState<CollectionTagOption[]>([]);
  const [tagFilter, setTagFilter] = useState("");

  const collectionSlug = draft.collectionSlug || defaultCollectionSlug;
  const isLights = serviceSlug.toLowerCase() === "lights";
  const allowedGroups = isLights ? LIGHTS_GROUPS : FURNITURE_GROUPS;

  const productTypeOptions = useMemo(
    () => PRODUCT_TYPES.filter((type) => allowedGroups.includes(type.group)),
    [allowedGroups],
  );

  useEffect(() => {
    if (open) {
      setDraft(product ?? emptyProduct(serviceId, defaultCollectionSlug));
      setTagFilter("");
    }
  }, [open, product, serviceId, defaultCollectionSlug]);

  useEffect(() => {
    if (!open || !collectionSlug) return;

    let cancelled = false;
    void fetch(`/api/admin/catalog/collections/${encodeURIComponent(collectionSlug)}/tags`)
      .then((response) => response.json())
      .then((data: { tags?: CollectionTagOption[] }) => {
        if (!cancelled) setAvailableTags(data.tags ?? []);
      })
      .catch(() => {
        if (!cancelled) setAvailableTags([]);
      });

    return () => {
      cancelled = true;
    };
  }, [open, collectionSlug]);

  if (!open) return null;

  const normalizedFilter = tagFilter.trim().toLowerCase();
  const filteredTags = availableTags.filter((tag) =>
    normalizedFilter ? tag.label.toLowerCase().includes(normalizedFilter) : true,
  );

  const primaryCategoryId =
    draft.serviceAssignments.find((item) => item.serviceId === serviceId)?.primaryCategoryId ??
    "";

  function setPrimaryCategory(categoryId: string) {
    const category = categories.find((item) => item.id === categoryId);
    setDraft({
      ...draft,
      serviceAssignments: draft.serviceAssignments.map((item) =>
        item.serviceId === serviceId
          ? {
              ...item,
              primaryCategoryId: categoryId || null,
              primaryCategorySlug: category?.slug ?? null,
              primaryCategoryLabel: category?.label ?? null,
            }
          : item,
      ),
    });
  }

  function toggleTag(tagId: number) {
    setDraft((current) => ({
      ...current,
      tagLegacyIds: current.tagLegacyIds.includes(tagId)
        ? current.tagLegacyIds.filter((id) => id !== tagId)
        : [...current.tagLegacyIds, tagId],
    }));
  }

  async function handleSave() {
    const imageUrls = draft.images.map((image) => image.url).filter(Boolean);
    await onSave({
      slug: draft.slug,
      title: draft.title,
      collectionSlug: draft.collectionSlug || defaultCollectionSlug,
      onlineShop: draft.onlineShop,
      isPublished: draft.isPublished,
      primaryProductTypeId: draft.primaryProductTypeId,
      price: draft.price,
      priceBefore: draft.priceBefore,
      fromPrice: draft.fromPrice,
      images: imageUrls.map((url, index) => ({
        url,
        sortOrder: index,
        role: index === 0 ? "hero" : "gallery",
      })),
      content: {
        intro: draft.content?.intro ?? "",
        detailParagraph: draft.content?.detailParagraph ?? "",
        metaTitle: draft.content?.metaTitle ?? null,
        metaDescription: draft.content?.metaDescription ?? null,
      },
      tagLegacyIds: draft.tagLegacyIds,
      serviceAssignments: [
        {
          serviceId,
          primaryCategoryId: primaryCategoryId || null,
        },
      ],
    });
    setConfirmOpen(false);
    onClose();
  }

  return (
    <>
      <div className="admin-cms-modal" role="presentation">
        <button
          type="button"
          className="admin-cms-dialog__backdrop"
          aria-label="Close product editor"
          onClick={onClose}
        />
        <div
          className="admin-cms-modal__panel admin-cms-modal__panel--wide"
          role="dialog"
          aria-modal="true"
        >
          <div className="admin-cms-modal__header admin-cms-modal__header--stacked">
            <div>
              <h3>{mode === "create" ? "Add product" : `Edit ${draft.title}`}</h3>
              <p className="admin-cms-modal__subtitle">
                Furniture &amp; lights product page — buy hero with price, carousel, materials,
                and editorial galleries. Not used for interior design / kitchen grid pages.
              </p>
            </div>
          </div>
          <div className="admin-cms-modal__body admin-cms-form-grid">
            <h4 className="admin-cms-form-section-title admin-cms-field--full">Product basics</h4>
            <label className="admin-cms-field">
              <span>Title</span>
              <input
                value={draft.title}
                onChange={(event) => setDraft({ ...draft, title: event.target.value })}
              />
            </label>
            <label className="admin-cms-field">
              <span>Slug</span>
              <input
                value={draft.slug}
                onChange={(event) => setDraft({ ...draft, slug: event.target.value })}
                placeholder="e.g. boxlife-1"
              />
            </label>
            <label className="admin-cms-field">
              <span>Listing category</span>
              <select
                value={primaryCategoryId}
                onChange={(event) => setPrimaryCategory(event.target.value)}
              >
                <option value="">Uncategorized</option>
                {categories.map((category) => (
                  <option key={category.id} value={category.id}>
                    {category.label}
                  </option>
                ))}
              </select>
            </label>
            <label className="admin-cms-field">
              <span>Product type</span>
              <select
                value={draft.primaryProductTypeId ?? ""}
                onChange={(event) =>
                  setDraft({
                    ...draft,
                    primaryProductTypeId: event.target.value
                      ? Number(event.target.value)
                      : null,
                  })
                }
              >
                <option value="">Auto-detect</option>
                {PRODUCT_TYPE_GROUPS.filter((group) => allowedGroups.includes(group)).map(
                  (group) => (
                    <optgroup key={group} label={group}>
                      {productTypeOptions
                        .filter((type) => type.group === group)
                        .map((type) => (
                          <option key={type.id} value={type.id}>
                            {type.label}
                          </option>
                        ))}
                    </optgroup>
                  ),
                )}
              </select>
            </label>
            {collectionSlugOptions.length > 1 ? (
              <label className="admin-cms-field">
                <span>Source collection</span>
                <select
                  value={draft.collectionSlug || defaultCollectionSlug}
                  onChange={(event) =>
                    setDraft({ ...draft, collectionSlug: event.target.value })
                  }
                >
                  {collectionSlugOptions.map((slug) => (
                    <option key={slug} value={slug}>
                      {getCollectionPageTitle(slug as GridCollectionSlug)}
                    </option>
                  ))}
                </select>
              </label>
            ) : null}
            <label className="admin-cms-field admin-cms-field--checkbox">
              <input
                type="checkbox"
                checked={draft.isPublished}
                onChange={(event) => setDraft({ ...draft, isPublished: event.target.checked })}
              />
              <span>Published on website</span>
            </label>

            <h4 className="admin-cms-form-section-title admin-cms-field--full">Buy hero pricing</h4>
            <p className="admin-cms-field-hint admin-cms-field--full">
              Shown in the buy panel as &ldquo;Rec. retail price&rdquo;. Leave blank to auto-generate
              from product tier.
            </p>
            <label className="admin-cms-field">
              <span>Price (PKR)</span>
              <input
                inputMode="numeric"
                value={formatPriceInput(draft.price)}
                onChange={(event) =>
                  setDraft({ ...draft, price: parsePriceInput(event.target.value) })
                }
                placeholder="e.g. 1250000"
              />
            </label>
            <label className="admin-cms-field">
              <span>Compare-at price (PKR)</span>
              <input
                inputMode="numeric"
                value={formatPriceInput(draft.priceBefore)}
                onChange={(event) =>
                  setDraft({ ...draft, priceBefore: parsePriceInput(event.target.value) })
                }
                placeholder="Optional strikethrough price"
              />
            </label>
            <label className="admin-cms-field">
              <span>From price (PKR)</span>
              <input
                inputMode="numeric"
                value={formatPriceInput(draft.fromPrice)}
                onChange={(event) =>
                  setDraft({ ...draft, fromPrice: parsePriceInput(event.target.value) })
                }
                placeholder="Optional “From …” line"
              />
            </label>

            <h4 className="admin-cms-form-section-title admin-cms-field--full">Buy hero copy</h4>
            <label className="admin-cms-field admin-cms-field--full">
              <span>Short description (buy panel)</span>
              <textarea
                rows={3}
                value={draft.content?.intro ?? ""}
                onChange={(event) =>
                  setDraft({
                    ...draft,
                    content: { ...(draft.content as NonNullable<typeof draft.content>), intro: event.target.value },
                  })
                }
              />
            </label>
            <label className="admin-cms-field admin-cms-field--full">
              <span>Editorial paragraph (below galleries)</span>
              <textarea
                rows={4}
                value={draft.content?.detailParagraph ?? ""}
                onChange={(event) =>
                  setDraft({
                    ...draft,
                    content: {
                      ...(draft.content as NonNullable<typeof draft.content>),
                      detailParagraph: event.target.value,
                    },
                  })
                }
              />
            </label>

            <h4 className="admin-cms-form-section-title admin-cms-field--full">Materials &amp; finishes</h4>
            <p className="admin-cms-field-hint admin-cms-field--full">
              Shown in the buy panel materials line (e.g. Fabric, Wood, Lacquered).
            </p>
            <label className="admin-cms-field admin-cms-field--full">
              <span>Search finishes</span>
              <input
                value={tagFilter}
                onChange={(event) => setTagFilter(event.target.value)}
                placeholder="Filter tags…"
              />
            </label>
            <div className="admin-catalog-tag-picker admin-cms-field--full">
              {filteredTags.length > 0 ? (
                filteredTags.map((tag) => {
                  const selected = draft.tagLegacyIds.includes(tag.id);
                  return (
                    <button
                      key={tag.id}
                      type="button"
                      className={`admin-catalog-tag-picker__chip${selected ? " is-selected" : ""}`}
                      aria-pressed={selected}
                      onClick={() => toggleTag(tag.id)}
                    >
                      {tag.label}
                    </button>
                  );
                })
              ) : (
                <p className="admin-cms-field-hint">No finish tags for this collection.</p>
              )}
            </div>

            <h4 className="admin-cms-form-section-title admin-cms-field--full">Carousel images</h4>
            <p className="admin-cms-field-hint admin-cms-field--full">
              First image is the buy-hero carousel lead. Additional images power the gallery sliders
              below.
            </p>
            <div className="admin-cms-field admin-cms-field--full">
              <div className="admin-catalog-product-images">
                {draft.images.map((image, index) => (
                  <ImageUploadField
                    key={image.id || `image-${index}`}
                    label={index === 0 ? "Buy hero image" : `Gallery image ${index + 1}`}
                    value={image.url}
                    onChange={(url) =>
                      setDraft({
                        ...draft,
                        images: draft.images.map((item, itemIndex) =>
                          itemIndex === index ? { ...item, url } : item,
                        ),
                      })
                    }
                  />
                ))}
                <button
                  type="button"
                  className="admin-dash__btn admin-dash__btn--light"
                  onClick={() =>
                    setDraft({
                      ...draft,
                      images: [
                        ...draft.images,
                        {
                          id: `new-${draft.images.length}`,
                          url: "",
                          altText: null,
                          role: draft.images.length === 0 ? "hero" : "gallery",
                          sortOrder: draft.images.length,
                        },
                      ],
                    })
                  }
                >
                  Add image
                </button>
              </div>
            </div>

            <h4 className="admin-cms-form-section-title admin-cms-field--full">SEO</h4>
            <label className="admin-cms-field admin-cms-field--full">
              <span>Meta title</span>
              <input
                value={draft.content?.metaTitle ?? ""}
                onChange={(event) =>
                  setDraft({
                    ...draft,
                    content: {
                      ...(draft.content as NonNullable<typeof draft.content>),
                      metaTitle: event.target.value || null,
                    },
                  })
                }
              />
            </label>
            <label className="admin-cms-field admin-cms-field--full">
              <span>Meta description</span>
              <textarea
                rows={2}
                value={draft.content?.metaDescription ?? ""}
                onChange={(event) =>
                  setDraft({
                    ...draft,
                    content: {
                      ...(draft.content as NonNullable<typeof draft.content>),
                      metaDescription: event.target.value || null,
                    },
                  })
                }
              />
            </label>
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
              {mode === "create" ? "Create product" : "Save product"}
            </button>
          </div>
        </div>
      </div>
      <ConfirmSaveDialog
        open={confirmOpen}
        title={mode === "create" ? "Create product?" : "Save product?"}
        message="This updates the furniture/lights product page and listing."
        saving={saving}
        onCancel={() => setConfirmOpen(false)}
        onConfirm={() => void handleSave()}
      />
    </>
  );
}
