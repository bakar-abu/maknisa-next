"use client";

import { useEffect, useRef, useState } from "react";
import type {
  BespokeTextContent,
  HeroIntroContent,
  HomeSectionId,
  IntroTextContent,
} from "@/lib/cms/home-page";
import {
  asActionsSiteContent,
  asBespokeTextContent,
  asDesignColumnsContent,
  asEnvironmentVideoContent,
  asHeroContent,
  asIntroTextContent,
  asMagazineContent,
  asNewsScrollingContent,
  asVideoSlidersContent,
  asLaunchBoxesContent,
} from "@/lib/cms/home-page";
import { uploadAdminImage } from "./upload-image";
import { ActionsSiteEditor } from "./editors/ActionsSiteEditor";
import { DesignColumnsEditor } from "./editors/DesignColumnsEditor";
import { EnvironmentVideoEditor } from "./editors/EnvironmentVideoEditor";
import { LaunchBoxesEditor } from "./editors/LaunchBoxesEditor";
import { MagazineEditor } from "./editors/MagazineEditor";
import { NewsScrollingEditor } from "./editors/NewsScrollingEditor";
import { VideoSlidersEditor } from "./editors/VideoSlidersEditor";
import { ConfirmSaveDialog } from "./ConfirmSaveDialog";

type SectionEditModalProps = {
  open: boolean;
  sectionId: HomeSectionId;
  sectionLabel: string;
  content: unknown;
  saving?: boolean;
  onClose: () => void;
  onSave: (content: unknown) => Promise<void>;
};

async function uploadImage(file: File): Promise<string> {
  return uploadAdminImage(file);
}

function HeroEditor({
  content,
  onChange,
}: {
  content: HeroIntroContent;
  onChange: (value: HeroIntroContent) => void;
}) {
  const inputRef = useRef<HTMLInputElement>(null);
  const [uploading, setUploading] = useState(false);
  const [uploadError, setUploadError] = useState<string | null>(null);

  async function handleUpload(file: File) {
    setUploading(true);
    setUploadError(null);
    try {
      const url = await uploadImage(file);
      onChange({ ...content, heroImage: url });
    } catch (error) {
      setUploadError(error instanceof Error ? error.message : "Upload failed.");
    } finally {
      setUploading(false);
    }
  }

  return (
    <div className="admin-cms-editor">
      <div className="admin-cms-preview admin-cms-preview--hero">
        <section className="sn_intro_video admin-cms-preview__hero-frame" aria-label="Hero preview">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            className="desktop mk-hero-section__img"
            src={content.heroImage}
            alt={content.heroImageAlt}
          />
          <span className="sn_btn_grow _text_light admin-cms-preview__hero-cta">
            <span className="tx">{content.ctaLabel}</span>
          </span>
        </section>
      </div>

      <div className="admin-cms-editor__fields">
        <div className="admin-cms-upload">
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
            className="admin-dash__btn admin-dash__btn--dark"
            onClick={() => inputRef.current?.click()}
            disabled={uploading}
          >
            {uploading ? "Uploading…" : "Upload background image"}
          </button>
          {uploadError ? <p className="admin-cms-error">{uploadError}</p> : null}
        </div>

        <label className="admin-cms-field">
          <span>Image alt text</span>
          <input
            type="text"
            value={content.heroImageAlt}
            onChange={(event) =>
              onChange({ ...content, heroImageAlt: event.target.value })
            }
          />
        </label>

        <label className="admin-cms-field">
          <span>CTA label</span>
          <input
            type="text"
            value={content.ctaLabel}
            onChange={(event) =>
              onChange({ ...content, ctaLabel: event.target.value })
            }
          />
        </label>

        <label className="admin-cms-field">
          <span>CTA link</span>
          <input
            type="text"
            value={content.ctaHref}
            onChange={(event) =>
              onChange({ ...content, ctaHref: event.target.value })
            }
          />
        </label>
      </div>
    </div>
  );
}

