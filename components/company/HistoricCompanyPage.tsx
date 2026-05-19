import { HistoricDetailsSlider } from "@/components/company/HistoricDetailsSlider";
import { historicContent } from "@/lib/company-pages";

export function HistoricCompanyPage() {
  const c = historicContent;

  return (
    <main id="main-content" role="main">
      <HistoricDetailsSlider images={c.sliderImages} />

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
                  <p key={p.slice(0, 48)}>{p}</p>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}
