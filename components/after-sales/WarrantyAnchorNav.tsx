"use client";

type Anchor = { label: string; anchorId: string };

export function WarrantyAnchorNav({ anchors }: { anchors: Anchor[] }) {
  const scrollTo = (anchorId: string) => {
    const target = document.querySelector(`[data-anchor-id="${anchorId}"]`);
    target?.scrollIntoView({ behavior: "smooth", block: "start" });
  };

  return (
    <div className="sn_warranties_anchors_in">
      {anchors.map((anchor) => (
        <button
          key={anchor.label}
          type="button"
          className="btn btn-outline-dark _shadowless"
          title={anchor.label}
          onClick={() => scrollTo(anchor.anchorId)}
        >
          {anchor.label}
        </button>
      ))}
    </div>
  );
}
