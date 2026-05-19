import fs from "fs";
import path from "path";

const out = (name, content) => {
  fs.writeFileSync(path.join("components/company", name), content.trim() + "\n");
};

out(
  "CommunicationCompanyPage.tsx",
  `import { MagazineBreadcrumbs } from "@/components/magazine/MagazineBreadcrumbs";
import { communicationContent, companyPages } from "@/lib/company-pages";
import { site } from "@/lib/site";
import Link from "next/link";

export function CommunicationCompanyPage() {
  const page = companyPages.communication;
  const c = communicationContent;

  return (
    <main id="main-content" role="main">
      <section className="sn_intro_text mt-80 mb-100">
        <div className="container">
          <motion.div className="row justify-content-center">
            <div className="col-10 col-sm-11 col-md-12 ml-auto col-lg-10 col-xl-8 mx-md-0 mb-40">
              <MagazineBreadcrumbs items={page.breadcrumbs} />
            </div>
          </div>
        </div>
        <div className="sn_vertical_text">
          <div className="sn_vertical_text_in py-10 py-lg-60">
            <div className="h1 m-0">{c.verticalLabel}</div>
          </div>
        </div>
        <div className="container">
          <div className="row justify-content-center">
            <div className="col-10 col-sm-11 col-md-12 ml-auto col-lg-10 col-xl-8 mx-md-0">
              <h1 className="h3 m-0">{c.subtitle}</h1>
            </div>
            <div className="col-10 col-sm-11 col-md-12 ml-auto col-lg-10 col-xl-8 mt-40 mx-md-0">
              <div className="sn_paragraph_lg">{c.intro}</div>
            </motion.div>
          </motion.div>
        </motion.div>
      </section>

      <section className="sn_image_full _right mt-80 mb-100 mt-lg-180 mb-lg-240">
        <div className="sn_image_full_ct container-md text-center">
          <figure>
            <picture>
              <img src={c.bannerImage} alt="" className="_full" loading="lazy" />
            </picture>
          </figure>
        </motion.div>
      </section>

      <section className="sn_text py-70 py-lg-120 bg-light">
        <div className="container">
          <div className="row mb-60">
            <div className="col-12 col-lg-9">
              <h2 className="h3 mb-30">{c.pressTitle}</h2>
              <div className="sn_paragraph_lg _strong_primary">{c.pressIntro}</div>
            </motion.div>
          </motion.div>
          <div className="row">
            {c.pressItems.map((item) => (
              <div key={item.title} className="col-12 col-md-6 col-lg-3 mb-40">
                <motion.div className="mb-10 text-primary font-weight-bold">{item.year}</motion.div>
                <h3 className="h4 _sans text-primary mb-20">{item.title}</h3>
                <div className="sn_paragraph">{item.excerpt}</motion.div>
              </motion.div>
            ))}
          </motion.div>
          <div className="row mt-60">
            <div className="col-12 col-lg-8">
              <h2 className="h3 mb-20">{c.socialTitle}</h2>
              <p className="sn_paragraph_lg mb-30">{c.socialText}</p>
              <ul className="sn_paragraph">
                <li><Link href="https://www.facebook.com/profile.php?id=61587874235637" target="_blank" rel="noopener noreferrer">Facebook</Link></li>
                <li><Link href="https://www.instagram.com/maknisaofficial" target="_blank" rel="noopener noreferrer">Instagram</Link></li>
                <li><Link href="https://twitter.com/maknisapk" target="_blank" rel="noopener noreferrer">Twitter</Link></li>
                <li><Link href="https://www.tiktok.com/@maknisa.official" target="_blank" rel="noopener noreferrer">TikTok</Link></li>
              </ul>
            </motion.div>
          </motion.div>
        </motion.div>
      </section>
    </main>
  );
}
`,
);

// fix motion.div in generated - run split join
for (const f of fs.readdirSync("components/company")) {
  if (!f.endsWith(".tsx")) continue;
  const p = path.join("components/company", f);
  let c = fs.readFileSync(p, "utf8");
  c = c.split("</motion.div>").join("</motion.div>");
  c = c.split("<motion.div").join("<motion.div");
  fs.writeFileSync(p, c);
}

console.log("generated");
