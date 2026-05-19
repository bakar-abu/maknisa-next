import Link from "next/link";
import { Icon } from "@/components/icons/Icon";
import { companyPages, contactsContent } from "@/lib/company-pages";

export function ContactsCompanyPage() {
  const page = companyPages.contacts;
  const hq = contactsContent.headquarters;

  return (
    <main id="main-content" role="main">
      <section className="sn_store_locator_map">
        <div className="sn_store_locator_map_wr">
          <div className="sn_store_locator_map_stores">
            <div className="sn_store_locator_map_stores_head">
              <h1 className="h4 mb-10">{page.title}</h1>
              <div className="_content">
                <div className="sn_paragraph">
                  <strong>{hq.name}</strong>
                  <br />
                  {hq.address}
                  <br />
                  T:{" "}
                  <Link href={`tel:${hq.phone.replace(/\s/g, "")}`}>{hq.phone}</Link>
                  <br />
                  e-mail: <Link href={`mailto:${hq.email}`}>{hq.email}</Link>
                  <br />
                  <Link href={`mailto:${hq.emailOfficial}`}>{hq.emailOfficial}</Link>
                </div>
              </div>
            </div>
            <div className="sn_store_locator_map_stores_main">
              <div className="sn_store_locator_i _sb_gray">
                <div className="marker">
                  <Icon id="marker" className="_marker" />
                </div>
                <h2 className="tt">{hq.name}</h2>
                <div className="sn_paragraph_sm _color_inherit">
                  {hq.address}
                  <br />
                  T: {hq.phone}
                  <br />
                  <Link href={`mailto:${hq.email}`} title={hq.name}>
                    {hq.email}
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}
