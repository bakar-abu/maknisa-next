"use client";

import type { HomeSeoContent } from "@/lib/cms/home-page";

type HomeSeoPanelProps = {
  seo: HomeSeoContent;
  dirty: boolean;
  saving?: boolean;
  onChange: (seo: HomeSeoContent) => void;
  onSave: () => void;
};

export function HomeSeoPanel({
  seo,
  dirty,
  saving = false,
  onChange,
  onSave,
}: HomeSeoPanelProps) {
  return (
    <section className="admin-cms-seo">
      <div className="admin-cms-seo__header">
        <div>
          <h2>SEO settings</h2>
          <p>Control how the homepage appears in search engines and social previews.</p>
        </div>
        <button
          type="button"
          className="admin-dash__btn admin-dash__btn--dark"
          onClick={onSave}
          disabled={!dirty || saving}
        >
          {saving ? "Saving…" : "Save SEO"}
        </button>
      </div>

      <div className="admin-cms-seo__grid">
        <label className="admin-cms-field">
          <span>Meta title</span>
          <input
            type="text"
            value={seo.metaTitle}
            maxLength={255}
            onChange={(event) =>
              onChange({ ...seo, metaTitle: event.target.value })
            }
          />
          <small>{seo.metaTitle.length}/255 characters</small>
        </label>

        <label className="admin-cms-field admin-cms-field--full">
          <span>Meta description</span>
          <textarea
            value={seo.metaDescription}
            maxLength={500}
            rows={3}
            onChange={(event) =>
              onChange({ ...seo, metaDescription: event.target.value })
            }
          />
          <small>{seo.metaDescription.length}/500 characters</small>
        </label>

        <label className="admin-cms-check">
          <input
            type="checkbox"
            checked={seo.noIndex}
            onChange={(event) =>
              onChange({ ...seo, noIndex: event.target.checked })
            }
          />
          <span>
            <strong>No index</strong>
            <small>Ask search engines not to index this page.</small>
          </span>
        </label>

        <label className="admin-cms-check">
          <input
            type="checkbox"
            checked={seo.noFollow}
            onChange={(event) =>
              onChange({ ...seo, noFollow: event.target.checked })
            }
          />
          <span>
            <strong>No follow</strong>
            <small>Ask search engines not to follow links on this page.</small>
          </span>
        </label>
      </div>
    </section>
  );
}
