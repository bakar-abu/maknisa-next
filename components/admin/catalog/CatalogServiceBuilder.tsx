"use client";

import { useCallback, useEffect, useState } from "react";
import type { HomeSeoContent } from "@/lib/cms/home-page";
import type {
  CatalogProductAdminRecord,
  CatalogServiceBundle,
  CatalogServiceCategoryRecord,
  CatalogServiceRecord,
} from "@/lib/cms/catalog-admin";
import { GRID_COLLECTION_SLUGS } from "@/lib/collections";
import { downloadServiceCataloguePdf } from "@/lib/download-service-catalogue-pdf";
import { AdminCmsPreviewStyles } from "@/components/admin/content/AdminCmsPreviewStyles";
import { CmsAccordionSection } from "@/components/admin/content/CmsAccordionSection";
import { ConfirmSaveDialog } from "@/components/admin/content/ConfirmSaveDialog";
import { HomeSeoPanel } from "@/components/admin/content/HomeSeoPanel";
import { CatalogAssignProductModal } from "./CatalogAssignProductModal";
import { CatalogBuyProductModal } from "./CatalogBuyProductModal";
import { CatalogCategoryModal } from "./CatalogCategoryModal";
import { CatalogProductModal } from "./CatalogProductModal";

const SECTIONS_BY_TEMPLATE = {
  collection_grid: [
    {
      id: "service-listing",
      label: "Service listing",
      description: "Page title, intro, and call-to-action shown on the collection grid page.",
    },
    {
      id: "categories",
      label: "Filter categories",
      description: "Finish/style filters mapped to tag IDs from the source collection.",
    },
    {
      id: "products",
      label: "Service catalogue",
      description: "Products assigned to this service grid. Each opens on /ww/services/…",
    },
    {
      id: "catalogue-pdf",
      label: "Download catalogue",
      description: "Preview and download a magazine-style PDF catalogue for this service.",
    },
  ],
  products_catalog: [
    {
      id: "service-listing",
      label: "Service listing",
      description: "Page title, intro, and hero copy for the furniture/lights catalogue page.",
    },
    {
      id: "categories",
      label: "Room categories",
      description:
        "Sofas, chairs, tables, etc. Each category uses product type IDs to group listing cards.",
    },
    {
      id: "products",
      label: "Service catalogue",
      description:
        "Products in this catalogue. Each opens on /services/{slug}/{product} with buy hero and galleries.",
    },
    {
      id: "catalogue-pdf",
      label: "Download catalogue",
      description: "Preview and download a magazine-style PDF catalogue for this service.",
    },
  ],
} as const;

type CatalogServiceBuilderProps = {
  serviceId: string;
  onStatus?: (message: string | null) => void;
};

function serviceToSeo(service: CatalogServiceRecord): HomeSeoContent {
  return {
    metaTitle: service.metaTitle ?? `${service.title} | Maknisa`,
    metaDescription: service.metaDescription ?? service.intro,
    noIndex: service.noIndex,
    noFollow: service.noFollow,
  };
}

function defaultCollectionSlugForService(service: CatalogServiceRecord): string {
  if (service.dataSlug) return service.dataSlug;
  if (service.catalogRoomSlugs?.length) return service.catalogRoomSlugs[0]!;
  return "living";
}

function collectionSlugOptionsForService(service: CatalogServiceRecord): string[] {
  if (service.template === "collection_grid" && service.dataSlug) {
    return [service.dataSlug];
  }
  if (service.catalogRoomSlugs?.length) {
    return service.catalogRoomSlugs;
  }
  return [...GRID_COLLECTION_SLUGS].filter(
    (slug) => slug !== "lighting" && slug !== "marble-tiles",
  );
}

