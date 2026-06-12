"use client";

import Link from "next/link";
import { useCallback, useEffect, useState } from "react";
import { BOOK_APPOINTMENT_HREF } from "@/lib/appointment";
import { customizeOrderHref } from "@/lib/customize-order";
import type { CollectionTag } from "@/lib/collection-types";
import { site } from "@/lib/site";

export type TechModalTab =
  | "technical"
  | "downloads"
  | "certifications"
  | "configurate";

type TechSubTab = "description" | "dimensions" | "finishes";

type ProductTechModalProps = {
  open: boolean;
  tab: TechModalTab;
  productTitle: string;
  collectionTitle: string;
  tags: CollectionTag[];
  customizeHref?: string;
  onClose: () => void;
  onTabChange: (tab: TechModalTab) => void;
};

const TABS: { id: TechModalTab; label: string }[] = [
  { id: "technical", label: "Technical sheet" },
  { id: "downloads", label: "Downloads" },
  { id: "certifications", label: "Certifications" },
  { id: "configurate", label: "Configurate" },
];

const TECH_SUBTABS: { id: TechSubTab; label: string }[] = [
  { id: "description", label: "Description" },
  { id: "dimensions", label: "Dimensions" },
  { id: "finishes", label: "Finishes" },
];

const MATERIAL_SECTIONS = [
  {
    title: "Structural materials",
    body: "Engineered panels, hardwood frames, and reinforced joinery selected for long-term stability in residential use.",
  },
  {
    title: "Padding & comfort",
    body: "High-resilience foam and layered cushioning systems designed for everyday comfort and shape retention.",
  },
  {
    title: "Upholstery & covers",
    body: "Fabric and leather options with removable covers where specified. Finishes are coordinated with matching or contrasting profiles.",
  },
];

