import Link from "next/link";
import { Icon } from "@/components/icons/Icon";
import {
  footerLegalLinks,
  footerMenuLinks,
  socialLinks,
} from "@/lib/navigation";
import { site } from "@/lib/site";

export function Footer() {
  return (
    <footer
      id="footer"
      className="sn_footer pt-40 pb-110 pt-lg-70 pb-lg-120"
      role="contentinfo"
    >
      <div className="container-fluid">
        <div className="row">
          <div className="sn_footer_info col-12 mb-60 mb-lg-80">
            <ul>
              <li className="font-weight-bold">&copy; {site.name.toUpperCase()}</li>
              <li>{site.address}</li>
              <li>
                <a href={`tel:${site.phoneTel}`}>{site.phone}</a>
              </li>
            </ul>
            <br />
            <span style={{ color: "#8c8c8c" }}>
              <em>
                *Downloading, copying and modifying the textual and photographic
                audiovisual contents in any form on this page is prohibited. It
                is also prohibited to distribute and publish the aforementioned
                content.
              </em>
            </span>
          </div>

          <div className="sn_footer_menu col-12 col-lg-6 mb-60 mb-lg-80">
            <ul className="row">
              {footerMenuLinks.map((link) => (
                <li key={link.href} className="col-6">
                  {link.external ? (
                    <a
                      href={link.href}
                      target="_blank"
                      rel="nofollow noopener noreferrer"
                      title={link.title}
                    >
                      {link.label}
                    </a>
                  ) : (
                    <Link href={link.href} title={link.title}>
                      {link.label}
                    </Link>
                  )}
                </li>
              ))}
            </ul>
          </div>

          <div className="sn_footer_newsletter col-12 col-lg-5 offset-lg-1 mb-60 mb-lg-80">
            <h6 className="h6 mb-20 mb-lg-30">{site.tagline}</h6>
            <div className="sn_footer_newsletter_content">
              Subscribe to the newsletter and find out why!
            </div>
            <form
              action="https://maknisa.com"
              method="GET"
              className="d-md-flex align-items-center mt-10"
            >
              <div className="form-group flex-grow-1 pr-md-20 mb-md-0">
                <input
                  type="email"
                  className="form-control"
                  name="email"
                  placeholder="Email"
                  aria-label="Email"
                />
              </div>
              <button className="sn_btn_grow" type="submit">
                <span className="tx">SUBSCRIBE</span>
                <span
                  className="sq"
                  aria-hidden="true"
                  data-title="SUBSCRIBE"
                />
              </button>
            </form>
          </div>

          <div className="sn_footer_socials col-12 col-md align-self-center mb-60 mb-lg-80">
            <ul>
              {socialLinks.map((item) => (
                <li key={item.icon}>
                  <a
                    href={item.href}
                    rel="me noopener noreferrer"
                    target="_blank"
                    title={item.label}
                    aria-label={item.label}
                  >
                    <Icon id={item.icon} className={`_${item.icon}`} />
                  </a>
                </li>
              ))}
            </ul>
          </div>

          <div className="sn_footer_info col-12 mb-30 mb-lg-0">
            <ul className="mb-10">
              <li>{site.address}</li>
              <li>
                <a href={`mailto:${site.email}`}>{site.email}</a>
              </li>
              <li>{site.developer}</li>
            </ul>
            <ul className="mt-20">
              {footerLegalLinks.map((link) => (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    title={link.title}
                    {...(link.label === "Compliance"
                      ? { target: "_blank" }
                      : {})}
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>
    </footer>
  );
}
