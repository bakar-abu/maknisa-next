"use client";

import { useRef, useState } from "react";
import { LaunchBoxesSection } from "@/components/home/LaunchBoxesSection";
import type { LaunchBoxesContent } from "@/lib/cms/home-page";
import type { LaunchBox } from "@/lib/homeSections";
import { mediaUrl } from "@/lib/media";
import { uploadAdminImage } from "../upload-image";

type LaunchBoxesEditorProps = {
  content: LaunchBoxesContent;
  onChange: (value: LaunchBoxesContent) => void;
};

function updateBox(
  boxes: LaunchBox[],
  index: number,
  patch: Partial<LaunchBox>,
): LaunchBox[] {
  return boxes.map((box, boxIndex) =>
    boxIndex === index ? { ...box, ...patch } : box,
  );
}

function BoxImageUpload({
  label,
  value,
  onChange,
}: {
  label: string;
  value: string;
  onChange: (url: string) => void;
}) {
  const inputRef = useRef<HTMLInputElement>(null);
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function handleUpload(file: File) {
    setUploading(true);
    setError(null);
    try {
      const url = await uploadAdminImage(file);
      onChange(url);
    } catch (uploadError) {
      setError(uploadError instanceof Error ? uploadError.message : "Upload failed.");
    } finally {
      setUploading(false);
    }
  }

  return (
    <div className="admin-cms-media-card">
      <div className="admin-cms-media-card__preview">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img src={mediaUrl(value)} alt={label} />
      </div>
      <div className="admin-cms-media-card__body">
        <label className="admin-cms-field">
          <span>Image URL</span>
          <input
            type="text"
            value={value}
            onChange={(event) => onChange(event.target.value)}
            placeholder="/media/... or https://..."
          />
        </label>
        <input
          ref={inputRef}
          type="file"
          accept="image/*"
          hidden
          onChange={(event) => {
            const file = event.target.files?.[0];
            if (file) void handleUpload(file);
            event.target.value = "";
          }}
        />
        <button
          type="button"
          className="admin-dash__btn admin-dash__btn--dark admin-cms-media-card__upload"
          onClick={() => inputRef.current?.click()}
          disabled={uploading}
        >
          {uploading ? "Uploading…" : "Upload image"}
        </button>
        {error ? <p className="admin-cms-error">{error}</p> : null}
      </div>
    </div>
  );
}

function LaunchBoxForm({
  box,
  onChange,
}: {
  box: LaunchBox;
  onChange: (box: LaunchBox) => void;
}) {
  return (
    <div className="admin-cms-launch-form">
      <BoxImageUpload
        label={box.title}
        value={box.image}
        onChange={(image) => onChange({ ...box, image })}
      />

      <div className="admin-cms-form-grid">
        <label className="admin-cms-field admin-cms-field--full">
          <span>Title</span>
          <input
            type="text"
            value={box.title}
            onChange={(event) => onChange({ ...box, title: event.target.value })}
          />
        </label>

        <label className="admin-cms-field admin-cms-field--full">
          <span>Description</span>
          <textarea
            rows={4}
            value={box.abstractHtml}
            onChange={(event) => onChange({ ...box, abstractHtml: event.target.value })}
            placeholder="<p>Your HTML copy…</p>"
          />
          <small>Supports basic HTML such as &lt;strong&gt; and &lt;p&gt;.</small>
        </label>

        <label className="admin-cms-field">
          <span>Button label</span>
          <input
            type="text"
            value={box.cta.label}
            onChange={(event) =>
              onChange({
                ...box,
                cta: { ...box.cta, label: event.target.value },
              })
            }
          />
        </label>

        <label className="admin-cms-field">
          <span>Button link</span>
          <input
            type="text"
            value={box.cta.href}
            onChange={(event) =>
              onChange({
                ...box,
                cta: { ...box.cta, href: event.target.value },
              })
            }
          />
        </label>
      </div>
    </div>
  );
}

export function LaunchBoxesEditor({ content, onChange }: LaunchBoxesEditorProps) {
  const [activeIndex, setActiveIndex] = useState(0);
  const activeBox = content.boxes[activeIndex];

  if (!activeBox) return null;

  return (
    <div className="admin-cms-editor admin-cms-editor--launch">
      <div className="admin-cms-editor-pane admin-cms-editor-pane--preview">
        <div className="admin-cms-editor-pane__head">
          <div>
            <span className="admin-cms-editor-pane__badge">Live preview</span>
            <h4>Homepage launch boxes</h4>
            <p>All three cards update instantly. The selected box is highlighted in orange.</p>
          </div>
        </div>

        <div className="admin-cms-preview-chrome">
          <div className="admin-cms-preview-chrome__bar">
            <span className="admin-cms-preview-chrome__dots" aria-hidden="true">
              <i />
              <i />
              <i />
            </span>
            <div className="admin-cms-preview-chrome__url">maknisa.com / homepage</div>
          </div>
          <div className="admin-cms-preview admin-cms-preview--launch">
            <div className="home-2025 admin-cms-preview__site">
              <LaunchBoxesSection
                boxes={content.boxes}
                activeIndex={activeIndex}
              />
            </div>
          </div>
        </div>
      </div>

      <div className="admin-cms-editor-pane admin-cms-editor-pane--form">
        <div className="admin-cms-editor-pane__head">
          <div>
            <span className="admin-cms-editor-pane__badge admin-cms-editor-pane__badge--muted">
              Editor
            </span>
            <h4>Edit box</h4>
            <p>Choose a card and update its image, copy, and button.</p>
          </div>
        </div>

        <div
          className="admin-cms-pill-tabs"
          role="tablist"
          aria-label="Launch boxes"
        >
          {content.boxes.map((box, index) => (
            <button
              key={`${box.title}-${index}`}
              type="button"
              role="tab"
              aria-selected={activeIndex === index}
              className={`admin-cms-pill-tab${activeIndex === index ? " is-active" : ""}`}
              onClick={() => setActiveIndex(index)}
            >
              {box.title}
            </button>
          ))}
        </div>

        <div className="admin-cms-form-card">
          <LaunchBoxForm
            box={activeBox}
            onChange={(box) =>
              onChange({
                boxes: updateBox(content.boxes, activeIndex, box),
              })
            }
          />
        </div>
      </div>
    </div>
  );
}
