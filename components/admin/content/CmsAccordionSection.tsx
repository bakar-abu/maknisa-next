"use client";

import type { ReactNode } from "react";
import { AdminNavIcon } from "@/components/admin/dashboard/AdminNavIcon";

type CmsAccordionSectionProps = {
  label: string;
  description: string;
  isOpen: boolean;
  onToggle: () => void;
  onEdit: () => void;
  children?: ReactNode;
};

export function CmsAccordionSection({
  label,
  description,
  isOpen,
  onToggle,
  onEdit,
  children,
}: CmsAccordionSectionProps) {
  return (
    <section className="admin-cms-accordion">
      <div className="admin-cms-accordion__header">
        <button
          type="button"
          className="admin-cms-accordion__trigger"
          aria-expanded={isOpen}
          onClick={onToggle}
        >
          <span className="admin-cms-accordion__toggle">
            <AdminNavIcon name={isOpen ? "chevron-down" : "chevron-right"} />
          </span>
          <span className="admin-cms-accordion__title">{label}</span>
          <span className="admin-cms-accordion__description">{description}</span>
        </button>
        <div className="admin-cms-accordion__edit">
          <button
            type="button"
            className="admin-dash__btn admin-dash__btn--light"
            onClick={onEdit}
          >
            Edit
          </button>
        </div>
      </div>

      {isOpen && children ? (
        <div className="admin-cms-accordion__body">{children}</div>
      ) : null}
    </section>
  );
}
