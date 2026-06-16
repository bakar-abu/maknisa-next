import Link from "next/link";
import { Icon } from "@/components/icons/Icon";
import { companyPages, contactsContent, storesContent } from "@/lib/company-pages";
import { site } from "@/lib/site";

const MARKER_ICONS = ["marker", "marker-right", "marker-bottom", "marker-left"] as const;

function mapsEmbedSrc(query: string) {
  return `https://maps.google.com/maps?q=${encodeURIComponent(query)}&z=14&output=embed`;
}

export function ContactsCompanyPage() {
  const page = companyPages.contacts;
  const hq = contactsContent.headquarters;

  return (
    <main id="main-content" role="main">
      <section className="sn_store_locator_map mk-contacts-page">
        <div className="sn_store_locator_map_wr">
          <div className="sn_store_locator_map_gmap">
            <iframe
              title={`${site.name} showroom map`}
              src={mapsEmbedSrc(contactsContent.mapQuery)}
              loading="lazy"
              referrerPolicy="no-referrer-when-downgrade"
              allowFullScreen
            />
          </div>

          <div className="sn_store_locator_map_stores">
            <div className="sn_store_locator_map_stores_head">
              <h1 className="h4 mb-10">{page.title}</h1>
              <div className="_content">
                <div className="sn_paragraph mk-contacts-page__hq">
                  <strong>{hq.name}</strong>
                  <br />
                  {hq.address}
                  <br />
                  T:{" "}
                  <Link href={`tel:${site.phoneTel}`} className="mk-contacts-page__accent">
                    {hq.phone}
                  </Link>
                  <br />
                  e-mail:{" "}
                  <Link href={`mailto:${hq.email}`} className="mk-contacts-page__accent">
                    {hq.email}
                  </Link>
                  <br />
                  <Link
                    href={`mailto:${hq.emailOfficial}`}
                    className="mk-contacts-page__accent"
                  >
                    {hq.emailOfficial}
                  </Link>
                </div>
              </div>
            </div>

            <div className="sn_store_locator_map_stores_main">
              {storesContent.map((office, index) => {
                const phone = office.phone ?? site.phone;
                const phoneTel = phone.replace(/\s/g, "");
                const email = office.email ?? site.email;

                return (
                <div key={office.id} className="sn_store_locator_i _sb_gray">
                  <div className="marker">
                    <Icon
                      id={MARKER_ICONS[index % MARKER_ICONS.length]}
                      className="_marker"
                    />
                  </div>
                  <h2 className="tt">{office.title}</h2>
                  <div className="sn_paragraph_sm _color_inherit">
                    {office.city}
                    <br />
                    {office.address}
                    <br />
                    T:{" "}
                    <Link
                      href={`tel:${phoneTel}`}
                      className="mk-contacts-page__accent"
                    >
                      {phone}
                    </Link>
                    <br />
                    <Link
                      href={`mailto:${email}`}
                      title={office.title}
                      className="mk-contacts-page__accent"
                    >
                      {email}
                    </Link>
                  </div>
                </div>
                );
              })}
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}
