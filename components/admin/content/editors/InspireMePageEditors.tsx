"use client";

import { useState, type ReactNode } from "react";
import type {
  InspireMeIntroContent,
  InspireMeResultProductsContent,
  InspireMeResultsContent,
  InspireMeStyleImagesContent,
  InspireMeWizardIntroContent,
} from "@/lib/cms/inspire-me-page";
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

export function InspireMeIntroEditor({ content, onChange }: EditorProps<InspireMeIntroContent>) {
  return (
    <div className="admin-cms-launch-form">
      <Field label="Page title">
        <input
          type="text"
          value={content.title}
          onChange={(e) => onChange({ ...content, title: e.target.value })}
        />
      </Field>
    </div>
  );
}

export function InspireMeWizardIntroEditor({
  content,
  onChange,
}: EditorProps<InspireMeWizardIntroContent>) {
  return (
    <div className="admin-cms-launch-form">
      <Field label="Instruction lines (one per line)">
        <textarea
          rows={5}
          value={content.lines.join("\n")}
          onChange={(e) =>
            onChange({
              ...content,
              lines: e.target.value.split("\n").filter(Boolean),
            })
          }
        />
      </Field>
    </div>
  );
}

export function InspireMeStyleImagesEditor({
  content,
  onChange,
}: EditorProps<InspireMeStyleImagesContent>) {
  const [activeIndex, setActiveIndex] = useState(0);
  const activeImage = content.images[activeIndex];

  return (
    <div className="admin-cms-launch-form">
      <div className="admin-cms-pill-tabs">
        {content.images.map((image, index) => (
          <button
            key={image.id}
            type="button"
            className={`admin-cms-pill-tab${activeIndex === index ? " is-active" : ""}`}
            onClick={() => setActiveIndex(index)}
          >
            {image.alt || `Image ${index + 1}`}
          </button>
        ))}
      </div>
      {activeImage ? (
        <>
          <Field label="Image ID">
            <input
              type="text"
              value={activeImage.id}
              onChange={(e) =>
                onChange({
                  ...content,
                  images: content.images.map((image, index) =>
                    index === activeIndex ? { ...image, id: e.target.value } : image,
                  ),
                })
              }
            />
          </Field>
          <ImageUploadField
            label="Style image"
            value={activeImage.src}
            onChange={(src) =>
              onChange({
                ...content,
                images: content.images.map((image, index) =>
                  index === activeIndex ? { ...image, src } : image,
                ),
              })
            }
          />
          <Field label="Style label / alt">
            <input
              type="text"
              value={activeImage.alt}
              onChange={(e) =>
                onChange({
                  ...content,
                  images: content.images.map((image, index) =>
                    index === activeIndex ? { ...image, alt: e.target.value } : image,
                  ),
                })
              }
            />
          </Field>
          <Field label="Tag IDs (comma-separated numbers)">
            <input
              type="text"
              value={activeImage.tagIds.join(", ")}
              onChange={(e) =>
                onChange({
                  ...content,
                  images: content.images.map((image, index) =>
                    index === activeIndex
                      ? {
                          ...image,
                          tagIds: e.target.value
                            .split(",")
                            .map((value) => Number(value.trim()))
                            .filter((value) => !Number.isNaN(value)),
                        }
                      : image,
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

export function InspireMeResultsEditor({
  content,
  onChange,
}: EditorProps<InspireMeResultsContent>) {
  return (
    <div className="admin-cms-launch-form">
      <Field label="See results button label">
        <input
          type="text"
          value={content.seeResultsLabel}
          onChange={(e) => onChange({ ...content, seeResultsLabel: e.target.value })}
        />
      </Field>
      <Field label="Congratulations title">
        <input
          type="text"
          value={content.congratsTitle}
          onChange={(e) => onChange({ ...content, congratsTitle: e.target.value })}
        />
      </Field>
      <Field label="Congratulations message">
        <textarea
          rows={3}
          value={content.congratsBody}
          onChange={(e) => onChange({ ...content, congratsBody: e.target.value })}
        />
      </Field>
      <Field label="Unsatisfied results title">
        <input
          type="text"
          value={content.unsatisfiedTitle}
          onChange={(e) => onChange({ ...content, unsatisfiedTitle: e.target.value })}
        />
      </Field>
      <Field label="Try again button label">
        <input
          type="text"
          value={content.tryAgainLabel}
          onChange={(e) => onChange({ ...content, tryAgainLabel: e.target.value })}
        />
      </Field>
    </div>
  );
}

export function InspireMeResultProductsEditor({
  content,
  onChange,
}: EditorProps<InspireMeResultProductsContent>) {
  const [activeIndex, setActiveIndex] = useState(0);
  const activeProduct = content.products[activeIndex];

  return (
    <div className="admin-cms-launch-form">
      <div className="admin-cms-pill-tabs">
        {content.products.map((product, index) => (
          <button
            key={product.id}
            type="button"
            className={`admin-cms-pill-tab${activeIndex === index ? " is-active" : ""}`}
            onClick={() => setActiveIndex(index)}
          >
            {product.title}
          </button>
        ))}
      </div>
      {activeProduct ? (
        <>
          <Field label="Product ID">
            <input
              type="text"
              value={activeProduct.id}
              onChange={(e) =>
                onChange({
                  ...content,
                  products: content.products.map((product, index) =>
                    index === activeIndex ? { ...product, id: e.target.value } : product,
                  ),
                })
              }
            />
          </Field>
          <Field label="Product title">
            <input
              type="text"
              value={activeProduct.title}
              onChange={(e) =>
                onChange({
                  ...content,
                  products: content.products.map((product, index) =>
                    index === activeIndex ? { ...product, title: e.target.value } : product,
                  ),
                })
              }
            />
          </Field>
          <Field label="Product link">
            <input
              type="text"
              value={activeProduct.href}
              onChange={(e) =>
                onChange({
                  ...content,
                  products: content.products.map((product, index) =>
                    index === activeIndex ? { ...product, href: e.target.value } : product,
                  ),
                })
              }
            />
          </Field>
          <ImageUploadField
            label="Product image"
            value={activeProduct.images[0] ?? ""}
            onChange={(image) =>
              onChange({
                ...content,
                products: content.products.map((product, index) =>
                  index === activeIndex ? { ...product, images: [image] } : product,
                ),
              })
            }
          />
          <Field label="Tag IDs (comma-separated)">
            <input
              type="text"
              value={activeProduct.tagIds.join(", ")}
              onChange={(e) =>
                onChange({
                  ...content,
                  products: content.products.map((product, index) =>
                    index === activeIndex
                      ? {
                          ...product,
                          tagIds: e.target.value
                            .split(",")
                            .map((value) => Number(value.trim()))
                            .filter((value) => !Number.isNaN(value)),
                        }
                      : product,
                  ),
                })
              }
            />
          </Field>
          <Field label="Category IDs (comma-separated)">
            <input
              type="text"
              value={activeProduct.categoryIds.join(", ")}
              onChange={(e) =>
                onChange({
                  ...content,
                  products: content.products.map((product, index) =>
                    index === activeIndex
                      ? {
                          ...product,
                          categoryIds: e.target.value
                            .split(",")
                            .map((value) => Number(value.trim()))
                            .filter((value) => !Number.isNaN(value)),
                        }
                      : product,
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
