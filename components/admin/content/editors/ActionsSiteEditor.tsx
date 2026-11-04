"use client";

import { useState } from "react";
import { ActionsSiteSection } from "@/components/home/ActionsSiteSection";
import type { ActionsSiteContent } from "@/lib/cms/home-page";
import type { ActionSiteItem } from "@/lib/homeSections";
import { ImageUploadField } from "./shared/ImageUploadField";

type ActionsSiteEditorProps = {
  content: ActionsSiteContent;
  onChange: (value: ActionsSiteContent) => void;
};

function updateItem(
  items: ActionSiteItem[],
  index: number,
  patch: Partial<ActionSiteItem>,
): ActionSiteItem[] {
  return items.map((item, itemIndex) =>
    itemIndex === index ? { ...item, ...patch } : item,
  );
}

export function ActionsSiteEditor({ content, onChange }: ActionsSiteEditorProps) {
  const [activeIndex, setActiveIndex] = useState(0);
  const activeItem = content.items[activeIndex];

  if (!activeItem) return null;

  return (
    <div className="admin-cms-editor admin-cms-editor--launch">
      <div className="admin-cms-editor-pane admin-cms-editor-pane--preview">
        <div className="admin-cms-editor-pane__head">
          <div>
            <span className="admin-cms-editor-pane__badge">Live preview</span>
            <h4>Site actions</h4>
          </div>
        </div>
        <div className="admin-cms-preview admin-cms-preview--launch">
          <div className="home-2025 admin-cms-preview__site">
            <ActionsSiteSection content={content} />
          </div>
        </div>
      </div>

      <div className="admin-cms-editor-pane admin-cms-editor-pane--form">
        <div className="admin-cms-editor-pane__head">
          <div>
            <span className="admin-cms-editor-pane__badge admin-cms-editor-pane__badge--muted">
              Editor
            </span>
            <h4>Edit action card</h4>
          </div>
        </div>

        <div className="admin-cms-pill-tabs" role="tablist">
          {content.items.map((item, index) => (
            <button
              key={`${item.title}-${index}`}
              type="button"
              className={`admin-cms-pill-tab${activeIndex === index ? " is-active" : ""}`}
              onClick={() => setActiveIndex(index)}
            >
              {item.title}
            </button>
          ))}
        </div>

        <div className="admin-cms-launch-form">
          <ImageUploadField
            label="Icon image"
            value={activeItem.icon}
            onChange={(icon) =>
              onChange({
                items: updateItem(content.items, activeIndex, { icon }),
              })
            }
          />
          <label className="admin-cms-field">
            <span>Title</span>
            <input
              type="text"
              value={activeItem.title}
              onChange={(event) =>
                onChange({
                  items: updateItem(content.items, activeIndex, {
                    title: event.target.value,
                  }),
                })
              }
            />
          </label>
          <label className="admin-cms-field">
            <span>Description</span>
            <textarea
              rows={3}
              value={activeItem.text}
              onChange={(event) =>
                onChange({
                  items: updateItem(content.items, activeIndex, {
                    text: event.target.value,
                  }),
                })
              }
            />
          </label>
          <label className="admin-cms-field">
            <span>Link URL</span>
            <input
              type="text"
              value={activeItem.href}
              onChange={(event) =>
                onChange({
                  items: updateItem(content.items, activeIndex, {
                    href: event.target.value,
                  }),
                })
              }
            />
          </label>
          <label className="admin-cms-field">
            <span>Link label</span>
            <input
              type="text"
              value={activeItem.linkLabel}
              onChange={(event) =>
                onChange({
                  items: updateItem(content.items, activeIndex, {
                    linkLabel: event.target.value,
                  }),
                })
              }
            />
          </label>
        </div>
      </div>
    </div>
  );
}
