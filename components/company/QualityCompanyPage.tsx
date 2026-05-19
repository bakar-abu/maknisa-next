import { MagazineBreadcrumbs } from "@/components/magazine/MagazineBreadcrumbs";
import { CompanyGridAlt } from "@/components/company/CompanyGridAlt";
import { companyPages, qualityContent } from "@/lib/company-pages";

export function QualityCompanyPage() {
  const page = companyPages.quality;
  const c = qualityContent;

  return (
    <main id="main-content" role="main">
      <section className="sn_intro_anchors">
        <div className="sn_intro_anchors_bg">
          <picture>
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src={c.heroImage} alt="" className="img-fluid w-100" loading="eager" />
          </picture>
        </div>
        <div className="sn_intro_anchors_ct">
          <div className="container">
            <div className="row py-30">
              <div className="col-12 col-lg-10 col-xl-8 mx-auto text-center text-white">
                <MagazineBreadcrumbs items={page.breadcrumbs} />
                <h1 className="_color_inherit h2">{page.title}</h1>
                <div className="sn_paragraph_xxl _color_inherit mt-30">
                  {c.heroIntro}
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <div data-anchor-id="responsible" />
      <CompanyGridAlt
        sectionId="responsible"
        title={c.greenMind.title}
        intro={c.greenMind.intro}
        rows={c.greenMind.rows}
      />

      <div className="_bt_gray" />
      <div data-anchor-id="product_quality" />

      <CompanyGridAlt
        title={c.qualitySafety.title}
        intro={c.qualitySafety.intro}
        rows={c.qualitySafety.rows}
      />
    </main>
  );
}
