"use client";

import Link from "next/link";
import { useCallback, useState } from "react";
import { Icon } from "@/components/icons/Icon";
import type { NavGroup } from "@/lib/navigation";

type NavDropdownProps = {
  group: NavGroup;
};

export function NavDropdown({ group }: NavDropdownProps) {
  const [subOpen, setSubOpen] = useState(false);
  const [hover, setHover] = useState(false);

  const toggleSub = useCallback(() => {
    setSubOpen((v) => !v);
  }, []);

  const liClass = [
    "_current_menu_item",
    subOpen ? "_sub_open" : "",
    hover ? "_hover" : "",
  ]
    .filter(Boolean)
    .join(" ");

  return (
    <li className={liClass}>
      <span
        tabIndex={0}
        role="button"
        aria-expanded={subOpen}
        onClick={toggleSub}
        onKeyDown={(e) => {
          if (e.key === "Enter" || e.key === " ") {
            e.preventDefault();
            toggleSub();
          }
        }}
        onMouseEnter={() => setHover(true)}
        onMouseLeave={() => setHover(false)}
        onFocus={() => setHover(true)}
        onBlur={() => setHover(false)}
      >
        {group.label}
        <Icon id="angle-down" className="_angle_down" />
      </span>
      <div className="sn_header_menu_sub">
        <div className="sn_header_menu_sub_in">
          <div className="row">
            <div className="sn_header_menu_sub_list col-12 col-md-6">
              <ul>
                {group.links.map((link) => (
                  <li key={link.href}>
                    <Link href={link.href} title={link.title}>
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
            {group.highlight ? (
              <div className="sn_header_menu_sub_highlight col-12 col-md-6 mt-40 mt-md-0">
                <div className="mb-20">
                  <picture>
                    <source
                      srcSet={group.highlight.image}
                      media="(min-width: 768px)"
                    />
                    <img
                      src={group.highlight.image}
                      alt=""
                      className="img-fluid"
                    />
                  </picture>
                </div>
                {group.highlight.text}{" "}
                <Link
                  href={group.highlight.cta.href}
                  className="mt-10"
                  title={group.highlight.cta.title}
                >
                  {group.highlight.cta.label}
                </Link>
              </div>
            ) : null}
          </div>
        </div>
      </div>
    </li>
  );
}
