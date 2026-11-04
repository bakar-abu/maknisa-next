"use client";

import { useState } from "react";
import { NewsScrollingSection } from "@/components/home/NewsScrollingSection";
import type { NewsScrollingContent } from "@/lib/cms/home-page";
import type { NewsScrollItem } from "@/lib/homeSections";
import { ImageUploadField } from "./shared/ImageUploadField";

type NewsScrollingEditorProps = {
  content: NewsScrollingContent;
  onChange: (value: NewsScrollingContent) => void;
};

function updateItem(
  items: NewsScrollItem[],
  index: number,
  patch: Partial<NewsScrollItem>,
): NewsScrollItem[] {
  return items.map((item, itemIndex) =>
    itemIndex === index ? { ...item, ...patch } : item,
  );
}

export function NewsScrollingEditor({ content, onChange }: NewsScrollingEditorProps) {
  const [activeIndex, setActiveIndex] = useState(0);
  const activeItem = content.items[activeIndex];

  return (
    <div className="admin-cms-editor admin-cms-editor--launch">
      <div className="admin-cms-editor-pane admin-cms-editor-pane--preview">
        <div className="admin-cms-editor-pane__head">
          <div>
            <span className="admin-cms-editor-pane__badge">Live preview</span>
            <h4>News scrolling</h4>
          </div>
        </div>
        <div className="admin-cms-preview admin-cms-preview--launch">
          <div className="home-2025 admin-cms-preview__site">
            <NewsScrollingSection content={content} />
          </div>
        </div>
      </div>

      <div className="admin-cms-editor-pane admin-cms-editor-pane--form">
        <div className="admin-cms-editor-pane__head">
          <div>
            <span className="admin-cms-editor-pane__badge admin-cms-editor-pane__badge--muted">
              Editor
            </span>
            <h4>Section copy</h4>
          </div>
        </div>

        <label className="admin-cms-field">
          <span>Eyebrow</span>
          <input
            type="text"
            value={content.eyebrow}
            onChange={(event) => onChange({ ...content, eyebrow: event.target.value })}
          />
        </label>
        <label className="admin-cms-field">
          <span>Title</span>
          <input
            type="text"
            value={content.title}
            onChange={(event) => onChange({ ...content, title: event.target.value })}
          />
        </label>
        <label className="admin-cms-field">
          <span>Intro HTML</span>
          <textarea
            rows={4}
            value={content.introHtml}
            onChange={(event) => onChange({ ...content, introHtml: event.target.value })}
          />
        </label>

        <div className="admin-cms-pill-tabs" role="tablist">
          {content.items.map((item, index) => (
            <button
              key={`${item.title}-${index}`}
              type="button"
              className={`admin-cms-pill-tab${activeIndex === index ? " is-active" : ""}`}
              onClick={() => setActiveIndex(index)}
            >
              Card {index + 1}
            </button>
          ))}
        </div>

        {activeItem ? (
          <div className="admin-cms-launch-form">
            <ImageUploadField
              label="Card image"
              value={activeItem.image}
              onChange={(image) =>
                onChange({
                  ...content,
                  items: updateItem(content.items, activeIndex, { image }),
                })
              }
            />
            <label className="admin-cms-field">
              <span>Card title</span>
              <input
                type="text"
                value={activeItem.title}
                onChange={(event) =>
                  onChange({
                    ...content,
                    items: updateItem(content.items, activeIndex, {
                      title: event.target.value,
                    }),
                  })
                }
              />
            </label>
            <label className="admin-cms-field">
              <span>Card text</span>
              <textarea
                rows={4}
                value={activeItem.text}
                onChange={(event) =>
                  onChange({
                    ...content,
                    items: updateItem(content.items, activeIndex, {
                      text: event.target.value,
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
