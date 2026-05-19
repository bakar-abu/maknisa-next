import fs from "fs";

const html = fs.readFileSync(process.env.TEMP + "/poliform-joan.html", "utf8");
const i = html.indexOf('id="k-main"');
const end = html.indexOf("</main>", i);
const main = html.slice(i, end + 7);
fs.writeFileSync("scripts/out-poliform-main-full.html", main);

const classes = new Set();
const re = /class="([^"]+)"/g;
let m;
while ((m = re.exec(main))) {
  m[1].split(/\s+/).forEach((c) => {
    if (c.length > 2) classes.add(c);
  });
}

const productish = [...classes]
  .filter((c) =>
    /product|gallery|hero|breadcrumb|related|catalog|config|technical|swiper|slider|tab|accordion|sticky|grid|display-|k-|single|header|footer|col-|row|btn|modal|fancybox/i.test(
      c,
    ),
  )
  .sort();

console.log("main length", main.length);
console.log("key classes:", productish.length);
productish.forEach((c) => console.log(c));

// structural blocks
for (const marker of [
  "gallery-slider",
  "product-intro",
  "product-",
  "breadcrumb",
  "related-articles",
  "technical",
  "configurate",
  "catalog",
  "accordion",
  "fancybox",
]) {
  const idx = main.indexOf(marker);
  if (idx >= 0) console.log("FOUND", marker, "at", idx);
}
