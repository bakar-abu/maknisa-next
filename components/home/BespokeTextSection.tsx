import type { Metadata } from "next";
import type { BespokeTextContent } from "@/lib/cms/home-page";
import { bespokeTextSection } from "@/lib/homeSections";

type BespokeTextSectionProps = {
  content?: BespokeTextContent;
};

const DEFAULT_BESPOKE: BespokeTextContent = {
  titleHtml: bespokeTextSection.titleHtml,
  subtitle: bespokeTextSection.subtitle,
};

export function BespokeTextSection({ content = DEFAULT_BESPOKE }: BespokeTextSectionProps) {
  return (
    <section className="sn_box-txt py-40 py-md-80">
      <div className="container-fluid">
        <div className="col-12 col-lg-10 mx-auto text-center">
          <h2
            className="h2 mb-30"
            dangerouslySetInnerHTML={{ __html: content.titleHtml }}
          />
          <div className="sn_paragraph_xl text-center">{content.subtitle}</div>
        </div>
      </div>
    </section>
  );
}
