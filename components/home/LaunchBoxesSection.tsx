import { GrowButton } from "@/components/home/shared/GrowButton";
import { launchBoxes, type LaunchBox } from "@/lib/homeSections";
import { mediaUrl } from "@/lib/media";

type LaunchBoxesSectionProps = {
  boxes?: LaunchBox[];
  activeIndex?: number | null;
};

export function LaunchBoxesSection({
  boxes = launchBoxes,
  activeIndex = null,
}: LaunchBoxesSectionProps) {
  return (
    <section className="sn_box_lanci py-40 py-lg-80">
      <div className="container-fluid">
        <div className="row">
          {boxes.map((box, index) => (
            <div
              key={`${box.title}-${index}`}
              className={`col-12 col-sm-4${activeIndex === index ? " admin-cms-launch-box--active" : ""}`}
            >
              <div className="box-lancio">
                <div className="content">
                  <picture className="mb-30">
                    {/* eslint-disable-next-line @next/next/no-img-element */}
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