function IntroTextEditor({
  content,
  onChange,
}: {
  content: IntroTextContent;
  onChange: (value: IntroTextContent) => void;
}) {
  return (
    <div className="admin-cms-editor">
      <div className="admin-cms-preview admin-cms-preview--text">
        <section className="sn_box-txt py-40 py-md-80">
          <div className="container-fluid">
            <div className="row">
              <div className="col-12 col-lg-10 mx-auto text-center">
                <h2
                  className="h2 mb-30"
                  dangerouslySetInnerHTML={{ __html: content.headingHtml }}
                />
                <div className="sn_paragraph_xl text-center">{content.paragraph}</div>
              </div>
            </div>
          </div>
        </section>
      </div>

      <div className="admin-cms-editor__fields">
        <label className="admin-cms-field">
          <span>Heading HTML</span>
          <textarea
            rows={3}
            value={content.headingHtml}
            onChange={(event) =>
              onChange({ ...content, headingHtml: event.target.value })
            }
          />
        </label>
        <label className="admin-cms-field">
          <span>Paragraph</span>
          <textarea
            rows={3}
            value={content.paragraph}
            onChange={(event) =>
              onChange({ ...content, paragraph: event.target.value })
            }
          />
        </label>
      </div>
    </div>
  );
}

function BespokeTextEditor({
  content,
  onChange,
}: {
  content: BespokeTextContent;
  onChange: (value: BespokeTextContent) => void;
}) {
  return (
    <div className="admin-cms-editor">
      <div className="admin-cms-preview admin-cms-preview--text">
        <section className="sn_box-txt py-40 py-md-80">
          <div className="container-fluid text-center">
            <h2
              className="h2 mb-20"
              dangerouslySetInnerHTML={{ __html: content.titleHtml }}
            />
            <p>{content.subtitle}</p>
          </div>
        </section>
      </div>

      <div className="admin-cms-editor__fields">
        <label className="admin-cms-field">
          <span>Title HTML</span>
          <textarea
            rows={3}
            value={content.titleHtml}
            onChange={(event) =>
              onChange({ ...content, titleHtml: event.target.value })
            }
          />
        </label>
        <label className="admin-cms-field">
          <span>Subtitle</span>
          <input
            type="text"
            value={content.subtitle}
            onChange={(event) =>
              onChange({ ...content, subtitle: event.target.value })
            }
          />
        </label>
      </div>
    </div>
  );
}

function PlaceholderEditor({ sectionLabel }: { sectionLabel: string }) {
  return (
    <div className="admin-cms-editor__placeholder">
      <p>
        The full visual editor for <strong>{sectionLabel}</strong> will be added
        next. This section still appears on the live homepage using the current
        site content.
      </p>
    </div>
  );
}

function normalizeSectionDraft(sectionId: HomeSectionId, content: unknown): unknown {
  switch (sectionId) {
    case "hero-intro":
      return asHeroContent(content);
    case "intro-text":
      return asIntroTextContent(content);
    case "bespoke-text":
      return asBespokeTextContent(content);
    case "video-sliders":
      return asVideoSlidersContent(content);
    case "launch-boxes":
      return asLaunchBoxesContent(content);
    case "design-columns":
      return asDesignColumnsContent(content);
    case "news-scrolling":
      return asNewsScrollingContent(content);
    case "environment-video":
      return asEnvironmentVideoContent(content);
    case "actions-site":
      return asActionsSiteContent(content);
    case "magazine":
      return asMagazineContent(content);
    default:
      return content;
  }
}

const WIDE_MODAL_SECTIONS: HomeSectionId[] = [
  "video-sliders",
  "launch-boxes",
  "design-columns",
  "news-scrolling",
  "environment-video",
  "actions-site",
  "magazine",
];

const EDITABLE_SECTIONS: HomeSectionId[] = [
  "hero-intro",
  "intro-text",
  "bespoke-text",
  "video-sliders",
  "launch-boxes",
  "design-columns",
  "news-scrolling",
  "environment-video",
  "actions-site",
  "magazine",
];

