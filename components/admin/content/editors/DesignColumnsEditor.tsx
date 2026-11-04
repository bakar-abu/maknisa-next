"use client";

import { useState } from "react";
import { DesignColumnsSection } from "@/components/home/DesignColumnsSection";
import type { DesignColumnsContent } from "@/lib/cms/home-page";
import type { DesignColumn } from "@/lib/homeSections";
import { ImageUploadField } from "./shared/ImageUploadField";

type DesignColumnsEditorProps = {
  content: DesignColumnsContent;
  onChange: (value: DesignColumnsContent) => void;
};

function updateColumn(
  columns: DesignColumn[],
  index: number,
  patch: Partial<DesignColumn>,
): DesignColumn[] {
  return columns.map((column, columnIndex) =>
    columnIndex === index ? { ...column, ...patch } : column,
  );
}

export function DesignColumnsEditor({ content, onChange }: DesignColumnsEditorProps) {
  const [activeIndex, setActiveIndex] = useState(0);
  const activeColumn = content.columns[activeIndex];

  if (!activeColumn) return null;

  return (
    <div className="admin-cms-editor admin-cms-editor--launch">
      <div className="admin-cms-editor-pane admin-cms-editor-pane--preview">
        <div className="admin-cms-editor-pane__head">
          <div>
            <span className="admin-cms-editor-pane__badge">Live preview</span>
            <h4>Design columns</h4>
            <p>Budget, ideas, and dealer expertise carousel.</p>
          </div>
        </div>
        <div className="admin-cms-preview admin-cms-preview--launch">
          <div className="home-2025 admin-cms-preview__site">
            <DesignColumnsSection content={content} />
          </div>
        </div>
      </div>

      <div className="admin-cms-editor-pane admin-cms-editor-pane--form">
        <div className="admin-cms-editor-pane__head">
          <div>
            <span className="admin-cms-editor-pane__badge admin-cms-editor-pane__badge--muted">
              Editor
            </span>
            <h4>Edit column</h4>
          </div>
        </div>

        <div className="admin-cms-pill-tabs" role="tablist">
          {content.columns.map((column, index) => (
            <button
              key={`${column.title}-${index}`}
              type="button"
              role="tab"
              aria-selected={activeIndex === index}
              className={`admin-cms-pill-tab${activeIndex === index ? " is-active" : ""}`}
              onClick={() => setActiveIndex(index)}
            >
              {column.title}
            </button>
          ))}
        </div>

        <div className="admin-cms-launch-form">
          <ImageUploadField
            label="Column image"
            value={activeColumn.image}
            onChange={(image) =>
              onChange({
                columns: updateColumn(content.columns, activeIndex, { image }),
              })
            }
          />
          <label className="admin-cms-field">
            <span>Title</span>
            <input
              type="text"
              value={activeColumn.title}
              onChange={(event) =>
                onChange({
                  columns: updateColumn(content.columns, activeIndex, {
                    title: event.target.value,
                  }),
                })
              }
            />
          </label>
          <label className="admin-cms-field">
            <span>Body HTML</span>
            <textarea
              rows={5}
              value={activeColumn.textHtml}
              onChange={(event) =>
                onChange({
                  columns: updateColumn(content.columns, activeIndex, {
                    textHtml: event.target.value,
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
