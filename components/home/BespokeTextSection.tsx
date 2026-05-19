import { bespokeTextSection } from "@/lib/homeSections";

export function BespokeTextSection() {
  return (
    <section className="sn_box-txt py-40 py-md-80">
      <div className="container-fluid">
        <div className="col-12 col-lg-10 mx-auto text-center">
          <h2
            className="h2 mb-30"
            dangerouslySetInnerHTML={{ __html: bespokeTextSection.titleHtml }}
          />
          <div className="sn_paragraph_xl text-center">
            {bespokeTextSection.subtitle}
          </div>
        </div>
      </div>
    </section>
  );
}
