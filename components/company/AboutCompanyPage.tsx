import { MagazineBreadcrumbs } from "@/components/magazine/MagazineBreadcrumbs";
import type { AboutPageContent } from "@/lib/cms/company-page";
import { aboutContent, companyPages } from "@/lib/company-pages";
import { mediaUrl } from "@/lib/media";

type AboutCompanyPageProps = {
  content?: AboutPageContent;
};

export function AboutCompanyPage({ content }: AboutCompanyPageProps) {
  const page = companyPages.company;
  const c = content ?? aboutContent;

  return (
    <main id="main-content" role="main">
      <section className="sn_intro_video">
        <div
          className="sn_intro_video_bg"
          style={{ backgroundImage: `url(${mediaUrl(c.heroImage)})` }}
        />
        <div className="sn_intro_video_ct">
          <div className="container text-center text-white">
            <div className="row">
              <div className="col-12 col-lg-10 col-xl-8 mx-auto">
                <div className="sn_intro_video_wr">
                  <div className="sn_intro_video_in py-60">
                    <div className="my-auto">
                      <MagazineBreadcrumbs items={page.breadcrumbs} />
                      <h1 className="h2 _color_inherit">{page.title}</h1>
                      <div className="sn_paragraph_xxl">{c.heroSubtitle}</div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="sn_text my-120 my-lg-200 _strong_primary">
        <div className="sn_vertical_text">
          <div className="sn_vertical_text_in py-20 py-lg-60">
            <div className="h1 m-0">{c.verticalLabel}</div>
          </div>
        </div>
        <div className="container">
          <div className="row">
            <div className="col-10 col-sm-11 col-md-12 ml-auto mx-md-auto col-lg-10 col-xl-8">
              <div className="sn_paragraph">
                {c.paragraphs.map((p) => (
                  <p key={p.slice(0, 40)}>{p}</p>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="sn_text my-80 my-lg-120">
        <div className="container">
          <div className="row">
            {c.pillars.map((pillar) => (
              <div key={pillar.title} className="col-12 col-lg-4 mb-40 mb-lg-0">
                <div className="h4 _sans text-primary mb-20">{pillar.title}</div>
                <div className="sn_paragraph">{pillar.body}</div>
              </div>
            ))}
          </div>
        </div>
      </section>
    </main>
  );
}
