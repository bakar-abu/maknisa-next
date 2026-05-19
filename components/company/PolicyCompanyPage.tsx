import { MagazineBreadcrumbs } from "@/components/magazine/MagazineBreadcrumbs";
import { CompanyAccordion } from "@/components/company/CompanyAccordion";
import { companyPages, policyContent } from "@/lib/company-pages";

export function PolicyCompanyPage() {
  const page = companyPages["company-policy"];
  const c = policyContent;

  return (
    <main id="main-content" role="main">
      <section className="sn_intro_text mt-120 mt-xl-200 mb-100 mb-xl-130">
        <div className="container text-center">
          <div className="row justify-content-center">
            <div className="col-12 col-lg-10 col-xl-8 mx-md-0 mb-40">
              <MagazineBreadcrumbs items={page.breadcrumbs} />
            </div>
            <div className="col-12 col-lg-10 col-xl-8 mx-md-0">
              <h1 className="h1 m-0">{page.title}</h1>
            </div>
          </div>
        </div>
      </section>

      <section className="sn_text_quote my-100 my-xl-130">
        <div className="container text-center">
          <div className="row">
            <div className="col-12 col-md-8 col-lg-7 col-xl-6 mx-auto">
              <div className="h1 text-primary mb-n20 mb-lg-n30 mb-xl-n50">“</div>
              <div className="h4 m-0">{c.quote}</div>
            </div>
            <div className="col-12 col-md-10 col-xl-8 mx-auto mt-30 mt-md-40 mt-xl-60">
              <div className="sn_paragraph_lg">{c.quoteBody}</div>
            </div>
          </div>
        </div>
      </section>

      <section className="sn_text mt-100 mt-xl-130 mb-30">
        <div className="container">
          <div className="row">
            <div className="col-12 col-lg-10 mx-auto">
              <div className="sn_paragraph">
                <div className="h4 _sans text-primary mb-20">Our values:</div>
                {c.valuesIntro}
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="mt-30 mb-90">
        <div className="container">
          <div className="row">
            <div className="col-12 col-lg-10 mx-auto">
              <CompanyAccordion items={c.values} />
            </div>
          </div>
        </div>
      </section>

      <section className="sn_goals_list mt-80 mt-xl-120 mb-110 mb-xl-150">
        <div className="container">
          <div className="row">
            <div className="col-12 col-lg-10 mx-auto">
              <div className="h4 _sans text-primary mb-30">Our aims:</div>
              <div className="sn_paragraph_lg mb-30">{c.aimsIntro}</div>
              <div className="sn_goals_list_items sn_paragraph_lg mb-30">
                {c.aims.map((aim) => (
                  <div key={aim}>{aim}</div>
                ))}
              </div>
              <div className="sn_paragraph_lg">{c.closing}</div>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}
