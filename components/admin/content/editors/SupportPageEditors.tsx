"use client";

import { useState, type ReactNode } from "react";
import type {
  AfterSalesIntroContent,
  AfterSalesRegisterBannerContent,
  AfterSalesWarrantyNavContent,
  AppointmentAsideContent,
  AppointmentIntroContent,
  CustomizeIntroContent,
  FormMessagesContent,
  WarrantyBlockContent,
} from "@/lib/cms/support-page";
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

export function AfterSalesIntroEditor({
  content,
  onChange,
}: EditorProps<AfterSalesIntroContent>) {
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
      <Field label="Customer care link label">
        <input
          type="text"
          value={content.customerCareLabel}
          onChange={(e) => onChange({ ...content, customerCareLabel: e.target.value })}
        />
      </Field>
      <Field label="Customer care link URL">
        <input
          type="text"
          value={content.customerCareHref}
          onChange={(e) => onChange({ ...content, customerCareHref: e.target.value })}
        />
      </Field>
    </div>
  );
}

export function AfterSalesRegisterBannerEditor({
  content,
  onChange,
}: EditorProps<AfterSalesRegisterBannerContent>) {
  return (
    <div className="admin-cms-launch-form">
      <Field label="Banner title">
        <input
          type="text"
          value={content.title}
          onChange={(e) => onChange({ ...content, title: e.target.value })}
        />
      </Field>
      <Field label="Banner body">
        <textarea
          rows={4}
          value={content.body}
          onChange={(e) => onChange({ ...content, body: e.target.value })}
        />
      </Field>
      <Field label="CTA label">
        <input
          type="text"
          value={content.cta.label}
          onChange={(e) =>
            onChange({ ...content, cta: { ...content.cta, label: e.target.value } })
          }
        />
      </Field>
      <Field label="CTA link">
        <input
          type="text"
          value={content.cta.href}
          onChange={(e) =>
            onChange({ ...content, cta: { ...content.cta, href: e.target.value } })
          }
        />
      </Field>
    </div>
  );
}

export function AfterSalesWarrantyNavEditor({
  content,
  onChange,
}: EditorProps<AfterSalesWarrantyNavContent>) {
  return (
    <div className="admin-cms-launch-form">
      <Field label="Anchor question">
        <input
          type="text"
          value={content.anchorQuestion}
          onChange={(e) => onChange({ ...content, anchorQuestion: e.target.value })}
        />
      </Field>
      {content.anchors.map((anchor, index) => (
        <div key={`${anchor.label}-${index}`} className="admin-cms-video-slide-card">
          <Field label={`Link ${index + 1} label`}>
            <input
              type="text"
              value={anchor.label}
              onChange={(e) =>
                onChange({
                  ...content,
                  anchors: content.anchors.map((item, i) =>
                    i === index ? { ...item, label: e.target.value } : item,
                  ),
                })
              }
            />
          </Field>
          <Field label={`Link ${index + 1} anchor ID`}>
            <input
              type="text"
              value={anchor.anchorId}
              onChange={(e) =>
                onChange({
                  ...content,
                  anchors: content.anchors.map((item, i) =>
                    i === index ? { ...item, anchorId: e.target.value } : item,
                  ),
                })
              }
            />
          </Field>
        </div>
      ))}
    </div>
  );
}

