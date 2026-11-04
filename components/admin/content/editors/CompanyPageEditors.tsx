"use client";

import { useState, type ReactNode } from "react";
import type {
  AboutPageContent,
  CommunicationPageContent,
  ContactsPageContent,
  HistoricPageContent,
  PolicyPageContent,
  QualityPageContent,
  StoresPageContent,
} from "@/lib/cms/company-page";
import type { CompanySlug } from "@/lib/company-pages";
import { ImageUploadField } from "./shared/ImageUploadField";

type EditorProps<T> = {
  content: T;
  onChange: (value: T) => void;
};

function Field({
  label,
  children,
}: {
  label: string;
  children: ReactNode;
}) {
  return (
    <label className="admin-cms-field">
      <span>{label}</span>
      {children}
    </label>
  );
}

export function AboutCompanyEditor({ content, onChange }: EditorProps<AboutPageContent>) {
  return (
    <div className="admin-cms-launch-form">
      <ImageUploadField
        label="Hero background image"
        value={content.heroImage}
        onChange={(heroImage) => onChange({ ...content, heroImage })}
      />
      <Field label="Hero subtitle">
        <input
          type="text"
          value={content.heroSubtitle}
          onChange={(e) => onChange({ ...content, heroSubtitle: e.target.value })}
        />
      </Field>
      <Field label="Vertical label">
        <input
          type="text"
          value={content.verticalLabel}
          onChange={(e) => onChange({ ...content, verticalLabel: e.target.value })}
        />
      </Field>
      <Field label="Paragraphs (one per line)">
        <textarea
          rows={6}
          value={content.paragraphs.join("\n\n")}
          onChange={(e) =>
            onChange({
              ...content,
              paragraphs: e.target.value.split("\n\n").filter(Boolean),
            })
          }
        />
      </Field>
      {content.pillars.map((pillar, index) => (
        <div key={pillar.title} className="admin-cms-video-slide-card">
          <Field label={`Pillar ${index + 1} title`}>
            <input
              type="text"
              value={pillar.title}
              onChange={(e) =>
                onChange({
                  ...content,
                  pillars: content.pillars.map((item, i) =>
                    i === index ? { ...item, title: e.target.value } : item,
                  ),
                })
              }
            />
          </Field>
          <Field label={`Pillar ${index + 1} body`}>
            <textarea
              rows={3}
              value={pillar.body}
              onChange={(e) =>
                onChange({
                  ...content,
                  pillars: content.pillars.map((item, i) =>
                    i === index ? { ...item, body: e.target.value } : item,
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

export function CommunicationCompanyEditor({
  content,
  onChange,
}: EditorProps<CommunicationPageContent>) {
  const [activeIndex, setActiveIndex] = useState(0);

  return (
    <div className="admin-cms-launch-form">
      <Field label="Vertical label">
        <input
          type="text"
          value={content.verticalLabel}
          onChange={(e) => onChange({ ...content, verticalLabel: e.target.value })}
        />
      </Field>
      <Field label="Subtitle">
        <input
          type="text"
          value={content.subtitle}
          onChange={(e) => onChange({ ...content, subtitle: e.target.value })}
        />
      </Field>
      <Field label="Intro">
        <textarea
          rows={4}
          value={content.intro}
          onChange={(e) => onChange({ ...content, intro: e.target.value })}
        />
      </Field>
      <ImageUploadField
        label="Banner image"
        value={content.bannerImage}
        onChange={(bannerImage) => onChange({ ...content, bannerImage })}
      />
      <Field label="Press section title">
        <input
          type="text"
          value={content.pressTitle}
          onChange={(e) => onChange({ ...content, pressTitle: e.target.value })}
        />
      </Field>
      <Field label="Press intro">
        <textarea
          rows={3}
          value={content.pressIntro}
          onChange={(e) => onChange({ ...content, pressIntro: e.target.value })}
        />
      </Field>
      <div className="admin-cms-pill-tabs">
        {content.pressItems.map((item, index) => (
          <button
            key={`${item.title}-${index}`}
            type="button"
            className={`admin-cms-pill-tab${activeIndex === index ? " is-active" : ""}`}
            onClick={() => setActiveIndex(index)}
          >
            {item.year}
          </button>
        ))}
      </div>
      {content.pressItems[activeIndex] ? (
        <>
          <Field label="Year">
            <input
              type="text"
              value={content.pressItems[activeIndex].year}
              onChange={(e) =>
                onChange({
                  ...content,
                  pressItems: content.pressItems.map((item, i) =>
                    i === activeIndex ? { ...item, year: e.target.value } : item,
                  ),
                })
              }
            />
          </Field>
          <Field label="Title">
            <input
              type="text"
              value={content.pressItems[activeIndex].title}
              onChange={(e) =>
                onChange({
                  ...content,
                  pressItems: content.pressItems.map((item, i) =>
                    i === activeIndex ? { ...item, title: e.target.value } : item,
                  ),
                })
              }
            />
          </Field>
          <Field label="Excerpt">
            <textarea
              rows={3}
              value={content.pressItems[activeIndex].excerpt}
              onChange={(e) =>
                onChange({
                  ...content,
                  pressItems: content.pressItems.map((item, i) =>
                    i === activeIndex ? { ...item, excerpt: e.target.value } : item,
                  ),
                })
              }
            />
          </Field>
        </>
      ) : null}
      <Field label="Social title">
        <input
          type="text"
          value={content.socialTitle}
          onChange={(e) => onChange({ ...content, socialTitle: e.target.value })}
        />
      </Field>
      <Field label="Social text">
        <textarea
          rows={3}
          value={content.socialText}
          onChange={(e) => onChange({ ...content, socialText: e.target.value })}
        />
      </Field>
    </div>
  );
}

export function PolicyCompanyEditor({ content, onChange }: EditorProps<PolicyPageContent>) {
  const [activeIndex, setActiveIndex] = useState(0);

  return (
    <div className="admin-cms-launch-form">
      <Field label="Quote">
        <input
          type="text"
          value={content.quote}
          onChange={(e) => onChange({ ...content, quote: e.target.value })}
        />
      </Field>
      <Field label="Quote body">
        <textarea
          rows={4}
          value={content.quoteBody}
          onChange={(e) => onChange({ ...content, quoteBody: e.target.value })}
        />
      </Field>
      <Field label="Values intro">
        <textarea
          rows={2}
          value={content.valuesIntro}
          onChange={(e) => onChange({ ...content, valuesIntro: e.target.value })}
        />
      </Field>
      <div className="admin-cms-pill-tabs">
        {content.values.map((item, index) => (
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
      {content.values[activeIndex] ? (
        <>
          <Field label="Value title">
            <input
              type="text"
              value={content.values[activeIndex].title}
              onChange={(e) =>
                onChange({
                  ...content,
                  values: content.values.map((item, i) =>
                    i === activeIndex ? { ...item, title: e.target.value } : item,
                  ),
                })
              }
            />
          </Field>
          <Field label="Value body">
            <textarea
              rows={3}
              value={content.values[activeIndex].body}
              onChange={(e) =>
                onChange({
                  ...content,
                  values: content.values.map((item, i) =>
                    i === activeIndex ? { ...item, body: e.target.value } : item,
                  ),
                })
              }
            />
          </Field>
        </>
      ) : null}
      <Field label="Aims intro">
        <textarea
          rows={2}
          value={content.aimsIntro}
          onChange={(e) => onChange({ ...content, aimsIntro: e.target.value })}
        />
      </Field>
      <Field label="Aims (one per line)">
        <textarea
          rows={6}
          value={content.aims.join("\n")}
          onChange={(e) =>
            onChange({ ...content, aims: e.target.value.split("\n").filter(Boolean) })
          }
        />
      </Field>
      <Field label="Closing paragraph">
        <textarea
          rows={3}
          value={content.closing}
          onChange={(e) => onChange({ ...content, closing: e.target.value })}
        />
      </Field>
    </div>
  );
}

function GridRowsEditor({
  sectionTitle,
  sectionIntro,
  rows,
  onSectionTitleChange,
  onSectionIntroChange,
  onRowsChange,
}: {
  sectionTitle: string;
  sectionIntro: string;
  rows: QualityPageContent["greenMind"]["rows"];
  onSectionTitleChange: (value: string) => void;
  onSectionIntroChange: (value: string) => void;
  onRowsChange: (rows: QualityPageContent["greenMind"]["rows"]) => void;
}) {
  const [activeIndex, setActiveIndex] = useState(0);
  const activeRow = rows[activeIndex];

  return (
    <div className="admin-cms-video-form__group">
      <Field label="Section title">
        <input
          type="text"
          value={sectionTitle}
          onChange={(e) => onSectionTitleChange(e.target.value)}
        />
      </Field>
      <Field label="Section intro">
        <textarea
          rows={3}
          value={sectionIntro}
          onChange={(e) => onSectionIntroChange(e.target.value)}
        />
      </Field>
      <div className="admin-cms-pill-tabs">
        {rows.map((row, index) => (
          <button
            key={`${row.title}-${index}`}
            type="button"
            className={`admin-cms-pill-tab${activeIndex === index ? " is-active" : ""}`}
            onClick={() => setActiveIndex(index)}
          >
            Row {index + 1}
          </button>
        ))}
      </div>
      {activeRow ? (
        <>
          <ImageUploadField
            label="Row image"
            value={activeRow.image}
            onChange={(image) =>
              onRowsChange(
                rows.map((row, i) => (i === activeIndex ? { ...row, image } : row)),
              )
            }
          />
          <Field label="Row title">
            <input
              type="text"
              value={activeRow.title}
              onChange={(e) =>
                onRowsChange(
                  rows.map((row, i) =>
                    i === activeIndex ? { ...row, title: e.target.value } : row,
                  ),
                )
              }
            />
          </Field>
          <Field label="Row body">
            <textarea
              rows={3}
              value={activeRow.body}
              onChange={(e) =>
                onRowsChange(
                  rows.map((row, i) =>
                    i === activeIndex ? { ...row, body: e.target.value } : row,
                  ),
                )
              }
            />
          </Field>
        </>
      ) : null}
    </div>
  );
}

export function QualityCompanyEditor({ content, onChange }: EditorProps<QualityPageContent>) {
  return (
    <div className="admin-cms-launch-form">
      <ImageUploadField
        label="Hero image"
        value={content.heroImage}
        onChange={(heroImage) => onChange({ ...content, heroImage })}
      />
      <Field label="Hero intro">
        <textarea
          rows={3}
          value={content.heroIntro}
          onChange={(e) => onChange({ ...content, heroIntro: e.target.value })}
        />
      </Field>
      <GridRowsEditor
        sectionTitle={content.greenMind.title}
        sectionIntro={content.greenMind.intro}
        rows={content.greenMind.rows}
        onSectionTitleChange={(title) =>
          onChange({ ...content, greenMind: { ...content.greenMind, title } })
        }
        onSectionIntroChange={(intro) =>
          onChange({ ...content, greenMind: { ...content.greenMind, intro } })
        }
        onRowsChange={(rows) =>
          onChange({ ...content, greenMind: { ...content.greenMind, rows } })
        }
      />
      <GridRowsEditor
        sectionTitle={content.qualitySafety.title}
        sectionIntro={content.qualitySafety.intro}
        rows={content.qualitySafety.rows}
        onSectionTitleChange={(title) =>
          onChange({ ...content, qualitySafety: { ...content.qualitySafety, title } })
        }
        onSectionIntroChange={(intro) =>
          onChange({ ...content, qualitySafety: { ...content.qualitySafety, intro } })
        }
        onRowsChange={(rows) =>
          onChange({ ...content, qualitySafety: { ...content.qualitySafety, rows } })
        }
      />
    </div>
  );
}

export function ContactsCompanyEditor({ content, onChange }: EditorProps<ContactsPageContent>) {
  return (
    <div className="admin-cms-launch-form">
      <Field label="Google Maps search query">
        <input
          type="text"
          value={content.mapQuery}
          onChange={(e) => onChange({ ...content, mapQuery: e.target.value })}
        />
      </Field>
      <Field label="Head office name">
        <input
          type="text"
          value={content.headquarters.name}
          onChange={(e) =>
            onChange({
              ...content,
              headquarters: { ...content.headquarters, name: e.target.value },
            })
          }
        />
      </Field>
      <Field label="Head office address">
        <textarea
          rows={2}
          value={content.headquarters.address}
          onChange={(e) =>
            onChange({
              ...content,
              headquarters: { ...content.headquarters, address: e.target.value },
            })
          }
        />
      </Field>
      <Field label="Phone">
        <input
          type="text"
          value={content.headquarters.phone}
          onChange={(e) =>
            onChange({
              ...content,
              headquarters: { ...content.headquarters, phone: e.target.value },
            })
          }
        />
      </Field>
      <Field label="Email">
        <input
          type="text"
          value={content.headquarters.email}
          onChange={(e) =>
            onChange({
              ...content,
              headquarters: { ...content.headquarters, email: e.target.value },
            })
          }
        />
      </Field>
      <Field label="Official email">
        <input
          type="text"
          value={content.headquarters.emailOfficial}
          onChange={(e) =>
            onChange({
              ...content,
              headquarters: { ...content.headquarters, emailOfficial: e.target.value },
            })
          }
        />
      </Field>
    </div>
  );
}

export function StoresCompanyEditor({ content, onChange }: EditorProps<StoresPageContent>) {
  const [activeIndex, setActiveIndex] = useState(0);
  const activeStore = content[activeIndex];

  return (
    <div className="admin-cms-launch-form">
      <div className="admin-cms-pill-tabs">
        {content.map((store, index) => (
          <button
            key={store.id}
            type="button"
            className={`admin-cms-pill-tab${activeIndex === index ? " is-active" : ""}`}
            onClick={() => setActiveIndex(index)}
          >
            {store.city}
          </button>
        ))}
      </div>
      {activeStore ? (
        <>
          <ImageUploadField
            label="Store image"
            value={activeStore.image}
            onChange={(image) =>
              onChange(
                content.map((store, i) => (i === activeIndex ? { ...store, image } : store)),
              )
            }
          />
          <Field label="City">
            <input
              type="text"
              value={activeStore.city}
              onChange={(e) =>
                onChange(
                  content.map((store, i) =>
                    i === activeIndex ? { ...store, city: e.target.value } : store,
                  ),
                )
              }
            />
          </Field>
          <Field label="Title">
            <input
              type="text"
              value={activeStore.title}
              onChange={(e) =>
                onChange(
                  content.map((store, i) =>
                    i === activeIndex ? { ...store, title: e.target.value } : store,
                  ),
                )
              }
            />
          </Field>
          <Field label="Address">
            <textarea
              rows={2}
              value={activeStore.address}
              onChange={(e) =>
                onChange(
                  content.map((store, i) =>
                    i === activeIndex ? { ...store, address: e.target.value } : store,
                  ),
                )
              }
            />
          </Field>
          <Field label="Phone">
            <input
              type="text"
              value={activeStore.phone ?? ""}
              onChange={(e) =>
                onChange(
                  content.map((store, i) =>
                    i === activeIndex ? { ...store, phone: e.target.value } : store,
                  ),
                )
              }
            />
          </Field>
          <Field label="Email">
            <input
              type="text"
              value={activeStore.email ?? ""}
              onChange={(e) =>
                onChange(
                  content.map((store, i) =>
                    i === activeIndex ? { ...store, email: e.target.value } : store,
                  ),
                )
              }
            />
          </Field>
        </>
      ) : null}
    </div>
  );
}

export function HistoricCompanyEditor({ content, onChange }: EditorProps<HistoricPageContent>) {
  const [activeIndex, setActiveIndex] = useState(0);

  return (
    <div className="admin-cms-launch-form">
      <Field label="Vertical label">
        <input
          type="text"
          value={content.verticalLabel}
          onChange={(e) => onChange({ ...content, verticalLabel: e.target.value })}
        />
      </Field>
      <Field label="Paragraphs (one per line)">
        <textarea
          rows={5}
          value={content.paragraphs.join("\n\n")}
          onChange={(e) =>
            onChange({
              ...content,
              paragraphs: e.target.value.split("\n\n").filter(Boolean),
            })
          }
        />
      </Field>
      <div className="admin-cms-pill-tabs">
        {content.sliderImages.map((_, index) => (
          <button
            key={index}
            type="button"
            className={`admin-cms-pill-tab${activeIndex === index ? " is-active" : ""}`}
            onClick={() => setActiveIndex(index)}
          >
            Slide {index + 1}
          </button>
        ))}
      </div>
      <ImageUploadField
        label={`Slider image ${activeIndex + 1}`}
        value={content.sliderImages[activeIndex] ?? ""}
        onChange={(image) =>
          onChange({
            ...content,
            sliderImages: content.sliderImages.map((src, i) =>
              i === activeIndex ? image : src,
            ),
          })
        }
      />
    </div>
  );
}

export function CompanyPageEditor({
  companySlug,
  content,
  onChange,
}: {
  companySlug: CompanySlug;
  content: unknown;
  onChange: (value: unknown) => void;
}) {
  switch (companySlug) {
    case "company":
      return (
        <AboutCompanyEditor
          content={content as AboutPageContent}
          onChange={onChange as (value: AboutPageContent) => void}
        />
      );
    case "communication":
      return (
        <CommunicationCompanyEditor
          content={content as CommunicationPageContent}
          onChange={onChange as (value: CommunicationPageContent) => void}
        />
      );
    case "company-policy":
      return (
        <PolicyCompanyEditor
          content={content as PolicyPageContent}
          onChange={onChange as (value: PolicyPageContent) => void}
        />
      );
    case "quality":
      return (
        <QualityCompanyEditor
          content={content as QualityPageContent}
          onChange={onChange as (value: QualityPageContent) => void}
        />
      );
    case "contacts":
      return (
        <ContactsCompanyEditor
          content={content as ContactsPageContent}
          onChange={onChange as (value: ContactsPageContent) => void}
        />
      );
    case "maknisa-store":
      return (
        <StoresCompanyEditor
          content={content as StoresPageContent}
          onChange={onChange as (value: StoresPageContent) => void}
        />
      );
    case "historic-brands":
      return (
        <HistoricCompanyEditor
          content={content as HistoricPageContent}
          onChange={onChange as (value: HistoricPageContent) => void}
        />
      );
    default:
      return null;
  }
}
