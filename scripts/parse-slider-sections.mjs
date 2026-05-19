import fs from "fs";

const html = fs.readFileSync(
  "public/www.scavolini.com/ww/index.html",
  "utf8",
);

function normalizeMedia(path) {
  if (!path) return "";
  return path.replace(/^\.\.\//, "/").replace(/\/ww\/\//, "/ww/");
}

function normalizeVideo(path) {
  if (!path) return "";
  const p = path.replace(/\/ww\/\//, "/ww/");
  return p.startsWith("http") ? p : `https://www.scavolini.com${p}`;
}

const sections = [];
const re = /<section class="sn_slider_video">([\s\S]*?)<\/section>/g;
let match;

while ((match = re.exec(html)) !== null) {
  const chunk = match[1];
  const title =
    chunk.match(/sn_slider_info_title[^>]*>([^<]+)/)?.[1]?.trim() ?? "";
  const description =
    chunk.match(/sn_slider_info_txt[^>]*>([\s\S]*?)<\/div>/)?.[1]?.trim() ?? "";

  const ctas = [];
  const ctaRe =
    /<a href="([^"]*)"[^>]*class="([^"]*)"[^>]*>[\s\S]*?<span class="tx">([^<]*)<\/span>/g;
  let cm;
  while ((cm = ctaRe.exec(chunk)) !== null) {
    if (cm[3].trim()) {
      ctas.push({
        href: cm[1].replace(/\.html$/, "").replace(/^([^/])/, "/$1"),
        className: cm[2],
        label: cm[3].trim(),
      });
    }
  }

  const thumbPart =
    chunk.split('class="swiper swiperThumb"')[1]?.split("</section>")[0] ?? "";
  const thumbSlides = [];
  const thumbRe =
    /class="swiper-slide" data-link="([^"]*)"[\s\S]*?class="title">([^<]+)<\/div>[\s\S]*?src="([^"]+)"/g;
  let tm;
  while ((tm = thumbRe.exec(thumbPart)) !== null) {
    thumbSlides.push({
      link: tm[1],
      title: tm[2].trim(),
      image: normalizeMedia(tm[3]),
    });
  }

  const slides = [];
  const videoPart =
    chunk.split('class="swiper swiperVideo"')[1]?.split('class="swiper swiperThumb"')[0] ??
    "";
  const slideRe =
    /class="swiper-slide"[\s\S]*?class="desktop"[^>]*data-url="([^"]*)"[\s\S]*?class="mobile"[^>]*data-url="([^"]*)"/g;
  let sm;
  while ((sm = slideRe.exec(videoPart)) !== null) {
    slides.push({
      desktop: normalizeVideo(sm[1]),
      mobile: normalizeVideo(sm[2]),
    });
  }

  sections.push({
    title,
    description: description.replace(/\s+/g, " "),
    ctas,
    thumbSlides,
    slides,
  });
}

const out = `// Generated from reference index.html
export type SliderCta = { href: string; className: string; label: string };
export type SliderThumb = { link: string; title: string; image: string };
export type SliderSlide = { desktop: string; mobile: string };

export type HomeVideoSection = {
  title: string;
  description: string;
  ctas: SliderCta[];
  thumbSlides: SliderThumb[];
  slides: SliderSlide[];
};

export const homeVideoSections: HomeVideoSection[] = ${JSON.stringify(sections, null, 2)};
`;

fs.writeFileSync("lib/homeSliders.ts", out);
console.log(
  "sections",
  sections.length,
  sections.map((s) => `${s.title}: ${s.thumbSlides.length} thumbs, ${s.slides.length} videos`),
);
