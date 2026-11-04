"use client";

import { useEffect, useState } from "react";
import {
  draftFromRecord,
  draftToPayload,
  emptyMagazineDraft,
  slugifyMagazineTitle,
  type MagazineArticleDraft,
  type MagazineArticleRecord,
} from "@/lib/cms/magazine";
import { ImageUploadField } from "./editors/shared/ImageUploadField";
import { ConfirmSaveDialog } from "./ConfirmSaveDialog";
import { RichTextEditor } from "./RichTextEditor";

type MagazineArticleModalProps = {
  open: boolean;
  mode: "create" | "edit";
  article: MagazineArticleRecord | null;
  saving?: boolean;
  onClose: () => void;
  onSave: (payload: ReturnType<typeof draftToPayload>) => Promise<void>;
};

export function MagazineArticleModal({
  open,
  mode,
  article,
  saving = false,
  onClose,
  onSave,
}: MagazineArticleModalProps) {
  const [draft, setDraft] = useState<MagazineArticleDraft>(emptyMagazineDraft());
  const [confirmOpen, setConfirmOpen] = useState(false);
  const [slugTouched, setSlugTouched] = useState(false);

  useEffect(() => {
    if (!open) return;
    setDraft(article ? draftFromRecord(article) : emptyMagazineDraft());
    setSlugTouched(Boolean(article));
    setConfirmOpen(false);
  }, [open, article]);

  if (!open) return null;

  function updateDraft<K extends keyof MagazineArticleDraft>(
    key: K,
    value: MagazineArticleDraft[K],
  ) {
    setDraft((current) => ({ ...current, [key]: value }));
  }

  async function handleConfirmSave() {
    await onSave(draftToPayload(draft));
    setConfirmOpen(false);
    onClose();
  }

  return (
    <>
      <div className="admin-cms-modal" role="presentation">
        <button
          type="button"
          className="admin-cms-dialog__backdrop"
          aria-label="Close editor"
          onClick={onClose}
        />
        <div
          className="admin-cms-modal__panel admin-cms-modal__panel--wide admin-cms-magazine-modal"
          role="dialog"
          aria-modal="true"
        >
          <header className="admin-cms-modal__header">
            <div>
              <p className="admin-cms-modal__eyebrow">
                {mode === "create" ? "New article" : "Edit article"}
              </p>
              <h3>{draft.title || "Magazine article"}</h3>
            </div>
            <button
              type="button"
              className="admin-dash__icon-btn admin-cms-modal__close"
              aria-label="Close"
              onClick={onClose}
            >
              ×
            </button>
          </header>

          <div className="admin-cms-modal__body admin-cms-magazine-modal__body">
            <div className="admin-cms-magazine-modal__grid">
              <section className="admin-cms-form-card">
                <h4>Article details</h4>
                <div className="admin-cms-launch-form">
                  <label className="admin-cms-field">
                    <span>Title *</span>
                    <input
                      type="text"
                      value={draft.title}
                      onChange={(event) => {
                        const title = event.target.value;
                        setDraft((current) => ({
                          ...current,
                          title,
                          slug: slugTouched ? current.slug : slugifyMagazineTitle(title),
                          metaTitle:
                            current.metaTitle ||
                            (title ? `${title} | Magazine | Maknisa` : ""),
                        }));
                      }}
                    />
                  </label>
                  <label className="admin-cms-field">
                    <span>URL slug *</span>
                    <input
                      type="text"
                      value={draft.slug}
                      onChange={(event) => {
                        setSlugTouched(true);
                        updateDraft("slug", slugifyMagazineTitle(event.target.value));
                      }}
                    />
                    <small>/ww/magazine/{draft.slug || "your-article-slug"}</small>
                  </label>
                  <label className="admin-cms-field">
                    <span>Subtitle</span>
                    <input
                      type="text"
                      value={draft.subtitle}
                      onChange={(event) => updateDraft("subtitle", event.target.value)}
                    />
                  </label>
                  <label className="admin-cms-field">
                    <span>Excerpt *</span>
                    <textarea
                      rows={3}
                      value={draft.excerpt}
                      onChange={(event) => {
                        const excerpt = event.target.value;
                        setDraft((current) => ({
                          ...current,
                          excerpt,
                          metaDescription: current.metaDescription || excerpt,
                        }));
                      }}
                    />
                  </label>
                  <label className="admin-cms-field">
                    <span>Category label</span>
                    <input
                      type="text"
                      value={draft.categoryLabel}
                      onChange={(event) => updateDraft("categoryLabel", event.target.value)}
                    />
                  </label>
                  <label className="admin-cms-field">
                    <span>Category link</span>
                    <input
                      type="text"
                      value={draft.categoryHref}
                      onChange={(event) => updateDraft("categoryHref", event.target.value)}
                    />
                  </label>
                  <ImageUploadField
                    label="Card image"
                    value={draft.cardImage}
                    onChange={(cardImage) => updateDraft("cardImage", cardImage)}
                  />
                  <ImageUploadField
                    label="Hero image"
                    value={draft.heroImage}
                    onChange={(heroImage) => updateDraft("heroImage", heroImage)}
                  />
                  <label className="admin-cms-field admin-cms-field--inline">
                    <input
                      type="checkbox"
                      checked={draft.large}
                      onChange={(event) => updateDraft("large", event.target.checked)}
                    />
                    <span>Large card on magazine listing</span>
                  </label>
                  <label className="admin-cms-field admin-cms-field--inline">
                    <input
                      type="checkbox"
                      checked={draft.published}
                      onChange={(event) => updateDraft("published", event.target.checked)}
                    />
                    <span>Published</span>
                  </label>
                  <label className="admin-cms-field">
                    <span>Sort order</span>
                    <input
                      type="number"
                      value={draft.sortOrder}
                      onChange={(event) =>
                        updateDraft("sortOrder", Number(event.target.value) || 0)
                      }
                    />
                  </label>
                </div>
              </section>

              <section className="admin-cms-form-card">
                <h4>Article body</h4>
                <RichTextEditor
                  value={draft.bodyHtml}
                  onChange={(bodyHtml) => updateDraft("bodyHtml", bodyHtml)}
                />
              </section>

              <section className="admin-cms-form-card admin-cms-magazine-modal__seo">
                <h4>SEO settings</h4>
                <div className="admin-cms-launch-form">
                  <label className="admin-cms-field">
                    <span>Meta title *</span>
                    <input
                      type="text"
                      maxLength={255}
                      value={draft.metaTitle}
                      onChange={(event) => updateDraft("metaTitle", event.target.value)}
                    />
                  </label>
                  <label className="admin-cms-field">
                    <span>Meta description *</span>
                    <textarea
                      rows={3}
                      maxLength={500}
                      value={draft.metaDescription}
                      onChange={(event) =>
                        updateDraft("metaDescription", event.target.value)
                      }
                    />
                  </label>
                  <label className="admin-cms-field admin-cms-field--inline">
                    <input
                      type="checkbox"
                      checked={draft.noIndex}
                      onChange={(event) => updateDraft("noIndex", event.target.checked)}
                    />
                    <span>No index</span>
                  </label>
                  <label className="admin-cms-field admin-cms-field--inline">
                    <input
                      type="checkbox"
                      checked={draft.noFollow}
                      onChange={(event) => updateDraft("noFollow", event.target.checked)}
                    />
                    <span>No follow</span>
                  </label>
                </div>
              </section>
            </div>
          </div>

          <footer className="admin-cms-modal__footer">
            <button
              type="button"
              className="admin-dash__btn admin-dash__btn--light"
              onClick={onClose}
              disabled={saving}
            >
              Cancel
            </button>
            <button
              type="button"
              className="admin-dash__btn admin-dash__btn--dark"
              onClick={() => setConfirmOpen(true)}
              disabled={saving}
            >
              {mode === "create" ? "Create article" : "Save article"}
            </button>
          </footer>
        </div>
      </div>

      <ConfirmSaveDialog
        open={confirmOpen}
        title={mode === "create" ? "Create magazine article?" : "Save article changes?"}
        message={
          mode === "create"
            ? "This will publish the new article to the Maknisa Magazine."
            : "This will update the article on the live website."
        }
        saving={saving}
        onCancel={() => setConfirmOpen(false)}
        onConfirm={() => void handleConfirmSave()}
      />
    </>
  );
}