export function ProductTechModal({
  open,
  tab,
  productTitle,
  collectionTitle,
  tags,
  customizeHref = customizeOrderHref(),
  onClose,
  onTabChange,
}: ProductTechModalProps) {
  const [techSubTab, setTechSubTab] = useState<TechSubTab>("description");
  const [openAccordion, setOpenAccordion] = useState<number | null>(0);

  const handleKey = useCallback(
    (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    },
    [onClose],
  );

  useEffect(() => {
    if (open) {
      document.body.classList.add("mk-pdp-modal-open");
      window.addEventListener("keydown", handleKey);
    } else {
      document.body.classList.remove("mk-pdp-modal-open");
    }
    return () => {
      document.body.classList.remove("mk-pdp-modal-open");
      window.removeEventListener("keydown", handleKey);
    };
  }, [open, handleKey]);

  useEffect(() => {
    if (tab === "technical") setTechSubTab("description");
  }, [tab]);

  return (
    <div
      className={`mk-pdp-modal${open ? " is-open" : ""}`}
      role="dialog"
      aria-modal="true"
      aria-hidden={!open}
    >
      <header className="mk-pdp-modal__header">
        <button type="button" className="mk-pdp-modal__back" onClick={onClose}>
          Back to {productTitle}
        </button>
      </header>

      <div className="mk-pdp-modal__tabs" role="tablist">
        {TABS.map((t) => (
          <button
            key={t.id}
            type="button"
            role="tab"
            aria-selected={tab === t.id}
            className={`mk-pdp-modal__tab${tab === t.id ? " is-active" : ""}`}
            onClick={() => onTabChange(t.id)}
          >
            {t.label}
          </button>
        ))}
      </div>

      <div className="mk-pdp-modal__body">
        {tab === "technical" && (
          <>
            <div className="mk-pdp-modal__subtabs" role="tablist">
              {TECH_SUBTABS.map((st) => (
                <button
                  key={st.id}
                  type="button"
                  role="tab"
                  aria-selected={techSubTab === st.id}
                  className={`mk-pdp-modal__subtab${
                    techSubTab === st.id ? " is-active" : ""
                  }`}
                  onClick={() => setTechSubTab(st.id)}
                >
                  {st.label}
                </button>
              ))}
            </div>

            {techSubTab === "description" && (
              <div className="mk-pdp-modal__panel">
                <h3 className="mk-pdp-modal__panel-title">{productTitle}</h3>
                <p>
                  {productTitle} is part of the {collectionTitle} collection by
                  Maknisa. Modular layouts, door styles, and complementary pieces
                  can be combined to suit your space.
                </p>
                <ul className="mk-pdp-modal__list">
                  <li>Modular configurations for linear and corner layouts</li>
                  <li>Matching or contrasting profiles on selected finishes</li>
                  <li>Professional measurement and installation support</li>
                </ul>
              </div>
            )}

            {techSubTab === "dimensions" && (
              <div className="mk-pdp-modal__panel">
                <h3 className="mk-pdp-modal__panel-title">Dimensions</h3>
                <p>
                  Exact module sizes depend on your layout. Our consultants will
                  prepare a technical drawing with widths, depths, and heights for
                  each run during your showroom visit.
                </p>
                <div className="mk-pdp-modal__dims">
                  <div>
                    <span className="mk-pdp-modal__dim-label">Base module</span>
                    <span className="mk-pdp-modal__dim-value">60 / 90 cm</span>
                  </div>
                  <div>
                    <span className="mk-pdp-modal__dim-label">Depth</span>
                    <span className="mk-pdp-modal__dim-value">56 - 65 cm</span>
                  </div>
                  <div>
                    <span className="mk-pdp-modal__dim-label">Height</span>
                    <span className="mk-pdp-modal__dim-value">72 - 96 cm</span>
                  </div>
                </div>
              </div>
            )}

            {techSubTab === "finishes" && (
              <div className="mk-pdp-modal__panel">
                <h3 className="mk-pdp-modal__panel-title">Finishes</h3>
                {tags.length > 0 ? (
                  <div className="mk-pdp__tags-grid mk-pdp-modal__finishes">
                    {tags.map((tag) => (
                      <span key={tag.id} className="mk-pdp__tag-chip">
                        {tag.label}
                      </span>
                    ))}
                  </div>
                ) : (
                  <p>
                    Contact Maknisa for available finishes and materials for this
                    model.
                  </p>
                )}

                <div className="mk-pdp-modal__accordion">
                  {MATERIAL_SECTIONS.map((section, index) => {
                    const expanded = openAccordion === index;
                    return (
                      <div key={section.title} className="mk-pdp-modal__acc-item">
                        <button
                          type="button"
                          className="mk-pdp-modal__acc-trigger"
                          aria-expanded={expanded}
                          onClick={() =>
                            setOpenAccordion(expanded ? null : index)
                          }
                        >
                          {section.title}
                          <span aria-hidden>{expanded ? "-" : "+"}</span>
                        </button>
                        {expanded ? (
                          <div className="mk-pdp-modal__acc-body">
                            <p>{section.body}</p>
                          </div>
                        ) : null}
                      </div>
                    );
                  })}
                </div>
              </div>
            )}
          </>
        )}

        {tab === "downloads" && (
          <div className="mk-pdp-modal__panel">
            <h3 className="mk-pdp-modal__panel-title">Resources</h3>
            <p>
              Request 2D/3D files and catalogues for {productTitle}. For immediate
              assistance, contact Maknisa or visit our after-sales section.
            </p>
            <ul className="mk-pdp-modal__downloads">
              <li>
                <Link
                  href="/ww/after-sales-services"
                  className="mk-pdp-modal__download-item"
                >
                  {productTitle} - product registration &amp; support
                </Link>
              </li>
              <li>
                <a
                  href={`mailto:${site.email}?subject=${encodeURIComponent(`${productTitle} technical files`)}`}
                  className="mk-pdp-modal__download-item"
                >
                  Request 2D / 3D files by email
                </a>
              </li>
            </ul>
          </div>
        )}

        {tab === "certifications" && (
          <div className="mk-pdp-modal__panel">
            <h3 className="mk-pdp-modal__panel-title">Quality &amp; certifications</h3>
            <p>
              Maknisa partners with leading manufacturers to deliver furniture and
              kitchens that meet international quality standards.
            </p>
            <ul className="mk-pdp-modal__list">
              <li>Factory-controlled production and quality checks</li>
              <li>Warranty coverage through our after-sales programme</li>
              <li>Professional installation guidance available</li>
            </ul>
          </div>
        )}

        {tab === "configurate" && (
          <div className="mk-pdp-modal__panel">
            <h3 className="mk-pdp-modal__panel-title">Configure your project</h3>
            <p>
              Work with a Maknisa consultant to configure {productTitle} for your
              home: layouts, finishes, handles, and complementary pieces.
            </p>
            <div className="mk-pdp-modal__cta-row">
              <Link href={customizeHref} className="mk-pdp__btn">
                Customize your order
              </Link>
              <Link href={BOOK_APPOINTMENT_HREF} className="mk-pdp__btn mk-pdp__btn--outline">
                Book an appointment
              </Link>
              <a
                href={`tel:${site.phoneTel}`}
                className="mk-pdp__btn mk-pdp__btn--outline"
              >
                Call {site.phone}
              </a>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
