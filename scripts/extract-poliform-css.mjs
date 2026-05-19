import fs from "fs";

const css = fs.readFileSync(process.env.TEMP + "/poliform-app.css", "utf8");

const selectors = [
  "gallery-slider",
  "gallery-slider__slide",
  "gallery-slider__pagination",
  "projects-item__hero",
  "projects-item__product",
  "projects-item-text-2",
  "open-link",
  "custom-technical-accordion",
  "technical_data",
  "technical-card",
  "js-center-mode-slider",
  "center-mode",
  "crumbs",
  "display-1",
  "display-4",
  "display-5",
  "section.my-lg",
  "custom-popover",
  "ratio-16x9",
  "related-articles",
  "single-products",
];

function extractRule(name) {
  const idx = css.indexOf("." + name);
  if (idx < 0) return null;
  let depth = 0;
  let end = idx;
  for (let i = idx; i < Math.min(css.length, idx + 8000); i++) {
    if (css[i] === "{") depth++;
    if (css[i] === "}") {
      depth--;
      if (depth === 0) {
        end = i + 1;
        break;
      }
    }
  }
  return css.slice(idx, end);
}

for (const s of selectors) {
  const rule = extractRule(s);
  if (rule) {
    console.log("\n/* " + s + " */\n" + rule.slice(0, 1200));
  }
}

// count breakpoints
const bps = [...css.matchAll(/@media\s*\((min|max)-width:\s*(\d+)/g)];
const uniq = [...new Set(bps.map((m) => `${m[1]}:${m[2]}`))].sort();
console.log("\n/* breakpoints sample */", uniq.slice(0, 25).join(", "));
