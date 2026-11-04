"use client";

import { useState } from "react";
import { MagazineSection } from "@/components/home/MagazineSection";
import type { MagazineContent } from "@/lib/cms/home-page";
import type { MagazineArticle } from "@/lib/homeSections";
import { ImageUploadField } from "./shared/ImageUploadField";

type MagazineEditorProps = {
  content: MagazineContent;
  onChange: (value: MagazineContent) => void;
};

function updateArticle(
  articles: MagazineArticle[],
  index: number,
  patch: Partial<MagazineArticle>,
): MagazineArticle[] {
  return articles.map((article, articleIndex) =>
    articleIndex === index ? { ...article, ...patch } : article,
  );
}

export function MagazineEditor({ content, onChange }: MagazineEditorProps) {
  const [activeIndex, setActiveIndex] = useState(0);
  const activeArticle = content.articles[activeIndex];

  return (
    <div className="admin-cms-editor admin-cms-editor--launch">
      <div className="admin-cms-editor-pane admin-cms-editor-pane--preview">
        <div className="admin-cms-editor-pane__head">
          <div>
            <span className="admin-cms-editor-pane__badge">Live preview</span>
            <h4>Magazine strip</h4>
          </div>
        </div>
        <div className="admin-cms-preview admin-cms-preview--launch">
          <div className="home-2025 admin-cms-preview__site">
            <MagazineSection content={content} />
          </div>
        </div>
      </div>

      <div className="admin-cms-editor-pane admin-cms-editor-pane--form">
        <div className="admin-cms-editor-pane__head">
          <div>
            <span className="admin-cms-editor-pane__badge admin-cms-editor-pane__badge--muted">
              Editor
            </span>
            <h4>Section & articles</h4>
          </div>
        </div>

        <label className="admin-cms-field">
          <span>Section title</span>
          <input
            type="text"
            value={content.title}
            onChange={(event) => onChange({ ...content, title: event.target.value })}
          />
        </label>
        <label className="admin-cms-field">
          <span>Intro HTML</span>
          <textarea
            rows={3}
            value={content.introHtml}
            onChange={(event) => onChange({ ...content, introHtml: event.target.value })}
          />
        </label>
        <label className="admin-cms-field">
          <span>All articles CTA link</span>
          <input
            type="text"
            value={content.allArticlesCta.href}
            onChange={(event) =>
              onChange({
                ...content,
                allArticlesCta: { ...content.allArticlesCta, href: event.target.value },
              })
            }
          />
        </label>
        <label className="admin-cms-field">
          <span>All articles CTA label</span>
          <input
            type="text"
            value={content.allArticlesCta.label}
            onChange={(event) =>
              onChange({
                ...content,
                allArticlesCta: { ...content.allArticlesCta, label: event.target.value },
              })
            }
          />
        </label>

        <div className="admin-cms-pill-tabs" role="tablist">
          {content.articles.map((article, index) => (
            <button
              key={article.id}
              type="button"
              className={`admin-cms-pill-tab${activeIndex === index ? " is-active" : ""}`}
              onClick={() => setActiveIndex(index)}
            >
              Article {index + 1}
            </button>
          ))}
        </div>

        {activeArticle ? (
          <div className="admin-cms-launch-form">
            <ImageUploadField
              label="Article image (optional)"
              value={activeArticle.image ?? ""}
              onChange={(image) =>
                onChange({
                  ...content,
                  articles: updateArticle(content.articles, activeIndex, { image }),
                })
              }
            />
            <label className="admin-cms-field">
              <span>Article ID</span>
              <input
                type="text"
                value={activeArticle.id}
                onChange={(event) =>
                  onChange({
                    ...content,
                    articles: updateArticle(content.articles, activeIndex, {
                      id: event.target.value,
                    }),
                  })
                }
              />
            </label>
            <label className="admin-cms-field">
              <span>Title</span>
              <input
                type="text"
                value={activeArticle.title}
                onChange={(event) =>
                  onChange({
                    ...content,
                    articles: updateArticle(content.articles, activeIndex, {
                      title: event.target.value,
                    }),
                  })
                }
              />
            </label>
            <label className="admin-cms-field">
              <span>Abstract</span>
              <textarea
                rows={3}
                value={activeArticle.abstract}
                onChange={(event) =>
                  onChange({
                    ...content,
                    articles: updateArticle(content.articles, activeIndex, {
                      abstract: event.target.value,
                    }),
                  })
                }
              />
            </label>
            <label className="admin-cms-field">
              <span>Article link</span>
              <input
                type="text"
                value={activeArticle.href}
                onChange={(event) =>
                  onChange({
                    ...content,
                    articles: updateArticle(content.articles, activeIndex, {
                      href: event.target.value,
                    }),
                  })
                }
              />
            </label>
            <label className="admin-cms-field">
              <span>Category label</span>
              <input
                type="text"
                value={activeArticle.category.label}
                onChange={(event) =>
                  onChange({
                    ...content,
                    articles: updateArticle(content.articles, activeIndex, {
                      category: { ...activeArticle.category, label: event.target.value },
                    }),
                  })
                }
              />
            </label>
            <label className="admin-cms-field">
              <span>Category link</span>
              <input
                type="text"
                value={activeArticle.category.href}
                onChange={(event) =>
                  onChange({
                    ...content,
                    articles: updateArticle(content.articles, activeIndex, {
                      category: { ...activeArticle.category, href: event.target.value },
                    }),
                  })
                }
              />
            </label>
          </div>
        ) : null}
      </div>
    </div>
  );
}