export function WarrantyBlockEditor({
  content,
  onChange,
}: EditorProps<WarrantyBlockContent>) {
  const [activeFaqIndex, setActiveFaqIndex] = useState(0);
  const activeFaq = content.faq[activeFaqIndex];

  return (
    <div className="admin-cms-launch-form">
      <ImageUploadField
        label="Section image"
        value={content.image}
        onChange={(image) => onChange({ ...content, image })}
      />
      <Field label="Block title">
        <input
          type="text"
          value={content.title}
          onChange={(e) => onChange({ ...content, title: e.target.value })}
        />
      </Field>
      <Field label="Categories (comma-separated)">
        <input
          type="text"
          value={content.categories.join(", ")}
          onChange={(e) =>
            onChange({
              ...content,
              categories: e.target.value
                .split(",")
                .map((item) => item.trim())
                .filter(Boolean),
            })
          }
        />
      </Field>
      <Field label="Intro paragraph">
        <textarea
          rows={5}
          value={content.intro}
          onChange={(e) => onChange({ ...content, intro: e.target.value })}
        />
      </Field>
      <Field label="Peace of mind title (optional)">
        <input
          type="text"
          value={content.peaceTitle}
          onChange={(e) => onChange({ ...content, peaceTitle: e.target.value })}
        />
      </Field>
      {content.columns.map((column, index) => (
        <div key={`${column.title}-${index}`} className="admin-cms-video-slide-card">
          <Field label={`Column ${index + 1} title`}>
            <input
              type="text"
              value={column.title}
              onChange={(e) =>
                onChange({
                  ...content,
                  columns: content.columns.map((item, i) =>
                    i === index ? { ...item, title: e.target.value } : item,
                  ),
                })
              }
            />
          </Field>
          <Field label={`Column ${index + 1} body`}>
            <textarea
              rows={3}
              value={column.body}
              onChange={(e) =>
                onChange({
                  ...content,
                  columns: content.columns.map((item, i) =>
                    i === index ? { ...item, body: e.target.value } : item,
                  ),
                })
              }
            />
          </Field>
        </div>
      ))}
      <div className="admin-cms-pill-tabs">
        {content.faq.map((item, index) => (
          <button
            key={`${item.title}-${index}`}
            type="button"
            className={`admin-cms-pill-tab${activeFaqIndex === index ? " is-active" : ""}`}
            onClick={() => setActiveFaqIndex(index)}
          >
            FAQ {index + 1}
          </button>
        ))}
      </div>
      {activeFaq ? (
        <>
          <Field label="FAQ title">
            <input
              type="text"
              value={activeFaq.title}
              onChange={(e) =>
                onChange({
                  ...content,
                  faq: content.faq.map((item, i) =>
                    i === activeFaqIndex ? { ...item, title: e.target.value } : item,
                  ),
                })
              }
            />
          </Field>
          <Field label="FAQ body">
            <textarea
              rows={4}
              value={activeFaq.body}
              onChange={(e) =>
                onChange({
                  ...content,
                  faq: content.faq.map((item, i) =>
                    i === activeFaqIndex ? { ...item, body: e.target.value } : item,
                  ),
                })
              }
            />
          </Field>
        </>
      ) : null}
    </div>
  );
}

export function AppointmentIntroEditor({
  content,
  onChange,
}: EditorProps<AppointmentIntroContent>) {
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

export function AppointmentAsideEditor({
  content,
  onChange,
}: EditorProps<AppointmentAsideContent>) {
  return (
    <div className="admin-cms-launch-form">
      <Field label="Aside title">
        <input
          type="text"
          value={content.title}
          onChange={(e) => onChange({ ...content, title: e.target.value })}
        />
      </Field>
      <Field label="Bullet points (one per line)">
        <textarea
          rows={6}
          value={content.items.join("\n")}
          onChange={(e) =>
            onChange({
              ...content,
              items: e.target.value.split("\n").filter(Boolean),
            })
          }
        />
      </Field>
    </div>
  );
}

export function FormMessagesEditor({
  content,
  onChange,
}: EditorProps<FormMessagesContent>) {
  return (
    <div className="admin-cms-launch-form">
      <Field label="Success title">
        <input
          type="text"
          value={content.successTitle}
          onChange={(e) => onChange({ ...content, successTitle: e.target.value })}
        />
      </Field>
      <Field label="Success message">
        <textarea
          rows={4}
          value={content.successMessage}
          onChange={(e) => onChange({ ...content, successMessage: e.target.value })}
        />
      </Field>
    </div>
  );
}

export function CustomizeIntroEditor({
  content,
  onChange,
}: EditorProps<CustomizeIntroContent>) {
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
