"use client";

import dynamic from "next/dynamic";
import { useRef, useState } from "react";
import type { VideoSlidersContent } from "@/lib/cms/home-page";
import type { HomeVideoSection } from "@/lib/homeSliders";
import { mediaUrl } from "@/lib/media";
import { getVideoUrlIssue } from "@/lib/video-url";
import { uploadAdminImage } from "../upload-image";

import "swiper/css";
import "swiper/css/effect-fade";
import "swiper/css/pagination";

const VideoSliderSection = dynamic(
  () =>
    import("@/components/home/VideoSliderSection").then(
      (module) => module.VideoSliderSection,
    ),
  { ssr: false },
);

type VideoSlidersEditorProps = {
  content: VideoSlidersContent;
  onChange: (value: VideoSlidersContent) => void;
};

function updateSection(
  sections: HomeVideoSection[],
  index: number,
  patch: Partial<HomeVideoSection>,
): HomeVideoSection[] {
  return sections.map((section, sectionIndex) =>
    sectionIndex === index ? { ...section, ...patch } : section,
  );
}

function ThumbImageUpload({
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
    <div className="admin-cms-video-thumb">
      <div className="admin-cms-video-thumb__preview">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img src={mediaUrl(value)} alt={label} />
      </div>
      <div className="admin-cms-video-thumb__fields">
        <strong>{label}</strong>
        <input
          type="text"
          value={value}
          onChange={(event) => onChange(event.target.value)}
          placeholder="Image URL"
        />
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
          className="admin-dash__btn admin-dash__btn--light"
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

function SliderSectionForm({
  section,
  onChange,
}: {
  section: HomeVideoSection;
  onChange: (section: HomeVideoSection) => void;
}) {
  const primaryCta = section.ctas[0];
  const exploreCta = section.ctas.find((cta) => cta.className.includes("link-cucina"));

  function updateThumb(
    thumbIndex: number,
    patch: Partial<HomeVideoSection["thumbSlides"][number]>,
  ) {
    onChange({
      ...section,
      thumbSlides: section.thumbSlides.map((thumb, index) =>
        index === thumbIndex ? { ...thumb, ...patch } : thumb,
      ),
    });
  }

  function updateSlide(
    slideIndex: number,
    patch: Partial<HomeVideoSection["slides"][number]>,
  ) {
    onChange({
      ...section,
      slides: section.slides.map((slide, index) =>
        index === slideIndex ? { ...slide, ...patch } : slide,
      ),
    });
  }

  return (
    <div className="admin-cms-video-form">
      <label className="admin-cms-field">
        <span>Section title</span>
        <input
          type="text"
          value={section.title}
          onChange={(event) => onChange({ ...section, title: event.target.value })}
        />
      </label>

      <label className="admin-cms-field">
        <span>Description</span>
        <textarea
          rows={3}
          value={section.description}
          onChange={(event) =>
            onChange({ ...section, description: event.target.value })
          }
        />
      </label>

      {primaryCta ? (
        <div className="admin-cms-video-form__group">
          <h4>Primary button</h4>
          <label className="admin-cms-field">
            <span>Label</span>
            <input
              type="text"
              value={primaryCta.label}
              onChange={(event) =>
                onChange({
                  ...section,
                  ctas: section.ctas.map((cta, index) =>
                    index === 0 ? { ...cta, label: event.target.value } : cta,
                  ),
                })
              }
            />
          </label>
          <label className="admin-cms-field">
            <span>Link</span>
            <input
              type="text"
              value={primaryCta.href}
              onChange={(event) =>
                onChange({
                  ...section,
                  ctas: section.ctas.map((cta, index) =>
                    index === 0 ? { ...cta, href: event.target.value } : cta,
                  ),
                })
              }
            />
          </label>
        </div>
      ) : null}

      {exploreCta ? (
        <div className="admin-cms-video-form__group">
          <h4>Explore button</h4>
          <p className="admin-cms-video-form__hint">
            The explore label is generated from the active thumb title, for example
            &quot;Explore Poetica&quot;.
          </p>
          <label className="admin-cms-field">
            <span>Fallback label</span>
            <input type="text" value={exploreCta.label} disabled />
          </label>
        </div>
      ) : null}

      <div className="admin-cms-video-form__group">
        <h4>Thumb slides</h4>
        <p className="admin-cms-video-form__hint">
          Thumb images upload to Supabase Storage. Video fields need a direct file
          link ending in <code>.mp4</code>, <code>.webm</code>, or <code>.m4v</code> —
          not a Pexels/YouTube page URL.
        </p>
        {section.thumbSlides.map((thumb, thumbIndex) => (
          <div key={`${thumb.title}-${thumbIndex}`} className="admin-cms-video-slide-card">
            <label className="admin-cms-field">
              <span>Thumb title</span>
              <input
                type="text"
                value={thumb.title}
                onChange={(event) => updateThumb(thumbIndex, { title: event.target.value })}
              />
            </label>
            <label className="admin-cms-field">
              <span>Thumb link</span>
              <input
                type="text"
                value={thumb.link}
                onChange={(event) => updateThumb(thumbIndex, { link: event.target.value })}
              />
            </label>
            <ThumbImageUpload
              label={thumb.title}
              value={thumb.image}
              onChange={(image) => updateThumb(thumbIndex, { image })}
            />
            <div className="admin-cms-video-form__videos">
              <label className="admin-cms-field">
                <span>Desktop video URL</span>
                <input
                  type="text"
                  value={section.slides[thumbIndex]?.desktop ?? ""}
                  placeholder="https://…/video.mp4"
                  onChange={(event) =>
                    updateSlide(thumbIndex, { desktop: event.target.value })
                  }
                />
                {getVideoUrlIssue(section.slides[thumbIndex]?.desktop ?? "") ? (
                  <p className="admin-cms-error">
                    {getVideoUrlIssue(section.slides[thumbIndex]?.desktop ?? "")}
                  </p>
                ) : null}
              </label>
              <label className="admin-cms-field">
                <span>Mobile video URL</span>
                <input
                  type="text"
                  value={section.slides[thumbIndex]?.mobile ?? ""}
                  placeholder="https://…/video-mobile.mp4 (optional)"
                  onChange={(event) =>
                    updateSlide(thumbIndex, { mobile: event.target.value })
                  }
                />
                {getVideoUrlIssue(section.slides[thumbIndex]?.mobile ?? "") ? (
                  <p className="admin-cms-error">
                    {getVideoUrlIssue(section.slides[thumbIndex]?.mobile ?? "")}
                  </p>
                ) : null}
              </label>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export function VideoSlidersEditor({ content, onChange }: VideoSlidersEditorProps) {
  const [activeIndex, setActiveIndex] = useState(0);
  const activeSection = content.sections[activeIndex];

  if (!activeSection) return null;

  return (
    <div className="admin-cms-editor admin-cms-editor--video">
      <div className="admin-cms-video-tabs" role="tablist" aria-label="Video sliders">
        {content.sections.map((section, index) => (
          <button
            key={section.title}
            type="button"
            role="tab"
            aria-selected={activeIndex === index}
            className={`admin-dash__view-tab admin-dash__view-tab--sub${
              activeIndex === index ? " is-active" : ""
            }`}
            onClick={() => setActiveIndex(index)}
          >
            {section.title}
          </button>
        ))}
      </div>

      <div className="admin-cms-editor__video-layout">
        <div className="admin-cms-preview admin-cms-preview--video">
          <div className="admin-cms-preview__video-scale">
            <VideoSliderSection
              key={`${activeSection.title}-${activeIndex}`}
              section={activeSection}
              index={activeIndex}
            />
          </div>
        </div>

        <SliderSectionForm
          section={activeSection}
          onChange={(section) =>
            onChange({
              sections: updateSection(content.sections, activeIndex, section),
            })
          }
        />
      </div>
    </div>
  );
}