export function SectionEditModal({
  open,
  sectionId,
  sectionLabel,
  content,
  saving = false,
  onClose,
  onSave,
}: SectionEditModalProps) {
  const [draft, setDraft] = useState<unknown>(() =>
    normalizeSectionDraft(sectionId, content),
  );
  const [confirmOpen, setConfirmOpen] = useState(false);

  useEffect(() => {
    if (open) {
      setDraft(normalizeSectionDraft(sectionId, content));
    }
  }, [open, sectionId, content]);

  if (!open) return null;

  const hero = asHeroContent(draft);
  const intro = asIntroTextContent(draft);
  const bespoke = asBespokeTextContent(draft);
  const videoSliders = asVideoSlidersContent(draft);
  const launchBoxesContent = asLaunchBoxesContent(draft);
  const designColumnsContent = asDesignColumnsContent(draft);
  const newsScrollingContent = asNewsScrollingContent(draft);
  const environmentVideoContent = asEnvironmentVideoContent(draft);
  const actionsSiteContent = asActionsSiteContent(draft);
  const magazineContent = asMagazineContent(draft);
  const isWideModal = WIDE_MODAL_SECTIONS.includes(sectionId);
  const isEditable = EDITABLE_SECTIONS.includes(sectionId);

  async function handleConfirmSave() {
    await onSave(draft);
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
          className={`admin-cms-modal__panel${isWideModal ? " admin-cms-modal__panel--wide" : ""}`}
          role="dialog"
          aria-modal="true"
        >
          <header className="admin-cms-modal__header">
            <div>
              <p className="admin-cms-modal__eyebrow">Edit section</p>
              <h3>{sectionLabel}</h3>
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

          <div className="admin-cms-modal__body">
            {sectionId === "hero-intro" ? (
              <HeroEditor content={hero} onChange={setDraft} />
            ) : sectionId === "intro-text" ? (
              <IntroTextEditor content={intro} onChange={setDraft} />
            ) : sectionId === "bespoke-text" ? (
              <BespokeTextEditor content={bespoke} onChange={setDraft} />
            ) : sectionId === "video-sliders" ? (
              <VideoSlidersEditor
                content={videoSliders}
                onChange={(value) => setDraft(value)}
              />
            ) : sectionId === "launch-boxes" ? (
              <LaunchBoxesEditor content={launchBoxesContent} onChange={setDraft} />
            ) : sectionId === "design-columns" ? (
              <DesignColumnsEditor
                content={designColumnsContent}
                onChange={(value) => setDraft(value)}
              />
            ) : sectionId === "news-scrolling" ? (
              <NewsScrollingEditor
                content={newsScrollingContent}
                onChange={(value) => setDraft(value)}
              />
            ) : sectionId === "environment-video" ? (
              <EnvironmentVideoEditor
                content={environmentVideoContent}
                onChange={(value) => setDraft(value)}
              />
            ) : sectionId === "actions-site" ? (
              <ActionsSiteEditor
                content={actionsSiteContent}
                onChange={(value) => setDraft(value)}
              />
            ) : sectionId === "magazine" ? (
              <MagazineEditor
                content={magazineContent}
                onChange={(value) => setDraft(value)}
              />
            ) : (
              <PlaceholderEditor sectionLabel={sectionLabel} />
            )}
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
            {isEditable ? (
              <button
                type="button"
                className="admin-dash__btn admin-dash__btn--dark"
                onClick={() => setConfirmOpen(true)}
                disabled={saving}
              >
                Save section
              </button>
            ) : null}
          </footer>
        </div>
      </div>

      <ConfirmSaveDialog
        open={confirmOpen}
        title="Save section changes?"
        message={`This will update ${sectionLabel} on the live Maknisa homepage.`}
        saving={saving}
        onCancel={() => setConfirmOpen(false)}
        onConfirm={() => void handleConfirmSave()}
      />
    </>
  );
}
