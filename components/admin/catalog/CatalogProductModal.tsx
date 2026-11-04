"use client";

import { useEffect, useState } from "react";
import type {
  CatalogProductAdminRecord,
  CatalogServiceCategoryRecord,
} from "@/lib/cms/catalog-admin";
import { getCollectionPageTitle, type GridCollectionSlug } from "@/lib/collections";
import { ImageUploadField } from "@/components/admin/content/editors/shared/ImageUploadField";
import { ConfirmSaveDialog } from "@/components/admin/content/ConfirmSaveDialog";

type CatalogProductModalProps = {
  open: boolean;
  mode: "create" | "edit";
  product: CatalogProductAdminRecord | null;
  categories: CatalogServiceCategoryRecord[];
  serviceId: string;
  defaultCollectionSlug: string;
  collectionSlugOptions?: string[];
  saving?: boolean;
  onClose: () => void;
  onSave: (payload: Record<string, unknown>) => Promise<void>;
};

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
      quoteAuthor: "Maknisa Design Studio",
      designerName: "Maknisa Design Studio",
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

function updateContent(
  draft: CatalogProductAdminRecord,
  patch: Partial<NonNullable<CatalogProductAdminRecord["content"]>>,
): CatalogProductAdminRecord {
  return {
    ...draft,
    content: {
      ...(draft.content as NonNullable<CatalogProductAdminRecord["content"]>),
      ...patch,
    },
  };
}

type CollectionTagOption = { id: number; label: string };

