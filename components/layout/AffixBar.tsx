import Link from "next/link";
import { serviceLinks } from "@/lib/navigation";
import { site } from "@/lib/site";

export function AffixBar() {
  return (
    <section className="sn_affix_navigation sn_affix_navigation_2025">
      <div className="txt">Start planning your {site.name} project now</div>
      <div className="actions">
        {serviceLinks.map((link) => (
          <Link
            key={link.href}
            href={link.href}
            className="sn_btn_grow _small cta-01"
            title={link.title}
          >
            <span className="tx">{link.label}</span>
            <span className="sq" aria-hidden="true" data-title={link.label} />
          </Link>
        ))}
      </div>
    </section>
  );
}