export function CatalogServiceBuilder({ serviceId, onStatus }: CatalogServiceBuilderProps) {
  const [loading, setLoading] = useState(true);
  const [bundle, setBundle] = useState<CatalogServiceBundle | null>(null);
  const [listingDraft, setListingDraft] = useState<Partial<CatalogServiceRecord>>({});
  const [listingDirty, setListingDirty] = useState(false);
  const [seoDraft, setSeoDraft] = useState<HomeSeoContent>({
    metaTitle: "",
    metaDescription: "",
    noIndex: false,
    noFollow: false,
  });
  const [seoDirty, setSeoDirty] = useState(false);
  const [openSectionId, setOpenSectionId] = useState<string | null>("service-listing");
  const [saving, setSaving] = useState(false);
  const [listingConfirmOpen, setListingConfirmOpen] = useState(false);
  const [seoConfirmOpen, setSeoConfirmOpen] = useState(false);
  const [categoryModal, setCategoryModal] = useState<{
    mode: "create" | "edit";
    category: CatalogServiceCategoryRecord;
  } | null>(null);
  const [productModal, setProductModal] = useState<{
    mode: "create" | "edit";
    product: CatalogProductAdminRecord | null;
  } | null>(null);
  const [assignOpen, setAssignOpen] = useState(false);
  const [deleteCategoryTarget, setDeleteCategoryTarget] =
    useState<CatalogServiceCategoryRecord | null>(null);
  const [deleteProductTarget, setDeleteProductTarget] =
    useState<CatalogProductAdminRecord | null>(null);

  const loadBundle = useCallback(
    async (options?: { silent?: boolean; signal?: AbortSignal }) => {
      if (!options?.silent) setLoading(true);
      onStatus?.(null);
      try {
        const response = await fetch(`/api/admin/catalog/services/${serviceId}`, {
          cache: "no-store",
          signal: options?.signal,
        });
        const data = (await response.json().catch(() => ({}))) as CatalogServiceBundle & {
          error?: string;
        };
        if (!response.ok) throw new Error(data.error ?? "Failed to load service.");
        setBundle(data);
        setListingDraft(data.service);
        setSeoDraft(serviceToSeo(data.service));
        setListingDirty(false);
        setSeoDirty(false);
      } catch (error) {
        if (options?.signal?.aborted) return;
        onStatus?.(error instanceof Error ? error.message : "Unable to load service.");
        if (!options?.silent) setBundle(null);
      } finally {
        if (!options?.signal?.aborted && !options?.silent) setLoading(false);
      }
    },
    [serviceId, onStatus],
  );

  useEffect(() => {
    const controller = new AbortController();
    void loadBundle({ signal: controller.signal });
    return () => controller.abort();
  }, [loadBundle]);

  async function fetchProductRecord(productId: string): Promise<CatalogProductAdminRecord> {
    const response = await fetch(`/api/admin/catalog/products/${productId}`, {
      cache: "no-store",
    });
    const data = (await response.json().catch(() => ({}))) as {
      product?: CatalogProductAdminRecord;
      error?: string;
    };
    if (!response.ok || !data.product) {
      throw new Error(data.error ?? "Unable to load product.");
    }
    return data.product;
  }

  async function openProductEditor(product: CatalogProductAdminRecord) {
    setSaving(true);
    try {
      const fullProduct = await fetchProductRecord(product.id);
      setProductModal({ mode: "edit", product: fullProduct });
    } catch (error) {
      onStatus?.(error instanceof Error ? error.message : "Unable to open product.");
    } finally {
      setSaving(false);
    }
  }

  function mergeProduct(saved: CatalogProductAdminRecord) {
    setBundle((current) => {
      if (!current) return current;
      const exists = current.products.some((item) => item.id === saved.id);
      return {
        ...current,
        products: exists
          ? current.products.map((item) => (item.id === saved.id ? saved : item))
          : [...current.products, saved],
      };
    });
  }

  function mergeCategory(saved: CatalogServiceCategoryRecord) {
    setBundle((current) => {
      if (!current) return current;
      const exists = current.categories.some((item) => item.id === saved.id);
      return {
        ...current,
        categories: exists
          ? current.categories.map((item) => (item.id === saved.id ? saved : item))
          : [...current.categories, saved],
      };
    });
  }

  async function saveListing() {
    if (!bundle) return;
    setSaving(true);
    try {
      const response = await fetch(`/api/admin/catalog/services/${bundle.service.id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(listingDraft),
      });
      if (!response.ok) {
        const data = (await response.json().catch(() => ({}))) as { error?: string };
        throw new Error(data.error ?? "Unable to save service listing.");
      }
      setListingConfirmOpen(false);
      setListingDirty(false);
      const data = (await response.json().catch(() => ({}))) as { service?: CatalogServiceRecord };
      if (data.service) {
        setBundle((current) => (current ? { ...current, service: data.service! } : current));
        setListingDraft(data.service);
      }
      onStatus?.("Service listing saved.");
    } catch (error) {
      onStatus?.(error instanceof Error ? error.message : "Unable to save listing.");
    } finally {
      setSaving(false);
    }
  }

  async function saveSeo() {
    if (!bundle) return;
    setSaving(true);
    try {
      const response = await fetch(`/api/admin/catalog/services/${bundle.service.id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          metaTitle: seoDraft.metaTitle,
          metaDescription: seoDraft.metaDescription,
          noIndex: seoDraft.noIndex,
          noFollow: seoDraft.noFollow,
        }),
      });
      if (!response.ok) {
        const data = (await response.json().catch(() => ({}))) as { error?: string };
        throw new Error(data.error ?? "Unable to save SEO.");
      }
      setSeoConfirmOpen(false);
      setSeoDirty(false);
      const data = (await response.json().catch(() => ({}))) as { service?: CatalogServiceRecord };
      if (data.service) {
        setBundle((current) => (current ? { ...current, service: data.service! } : current));
        setSeoDraft(serviceToSeo(data.service));
      }
      onStatus?.("SEO settings saved.");
    } catch (error) {
      onStatus?.(error instanceof Error ? error.message : "Unable to save SEO.");
    } finally {
      setSaving(false);
    }
  }

  async function saveCategory(category: CatalogServiceCategoryRecord) {
    if (!bundle) return;
    setSaving(true);
    try {
      const isCreate = categoryModal?.mode === "create";
      const response = await fetch(
        isCreate
          ? `/api/admin/catalog/services/${bundle.service.id}/categories`
          : `/api/admin/catalog/categories/${category.id}`,
        {
          method: isCreate ? "POST" : "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(category),
        },
      );
      if (!response.ok) {
        const data = (await response.json().catch(() => ({}))) as { error?: string };
        throw new Error(data.error ?? "Unable to save category.");
      }
      const data = (await response.json().catch(() => ({}))) as {
        category?: CatalogServiceCategoryRecord;
      };
      if (data.category) mergeCategory(data.category);
      setCategoryModal(null);
      onStatus?.(isCreate ? "Category created." : "Category updated.");
    } finally {
      setSaving(false);
    }
  }

  async function deleteCategory(mode: "category_only" | "category_and_products") {
    if (!deleteCategoryTarget) return;
    setSaving(true);
    try {
      const response = await fetch(
        `/api/admin/catalog/categories/${deleteCategoryTarget.id}?mode=${mode}`,
        { method: "DELETE" },
      );
      if (!response.ok) {
        const data = (await response.json().catch(() => ({}))) as { error?: string };
        throw new Error(data.error ?? "Unable to delete category.");
      }
      const target = deleteCategoryTarget;
      setDeleteCategoryTarget(null);
      setBundle((current) => {
        if (!current || !target) return current;
        const categories = current.categories.filter((item) => item.id !== target.id);
        let products = current.products;
        if (mode === "category_and_products") {
          products = current.products.filter((product) => {
            const assignment = product.serviceAssignments.find(
              (item) => item.serviceId === current.service.id,
            );
            return assignment?.primaryCategoryId !== target.id;
          });
        } else {
          products = current.products.map((product) => ({
            ...product,
            serviceAssignments: product.serviceAssignments.map((assignment) =>
              assignment.serviceId === current.service.id &&
              assignment.primaryCategoryId === target.id
                ? {
                    ...assignment,
                    primaryCategoryId: null,
                    primaryCategorySlug: null,
                    primaryCategoryLabel: null,
                  }
                : assignment,
            ),
          }));
        }
        return { ...current, categories, products };
      });
      onStatus?.("Category deleted.");
    } catch (error) {
      onStatus?.(error instanceof Error ? error.message : "Unable to delete category.");
    } finally {
      setSaving(false);
    }
  }

  async function saveProduct(payload: Record<string, unknown>) {
    if (!bundle || !productModal) return;
    setSaving(true);
    try {
      const isCreate = productModal.mode === "create";
      const response = await fetch(
        isCreate ? "/api/admin/catalog/products" : `/api/admin/catalog/products/${productModal.product?.id}`,
        {
          method: isCreate ? "POST" : "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(payload),
        },
      );
      if (!response.ok) {
        const data = (await response.json().catch(() => ({}))) as { error?: string };
        throw new Error(data.error ?? "Unable to save product.");
      }
      const data = (await response.json().catch(() => ({}))) as {
        product?: CatalogProductAdminRecord;
      };
      if (data.product) mergeProduct(data.product);
      onStatus?.(isCreate ? "Product created." : "Product updated.");
    } finally {
      setSaving(false);
    }
  }

  async function assignProduct(productId: string, primaryCategoryId: string | null) {
    if (!bundle) return;
    setSaving(true);
    try {
      const response = await fetch(`/api/admin/catalog/services/${bundle.service.id}/products`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ productId, primaryCategoryId }),
      });
      if (!response.ok) {
        const data = (await response.json().catch(() => ({}))) as { error?: string };
        throw new Error(data.error ?? "Unable to assign product.");
      }
      const saved = await fetchProductRecord(productId);
      mergeProduct(saved);
      onStatus?.("Product added to catalogue.");
    } finally {
      setSaving(false);
    }
  }

  async function deleteProduct() {
    if (!deleteProductTarget) return;
    setSaving(true);
    try {
      const response = await fetch(`/api/admin/catalog/products/${deleteProductTarget.id}`, {
        method: "DELETE",
      });
      if (!response.ok) {
        const data = (await response.json().catch(() => ({}))) as { error?: string };
        throw new Error(data.error ?? "Unable to delete product.");
      }
      const targetId = deleteProductTarget.id;
      setDeleteProductTarget(null);
      setBundle((current) =>
        current
          ? { ...current, products: current.products.filter((item) => item.id !== targetId) }
          : current,
      );
      onStatus?.("Product deleted.");
    } catch (error) {
      onStatus?.(error instanceof Error ? error.message : "Unable to delete product.");
    } finally {
      setSaving(false);
    }
  }

  if (loading) {
    return <div className="admin-cms-loading">Loading service catalogue…</div>;
  }

  if (!bundle) {
    return <div className="admin-cms-error">Unable to load this service.</div>;
  }

  const assignedIds = bundle.products.map((product) => product.id);
  const sections = SECTIONS_BY_TEMPLATE[bundle.service.template];

  return (
    <div className="admin-cms-builder">
      <AdminCmsPreviewStyles />

      <HomeSeoPanel
        seo={seoDraft}
        dirty={seoDirty}
        saving={saving}
        onChange={(next) => {
          setSeoDraft(next);
          setSeoDirty(true);
        }}
        onSave={() => setSeoConfirmOpen(true)}
      />

      <div className="admin-cms-sections">
        {sections.map((section) => (
          <CmsAccordionSection
            key={section.id}
            label={section.label}
            description={section.description}
            isOpen={openSectionId === section.id}
            onToggle={() =>
              setOpenSectionId((current) => (current === section.id ? null : section.id))
            }
            onEdit={() => setOpenSectionId(section.id)}
          >
            {section.id === "service-listing" ? (
              <div className="admin-cms-form-grid">
                <label className="admin-cms-field">
                  <span>Title</span>
                  <input
                    value={listingDraft.title ?? ""}
                    onChange={(event) => {
                      setListingDraft({ ...listingDraft, title: event.target.value });
                      setListingDirty(true);
                    }}
                  />
                </label>
                <label className="admin-cms-field">
                  <span>H1</span>
                  <input
                    value={listingDraft.h1 ?? ""}
                    onChange={(event) => {
                      setListingDraft({ ...listingDraft, h1: event.target.value });
                      setListingDirty(true);
                    }}
                  />
                </label>
                <label className="admin-cms-field admin-cms-field--full">
                  <span>Intro</span>
                  <textarea
                    rows={3}
                    value={listingDraft.intro ?? ""}
                    onChange={(event) => {
                      setListingDraft({ ...listingDraft, intro: event.target.value });
                      setListingDirty(true);
                    }}
                  />
                </label>
                <label className="admin-cms-field">
                  <span>CTA label</span>
                  <input
                    value={listingDraft.ctaLabel ?? ""}
                    onChange={(event) => {
                      setListingDraft({ ...listingDraft, ctaLabel: event.target.value });
                      setListingDirty(true);
                    }}
                  />
                </label>
                <div className="admin-cms-field admin-cms-field--full">
                  <button
                    type="button"
                    className="admin-dash__btn admin-dash__btn--dark"
                    disabled={!listingDirty || saving}
                    onClick={() => setListingConfirmOpen(true)}
                  >
                    Save listing
                  </button>
                </div>
              </div>
            ) : null}

            {section.id === "categories" ? (
              <>
                <div className="admin-cms-magazine__header">
                  <p>{bundle.categories.length} categories</p>
                  <button
                    type="button"
                    className="admin-dash__btn admin-dash__btn--dark"
                    onClick={() =>
                      setCategoryModal({
                        mode: "create",
                        category: {
                          id: "",
                          slug: "",
                          label: "",
                          heading: "",
                          exploreLabel: bundle.service.ctaLabel,
                          imageUrl: null,
                          filterTagIds: [],
                          productTypeIds: [],
                          sortOrder: bundle.categories.length,
                        },
                      })
                    }
                  >
                    Add category
                  </button>
                </div>
                <div className="admin-catalog-category-list">
                  {bundle.categories.map((category) => (
                    <div key={category.id} className="admin-catalog-category-row">
                      <div>
                        <strong>{category.label}</strong>
                        <span>{category.slug}</span>
                      </div>
                      <div>
                        <button
                          type="button"
                          className="admin-dash__btn admin-dash__btn--light"
                          onClick={() => setCategoryModal({ mode: "edit", category })}
                        >
                          Edit
                        </button>
                        <button
                          type="button"
                          className="admin-dash__btn admin-dash__btn--light"
                          onClick={() => setDeleteCategoryTarget(category)}
                        >
                          Delete
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              </>
            ) : null}

            {section.id === "products" ? (
              <>
                <div className="admin-cms-magazine__header">
                  <p>{bundle.products.length} products in this service catalogue</p>
                  <div className="admin-catalog-product-actions-bar">
                    <button
                      type="button"
                      className="admin-dash__btn admin-dash__btn--light"
                      onClick={() => setAssignOpen(true)}
                    >
                      Add existing product
                    </button>
                    <button
                      type="button"
                      className="admin-dash__btn admin-dash__btn--dark"
                      onClick={() => setProductModal({ mode: "create", product: null })}
                    >
                      Create new product
                    </button>
                  </div>
                </div>
                <div className="admin-cms-magazine__grid">
                  {bundle.products.map((product) => {
                    const assignment = product.serviceAssignments.find(
                      (item) => item.serviceId === bundle.service.id,
                    );
                    return (
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
                          {assignment?.primaryCategoryLabel ? (
                            <p className="admin-cms-magazine-card__category">
                              {assignment.primaryCategoryLabel}
                            </p>
                          ) : null}
                          <h3>{product.title}</h3>
                          <p>{product.slug}</p>
                          <div className="admin-cms-magazine-card__actions">
                            <button
                              type="button"
                              className="admin-dash__btn admin-dash__btn--dark"
                              onClick={() => void openProductEditor(product)}
                            >
                              Edit
                            </button>
                            <button
                              type="button"
                              className="admin-dash__btn admin-dash__btn--light"
                              onClick={() => setDeleteProductTarget(product)}
                            >
                              Delete
                            </button>
                          </div>
                        </div>
                      </article>
                    );
                  })}
                </div>
              </>
            ) : null}

            {section.id === "catalogue-pdf" ? (
              <div className="admin-catalog-pdf-panel">
                <p>
                  Generate a magazine-style PDF catalogue from all products in this service,
                  grouped by category.
                </p>
                <button
                  type="button"
                  className="admin-dash__btn admin-dash__btn--dark"
                  onClick={() => {
                    try {
                      downloadServiceCataloguePdf(bundle);
                      onStatus?.("Catalogue PDF opened — use Print → Save as PDF.");
                    } catch (error) {
                      onStatus?.(
                        error instanceof Error ? error.message : "Unable to open catalogue PDF.",
                      );
                    }
                  }}
                >
                  Download catalogue PDF
                </button>
              </div>
            ) : null}
          </CmsAccordionSection>
        ))}
      </div>

      <ConfirmSaveDialog
        open={listingConfirmOpen}
        title="Save service listing?"
        message="This updates the live service page copy."
        saving={saving}
        onCancel={() => setListingConfirmOpen(false)}
        onConfirm={() => void saveListing()}
      />
      <ConfirmSaveDialog
        open={seoConfirmOpen}
        title="Save SEO changes?"
        message="This updates SEO for the service listing page."
        saving={saving}
        onCancel={() => setSeoConfirmOpen(false)}
        onConfirm={() => void saveSeo()}
      />

      {categoryModal ? (
        <CatalogCategoryModal
          open
          mode={categoryModal.mode}
          category={categoryModal.category}
          template={bundle.service.template}
          saving={saving}
          onClose={() => setCategoryModal(null)}
          onSave={saveCategory}
        />
      ) : null}

      {productModal ? (
        bundle.service.template === "products_catalog" ? (
          <CatalogBuyProductModal
            open
            mode={productModal.mode}
            product={productModal.product}
            categories={bundle.categories}
            serviceId={bundle.service.id}
            serviceSlug={bundle.service.slug}
            defaultCollectionSlug={defaultCollectionSlugForService(bundle.service)}
            collectionSlugOptions={collectionSlugOptionsForService(bundle.service)}
            saving={saving}
            onClose={() => setProductModal(null)}
            onSave={saveProduct}
          />
        ) : (
          <CatalogProductModal
            open
            mode={productModal.mode}
            product={productModal.product}
            categories={bundle.categories}
            serviceId={bundle.service.id}
            defaultCollectionSlug={defaultCollectionSlugForService(bundle.service)}
            collectionSlugOptions={collectionSlugOptionsForService(bundle.service)}
            saving={saving}
            onClose={() => setProductModal(null)}
            onSave={saveProduct}
          />
        )
      ) : null}

      <CatalogAssignProductModal
        open={assignOpen}
        serviceId={bundle.service.id}
        assignedProductIds={assignedIds}
        categories={bundle.categories}
        saving={saving}
        onClose={() => setAssignOpen(false)}
        onAssign={assignProduct}
      />

      {deleteCategoryTarget ? (
        <div className="admin-cms-dialog" role="presentation">
          <button
            type="button"
            className="admin-cms-dialog__backdrop"
            aria-label="Close"
            onClick={() => setDeleteCategoryTarget(null)}
          />
          <div className="admin-cms-dialog__card" role="dialog" aria-modal="true">
            <h3>Delete “{deleteCategoryTarget.label}”?</h3>
            <p>Delete the category only, or delete the category and all products assigned to it.</p>
            <div className="admin-cms-dialog__actions">
              <button type="button" className="admin-dash__btn admin-dash__btn--light" onClick={() => setDeleteCategoryTarget(null)}>
                Cancel
              </button>
              <button type="button" className="admin-dash__btn admin-dash__btn--light" disabled={saving} onClick={() => void deleteCategory("category_only")}>
                Category only
              </button>
              <button type="button" className="admin-dash__btn admin-dash__btn--dark" disabled={saving} onClick={() => void deleteCategory("category_and_products")}>
                Category + products
              </button>
            </div>
          </div>
        </div>
      ) : null}

      {deleteProductTarget ? (
        <ConfirmSaveDialog
          open
          title={`Delete “${deleteProductTarget.title}”?`}
          message="This permanently removes the product and all related data."
          saving={saving}
          onCancel={() => setDeleteProductTarget(null)}
          onConfirm={() => void deleteProduct()}
        />
      ) : null}
    </div>
  );
}