export function CatalogProductModal({
  open,
  mode,
  product,
  categories,
  serviceId,
  defaultCollectionSlug,
  collectionSlugOptions = [],
  saving = false,
  onClose,
  onSave,
}: CatalogProductModalProps) {
  const [draft, setDraft] = useState<CatalogProductAdminRecord>(
    product ?? emptyProduct(serviceId, defaultCollectionSlug),
  );
  const [confirmOpen, setConfirmOpen] = useState(false);
  const [availableTags, setAvailableTags] = useState<CollectionTagOption[]>([]);
  const [tagFilter, setTagFilter] = useState("");

  const collectionSlug = draft.collectionSlug || defaultCollectionSlug;

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

  function toggleTag(tagId: number) {
    setDraft((current) => ({
      ...current,
      tagLegacyIds: current.tagLegacyIds.includes(tagId)
        ? current.tagLegacyIds.filter((id) => id !== tagId)
        : [...current.tagLegacyIds, tagId],
    }));
  }

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

  async function handleSave() {
    const imageUrls = draft.images.map((image) => image.url).filter(Boolean);
    await onSave({
      slug: draft.slug,
      title: draft.title,
      collectionSlug: draft.collectionSlug || defaultCollectionSlug,
      onlineShop: draft.onlineShop,
      isPublished: draft.isPublished,
      images: imageUrls.map((url, index) => ({
        url,
        sortOrder: index,
        role: index === 0 ? "hero" : "gallery",
      })),
      content: draft.content,
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
                Collection-grid product page (kitchens, interior design, woodwork) — hero, gallery,
                quote, designer block, and finish tags.
              </p>
            </div>
          </div>
          <div className="admin-cms-modal__body admin-cms-form-grid">
            <h4 className="admin-cms-form-section-title admin-cms-field--full">Basics</h4>
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
                placeholder="e.g. baltimora-1"
              />
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
            <label className="admin-cms-field">
              <span>Filter category</span>
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
            <label className="admin-cms-field admin-cms-field--checkbox">
              <input
                type="checkbox"
                checked={draft.isPublished}
                onChange={(event) => setDraft({ ...draft, isPublished: event.target.checked })}
              />
              <span>Published on website</span>
            </label>

            <h4 className="admin-cms-form-section-title admin-cms-field--full">Finish tags</h4>
            <p className="admin-cms-field-hint admin-cms-field--full">
              Style/finish labels on the grid card (e.g. MODERN, CLASSIC, FRAME DOOR).
            </p>
            <label className="admin-cms-field admin-cms-field--full">
              <span>Search tags</span>
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
                <p className="admin-cms-field-hint">No tags found for this collection.</p>
              )}
            </div>

            <h4 className="admin-cms-form-section-title admin-cms-field--full">Hero &amp; intro</h4>
            <label className="admin-cms-field admin-cms-field--full">
              <span>Intro (hero lead paragraph)</span>
              <textarea
                rows={4}
                value={draft.content?.intro ?? ""}
                onChange={(event) =>
                  setDraft(updateContent(draft, { intro: event.target.value }))
                }
              />
            </label>
            <label className="admin-cms-field admin-cms-field--full">
              <span>Detail paragraph (gallery section)</span>
              <textarea
                rows={4}
                value={draft.content?.detailParagraph ?? ""}
                onChange={(event) =>
                  setDraft(updateContent(draft, { detailParagraph: event.target.value }))
                }
              />
            </label>
            <label className="admin-cms-field admin-cms-field--full">
              <span>Crafted paragraph (gallery section)</span>
              <textarea
                rows={3}
                value={draft.content?.craftedParagraph ?? ""}
                onChange={(event) =>
                  setDraft(updateContent(draft, { craftedParagraph: event.target.value }))
                }
              />
            </label>

            <h4 className="admin-cms-form-section-title admin-cms-field--full">Quote block</h4>
            <label className="admin-cms-field admin-cms-field--full">
              <span>Quote text</span>
              <textarea
                rows={3}
                value={draft.content?.quoteText ?? ""}
                onChange={(event) =>
                  setDraft(updateContent(draft, { quoteText: event.target.value }))
                }
              />
            </label>
            <label className="admin-cms-field">
              <span>Quote author</span>
              <input
                value={draft.content?.quoteAuthor ?? ""}
                onChange={(event) =>
                  setDraft(updateContent(draft, { quoteAuthor: event.target.value }))
                }
              />
            </label>

            <h4 className="admin-cms-form-section-title admin-cms-field--full">Designer block</h4>
            <label className="admin-cms-field">
              <span>Designer name</span>
              <input
                value={draft.content?.designerName ?? ""}
                onChange={(event) =>
                  setDraft(updateContent(draft, { designerName: event.target.value }))
                }
              />
            </label>
            <label className="admin-cms-field admin-cms-field--full">
              <span>Designer biography</span>
              <textarea
                rows={4}
                value={draft.content?.designerBio ?? ""}
                onChange={(event) =>
                  setDraft(updateContent(draft, { designerBio: event.target.value }))
                }
              />
            </label>
            <label className="admin-cms-field admin-cms-field--full">
              <span>Designer quote</span>
              <textarea
                rows={3}
                value={draft.content?.designerQuote ?? ""}
                onChange={(event) =>
                  setDraft(updateContent(draft, { designerQuote: event.target.value }))
                }
              />
            </label>

            <h4 className="admin-cms-form-section-title admin-cms-field--full">SEO</h4>
            <label className="admin-cms-field admin-cms-field--full">
              <span>Meta title</span>
              <input
                value={draft.content?.metaTitle ?? ""}
                onChange={(event) =>
                  setDraft(updateContent(draft, { metaTitle: event.target.value || null }))
                }
              />
            </label>
            <label className="admin-cms-field admin-cms-field--full">
              <span>Meta description</span>
              <textarea
                rows={2}
                value={draft.content?.metaDescription ?? ""}
                onChange={(event) =>
                  setDraft(
                    updateContent(draft, { metaDescription: event.target.value || null }),
                  )
                }
              />
            </label>

            <h4 className="admin-cms-form-section-title admin-cms-field--full">Product images</h4>
            <p className="admin-cms-field-hint admin-cms-field--full">
              First image is the hero. Additional images fill gallery sliders.
            </p>
            <div className="admin-cms-field admin-cms-field--full">
              <div className="admin-catalog-product-images">
                {draft.images.map((image, index) => (
                  <ImageUploadField
                    key={image.id || `image-${index}`}
                    label={index === 0 ? "Hero image" : `Gallery image ${index + 1}`}
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
        message="This updates the collection-grid product detail page."
        saving={saving}
        onCancel={() => setConfirmOpen(false)}
        onConfirm={() => void handleSave()}
      />
    </>
  );
}
