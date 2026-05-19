import { GrowButton } from "@/components/home/shared/GrowButton";
import { launchBoxes } from "@/lib/homeSections";
import { mediaUrl } from "@/lib/media";

export function LaunchBoxesSection() {
  return (
    <section className="sn_box_lanci py-40 py-lg-80">
      <div className="container-fluid">
        <div className="row">
          {launchBoxes.map((box) => (
            <div key={box.title} className="col-12 col-sm-4">
              <div className="box-lancio">
                <div className="content">
                  <picture className="mb-30">
                    <img src={mediaUrl(box.image)} alt="" />
                  </picture>
                  <h5 className="title h5 pb-20">{box.title}</h5>
                  <div
                    className="abstract"
                    dangerouslySetInnerHTML={{ __html: box.abstractHtml }}
                  />
                </div>
                <GrowButton
                  href={box.cta.href}
                  label={box.cta.label}
                  className={box.cta.className}
                />
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
