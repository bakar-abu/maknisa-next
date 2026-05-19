"use client";

import type { ReactNode } from "react";
import { useId, useState } from "react";

type CompanyAccordionProps = {
  items: { title: string; body: ReactNode }[];
  id?: string;
  sans?: boolean;
};

export function CompanyAccordion({
  items,
  id = "sn_accordion",
  sans = false,
}: CompanyAccordionProps) {
  const baseId = useId();
  const [openIndex, setOpenIndex] = useState<number | null>(null);

  return (
    <div className={`sn_accordion${sans ? " _sans" : ""}`} id={id}>
      {items.map((item, index) => {
        const panelId = `${baseId}-${index}`;
        const isOpen = openIndex === index;

        return (
          <div className="sn_accordion_i" key={panelId}>
            <button
              type="button"
              className={`sn_accordion_toggle ${isOpen ? "" : "collapsed"}`}
              aria-expanded={isOpen}
              aria-controls={panelId}
              onClick={() => setOpenIndex(isOpen ? null : index)}
            >
              <span>{item.title}</span>
              <span className="indicator" />
            </button>
            <div
              id={panelId}
              className={`sn_accordion_collapse collapse ${isOpen ? "show" : ""}`}
            >
              <div className="sn_accordion_collapse_in">
                <div className="sn_paragraph_lg">{item.body}</div>
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
}

