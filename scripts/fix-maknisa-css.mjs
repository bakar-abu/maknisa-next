import fs from "fs";
import path from "path";

const BRAND = "#F99106";
const files = [
  path.resolve("public/styles/maknisa.css"),
  path.resolve("app/styles/maknisa.css"),
];

const colorReplacements = [
  [/#c00d0e/gi, BRAND],
  [/#c00019/gi, BRAND],
  [/#C00D0D/gi, BRAND],
  [/#b91d47/gi, BRAND],
  [/%23c00d0e/gi, "%236B4411"],
  [/%23c00019/gi, "%236B4411"],
  [/rgb\(\s*192\s*,\s*13\s*,\s*14\s*\)/gi, "rgb(107, 68, 17)"],
  [/rgb\(\s*192\s*,\s*0\s*,\s*25\s*\)/gi, "rgb(107, 68, 17)"],
];

for (const cssPath of files) {
  if (!fs.existsSync(cssPath)) continue;

  let css = fs.readFileSync(cssPath, "utf8");
  let count = 0;

  css = css
    .replace(/@use\s+['"]sass:[^'"]+['"];?/g, "")
    .replace(/^@charset\s+["']UTF-8["'];?/m, '@charset "UTF-8";');

  for (const [pattern, replacement] of colorReplacements) {
    const matches = css.match(pattern);
    if (matches) count += matches.length;
    css = css.replace(pattern, replacement);
  }

  fs.writeFileSync(cssPath, css);
  console.log(`Updated ${cssPath} (${count} color replacements)`);
}
