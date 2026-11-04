import type { IntroTextContent } from "@/lib/cms/home-page";

type IntroTextSectionProps = {
  content?: IntroTextContent;
};

const DEFAULT_INTRO: IntroTextContent = {
  headingHtml:
    'Endless <strong>furnishing</strong> solutions to suit your <strong>needs</strong>',
  paragraph: "Catering to every taste, from intimate projects to grand designs.",
};

export function IntroTextSection({ content = DEFAULT_INTRO }: IntroTextSectionProps) {
  return (
    <section className="sn_box-txt py-40 py-md-80">
      <div className="container-fluid">
        <div className="row">
          <div className="col-12 col-lg-10 mx-auto text-center">
            <h2
              className="h2 mb-30"
              dangerouslySetInnerHTML={{ __html: content.headingHtml }}
            />
            <div className="sn_paragraph_xl text-center">{content.paragraph}</div>
          </div>
        </div>
      </div>
    </section>
  );
}
