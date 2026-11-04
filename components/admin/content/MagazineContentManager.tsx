"use client";

import { useCallback, useEffect, useState } from "react";
import type { MagazineArticleRecord } from "@/lib/cms/magazine";
import { draftToPayload } from "@/lib/cms/magazine";
import { MagazineArticleModal } from "./MagazineArticleModal";

export function MagazineContentManager() {
  const [loading, setLoading] = useState(true);
  const [articles, setArticles] = useState<MagazineArticleRecord[]>([]);
  const [loadError, setLoadError] = useState<string | null>(null);
  const [statusMessage, setStatusMessage] = useState<string | null>(null);
  const [saving, setSaving] = useState(false);
  const [modalOpen, setModalOpen] = useState(false);
  const [modalMode, setModalMode] = useState<"create" | "edit">("create");
  const [editingArticle, setEditingArticle] = useState<MagazineArticleRecord | null>(null);

  const loadArticles = useCallback(async () => {
    setLoading(true);
    setStatusMessage(null);
    setLoadError(null);
    try {
      const response = await fetch("/api/admin/magazine/articles");
      const data = (await response.json().catch(() => ({}))) as {
        articles?: MagazineArticleRecord[];
        error?: string;
      };

      if (!response.ok) {
        throw new Error(
          data.error ??
            (response.status === 401
              ? "Please sign in again to manage magazine articles."
              : "Failed to load magazine articles. Make sure the Maknisa API is running on port 4000."),
        );
      }

      setArticles(data.articles ?? []);
    } catch (error) {
      setLoadError(
        error instanceof Error ? error.message : "Unable to load magazine articles.",
      );
      setArticles([]);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    void loadArticles();
  }, [loadArticles]);

  function openCreateModal() {
    setModalMode("create");
    setEditingArticle(null);
    setModalOpen(true);
  }

  function openEditModal(article: MagazineArticleRecord) {
    setModalMode("edit");
    setEditingArticle(article);
    setModalOpen(true);
  }

  async function saveArticle(payload: ReturnType<typeof draftToPayload>) {
    setSaving(true);
    setStatusMessage(null);
    try {
      const response = await fetch(
        modalMode === "create"
          ? "/api/admin/magazine/articles"
          : `/api/admin/magazine/articles/${editingArticle?.id}`,
        {
          method: modalMode === "create" ? "POST" : "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(payload),
        },
      );

      if (!response.ok) {
        const data = (await response.json().catch(() => ({}))) as { error?: string };
        throw new Error(data.error ?? "Unable to save article.");
      }

      await loadArticles();
      setStatusMessage(
        modalMode === "create"
          ? "Magazine article created."
          : "Magazine article updated.",
      );
    } catch (error) {
      setStatusMessage(error instanceof Error ? error.message : "Unable to save article.");
      throw error;
    } finally {
      setSaving(false);
    }
  }

  if (loading) {
    return <div className="admin-cms-loading">Loading magazine articles…</div>;
  }

  return (
    <div className="admin-cms-builder admin-cms-magazine">
      {statusMessage ? <p className="admin-cms-status">{statusMessage}</p> : null}

      <div className="admin-cms-magazine__header">
        <div>
          <h2>Magazine articles</h2>
          <p>Manage blog posts shown on the Maknisa Magazine listing and article pages.</p>
        </div>
        <button
          type="button"
          className="admin-dash__btn admin-dash__btn--dark"
          onClick={openCreateModal}
        >
          Add new magazine
        </button>
      </div>

      {articles.length === 0 ? (
        <div className="admin-cms-magazine__empty">
          {loadError ? (
            <>
              <p className="admin-cms-error">{loadError}</p>
              <p>
                Restart the backend with <code>npm run dev</code> in{" "}
                <code>maknisa-backend</code>, then retry. On first run it will create
                the magazine table and import default articles automatically.
              </p>
              <button
                type="button"
                className="admin-dash__btn admin-dash__btn--light"
                onClick={() => void loadArticles()}
              >
                Retry
              </button>
            </>
          ) : (
            <>
              <p>No magazine articles yet. Create your first article or run the seed script.</p>
              <button
                type="button"
                className="admin-dash__btn admin-dash__btn--light"
                onClick={openCreateModal}
              >
                Add new magazine
              </button>
            </>
          )}
        </div>
      ) : (
        <div className="admin-cms-magazine__grid">
          {articles.map((article) => (
            <article key={article.id} className="admin-cms-magazine-card">
              <div className="admin-cms-magazine-card__media">
                {article.cardImage ? (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img src={article.cardImage} alt="" />
                ) : (
                  <div className="admin-cms-magazine-card__placeholder">No image</div>
                )}
                <span
                  className={`admin-cms-magazine-card__badge${
                    article.published ? "" : " admin-cms-magazine-card__badge--draft"
                  }`}
                >
                  {article.published ? "Published" : "Draft"}
                </span>
              </div>
              <div className="admin-cms-magazine-card__body">
                {article.categoryLabel ? (
                  <p className="admin-cms-magazine-card__category">{article.categoryLabel}</p>
                ) : null}
                <h3>{article.title}</h3>
                <p>{article.excerpt}</p>
                <div className="admin-cms-magazine-card__actions">
                  <a
                    href={article.href}
                    target="_blank"
                    rel="noreferrer"
                    className="admin-dash__btn admin-dash__btn--light"
                  >
                    View
                  </a>
                  <button
                    type="button"
                    className="admin-dash__btn admin-dash__btn--dark"
                    onClick={() => openEditModal(article)}
                  >
                    Edit
                  </button>
                </div>
              </div>
            </article>
          ))}
        </div>
      )}

      <MagazineArticleModal
        open={modalOpen}
        mode={modalMode}
        article={editingArticle}
        saving={saving}
        onClose={() => setModalOpen(false)}
        onSave={saveArticle}
      />
    </div>
  );
}
