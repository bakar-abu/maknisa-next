"use client";

import { useState, type ReactNode } from "react";
import type {
  CatalogueAppointmentCtaContent,
  CatalogueIntroContent,
  CatalogueRelatedSectionContent,
  CatalogueServiceCardsContent,
} from "@/lib/cms/catalogue-page";
import { ImageUploadField } from "./shared/ImageUploadField";

type EditorProps<T> = {
  content: T;
  onChange: (value: T) => void;
};

function Field({ label, children }: { label: string; children: ReactNode }) {
  return (
    <label className="admin-cms-field">
      <span>{label}</span>
      {children}
    </label>
  );
}

export function CatalogueIntroEditor({
  content,
  onChange,
}: EditorProps<CatalogueIntroContent>) {
  return (
    <div className="admin-cms-launch-form">
      <Field label="Page title">
        <input
          type="text"
          value={content.title}
          onChange={(e) => onChange({ ...content, title: e.target.value })}
        />
      </Field>
      <Field label="Intro paragraph">
        <textarea
          rows={4}
          value={content.intro}
          onChange={(e) => onChange({ ...content, intro: e.target.value })}
        />
      </Field>
    </div>
  );
}

export function CatalogueServiceCardsEditor({
  content,
  onChange,
}: EditorProps<CatalogueServiceCardsContent>) {
  const [activeIndex, setActiveIndex] = useState(0);
  const activeCard = content.cards[activeIndex];

  return (
    <div className="admin-cms-launch-form">
      <div className="admin-cms-pill-tabs">
        {content.cards.map((card, index) => (
          <button
            key={card.slug}
            type="button"
            className={`admin-cms-pill-tab${activeIndex === index ? " is-active" : ""}`}
            onClick={() => setActiveIndex(index)}
          >
            {card.label}
          </button>
        ))}
      </div>
      {activeCard ? (
        <>
          <Field label="Service slug">
            <input type="text" value={activeCard.slug} readOnly />
          </Field>
          <Field label="Card label">
            <input
              type="text"
              value={activeCard.label}
              onChange={(e) =>
                onChange({
                  ...content,
                  cards: content.cards.map((card, index) =>
                    index === activeIndex ? { ...card, label: e.target.value } : card,
                  ),
                })
              }
            />
          </Field>
          <Field label="Service page link">
            <input
              type="text"
              value={activeCard.href}
              onChange={(e) =>
                onChange({
                  ...content,
                  cards: content.cards.map((card, index) =>
                    index === activeIndex ? { ...card, href: e.target.value } : card,
                  ),
                })
              }
            />
          </Field>
          <Field label="Download link">
            <input
              type="text"
              value={activeCard.downloadHref}
              onChange={(e) =>
                onChange({
                  ...content,
                  cards: content.cards.map((card, index) =>
                    index === activeIndex
                      ? { ...card, downloadHref: e.target.value }
                      : card,
                  ),
                })
              }
            />
          </Field>
          <ImageUploadField
            label="Primary image"
            value={activeCard.image}
            onChange={(image) =>
              onChange({
                ...content,
                cards: content.cards.map((card, index) =>
                  index === activeIndex ? { ...card, image } : card,
                ),
              })
            }
          />
          <ImageUploadField
            label="Hover image"
            value={activeCard.hoverImage}
            onChange={(hoverImage) =>
              onChange({
                ...content,
                cards: content.cards.map((card, index) =>
                  index === activeIndex ? { ...card, hoverImage } : card,
                ),
              })
            }
          />
        </>
      ) : null}
    </div>
  );
}

export function CatalogueAppointmentCtaEditor({
  content,
  onChange,
}: EditorProps<CatalogueAppointmentCtaContent>) {
  return (
    <div className="admin-cms-launch-form">
      <Field label="Lead line">
        <input
          type="text"
          value={content.lead}
          onChange={(e) => onChange({ ...content, lead: e.target.value })}
        />
      </Field>
      <Field label="Supporting text">
        <textarea
          rows={4}
          value={content.text}
          onChange={(e) => onChange({ ...content, text: e.target.value })}
        />
      </Field>
      <Field label="Button label">
        <input
          type="text"
          value={content.ctaLabel}
          onChange={(e) => onChange({ ...content, ctaLabel: e.target.value })}
        />
      </Field>
      <Field label="Button link">
        <input
          type="text"
          value={content.ctaHref}
          onChange={(e) => onChange({ ...content, ctaHref: e.target.value })}
        />
      </Field>
    </div>
  );
}

export function CatalogueRelatedSectionEditor({
  content,
  onChange,
}: EditorProps<CatalogueRelatedSectionContent>) {
  return (
    <div className="admin-cms-launch-form">
      <label className="admin-cms-field admin-cms-field--inline">
        <input
          type="checkbox"
          checked={content.enabled}
          onChange={(e) => onChange({ ...content, enabled: e.target.checked })}
        />
        <span>Show related magazine section</span>
      </label>
      <Field label="Section title">
        <input
          type="text"
          value={content.title}
          onChange={(e) => onChange({ ...content, title: e.target.value })}
        />
      </Field>
      <Field label="Section subtitle">
        <textarea
          rows={3}
          value={content.subtitle}
          onChange={(e) => onChange({ ...content, subtitle: e.target.value })}
        />
      </Field>
      <Field label="View all label">
        <input
          type="text"
          value={content.viewAllLabel}
          onChange={(e) => onChange({ ...content, viewAllLabel: e.target.value })}
        />
      </Field>
      <Field label="View all link">
        <input
          type="text"
          value={content.viewAllHref}
          onChange={(e) => onChange({ ...content, viewAllHref: e.target.value })}
        />
      </Field>
    </div>
  );
}
