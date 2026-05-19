import Link from "next/link";
import { MagazineBreadcrumbs } from "@/components/magazine/MagazineBreadcrumbs";

const slides = [
  "https://scavolini-cdn.thron.com/delivery/public/image/scavolini/38e855c9-602c-473e-bc89-53bcbc3d77df/nuctwf/std/1920x0/Formalia_Outdoor_pag_24-25.jpg",
  "https://scavolini-cdn.thron.com/delivery/public/image/scavolini/c1a2f3a2-b315-4191-a88f-5920307e517b/nuctwf/std/1920x0/Formalia_Outdoor_pag_12-13.jpg",
];

export function OutdoorCollectionPage() {
  return (
    <main id="main-content" role="main">
      <div className="landing-formalia">
        <section className="sn_intro_text mt-80 mb-100">
          <div className="container text-center">
            <div className="row justify-content-center">
              <div className="col-12">
                <MagazineBreadcrumbs
                  items={[{ label: "Home", href: "/" }, { label: "Outdoor" }]}
                />
                <h1 className="h1 m-0 mt-30">Formalia Outdoor</h1>
                <div className="col-12 col-md-10 col-xl-8 mx-auto mt-24">
                  <div className="sn_paragraph_lg">
                    <p>
                      Enjoying space, including outside. Formalia Outdoor is our
                      kitchen — designed to be smart — developed for life and{" "}
                      <strong>sociability in the open air</strong> and to
                      accommodate a host of different needs and tastes.
                    </p>
                    <div className="mt-80">
                      <Link
                        href="/ww/company/contacts"
                        className="sn_btn_grow"
                        title="Contact us"
                      >
                        <span className="tx">Request catalogue</span>
                        <span
                          className="sq"
                          aria-hidden="true"
                          data-title="Request catalogue"
                        />
                      </Link>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        <div className="container-fluid">
          <section className="sn_intro_slider my-80">
            <div className="row">
              {slides.map((src) => (
                <div key={src} className="col-12 col-md-6 mb-30">
                  <figure>
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img src={src} alt="" className="w-100" loading="lazy" />
                  </figure>
                </div>
              ))}
            </div>
          </section>
        </div>
      </div>
    </main>
  );
}
