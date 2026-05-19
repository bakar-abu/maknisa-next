import Link from "next/link";

type Crumb = { label: string; href?: string };

export function MagazineBreadcrumbs({ items }: { items: Crumb[] }) {
  return (
    <nav className="sn_breadcrumbs" role="navigation" aria-label="Breadcrumb">
      <ul>
        {items.map((item, index) => (
          <li key={`${item.label}-${index}`}>
            {item.href ? (
              <Link href={item.href}>{item.label}</Link>
            ) : (
              <span aria-current={index === items.length - 1 ? "page" : undefined}>
                {item.label}
              </span>
            )}
          </li>
        ))}
      </ul>
    </nav>
  );
}
