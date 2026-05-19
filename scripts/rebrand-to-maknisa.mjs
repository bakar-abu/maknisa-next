import fs from "fs";
import path from "path";

const ROOT = path.resolve(".");

const SKIP_DIRS = new Set([
  "node_modules",
  ".next",
  "out",
  "build",
  ".git",
]);

const EXTENSIONS = new Set([
  ".ts",
  ".tsx",
  ".css",
  ".mjs",
  ".json",
  ".md",
]);

/** URLs/paths that must keep maknisa.com hostnames for CDN/mirror assets */
const PRESERVE_SUBSTRINGS = [
  "www.scavolini.com",
  "scavolini-cdn.thron.com",
  "scavolini.net",
  "scavolini.cn",
  "www.scavolini.cn",
  "/image/scavolini/",
  "public/www.scavolini.com",
];

function shouldProcessFile(filePath) {
  const rel = path.relative(ROOT, filePath).replace(/\\/g, "/");
  if (rel.startsWith("public/www.")) return false;
  if (rel.includes("public/www.scavolini.com")) return false;
  const ext = path.extname(filePath);
  return EXTENSIONS.has(ext);
}

function replaceOutsideUrls(text) {
  const urlRegex = /https?:\/\/[^\s"'<>]+/g;
  let result = "";
  let last = 0;
  let match;

  while ((match = urlRegex.exec(text)) !== null) {
    const before = text.slice(last, match.index);
    result += replaceBrandTokens(before);
    result += match[0];
    last = match.index + match[0].length;
  }
  result += replaceBrandTokens(text.slice(last));
  return result;
}

function replaceBrandTokens(chunk) {
  return chunk
    .replace(/Maknisa/g, "Maknisa")
    .replace(/MAKNISA/g, "MAKNISA")
    .replace(/maknisa/g, (match, offset, str) => {
      const slice = str.slice(Math.max(0, offset - 40), offset + match.length + 40);
      if (PRESERVE_SUBSTRINGS.some((p) => slice.includes(p))) return match;
      return "maknisa";
    });
}

function walk(dir, files = []) {
  for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
    if (SKIP_DIRS.has(entry.name)) continue;
    const full = path.join(dir, entry.name);
    if (entry.isDirectory()) walk(full, files);
    else if (shouldProcessFile(full)) files.push(full);
  }
  return files;
}

const files = walk(ROOT);
let changed = 0;

for (const file of files) {
  const original = fs.readFileSync(file, "utf8");
  const updated = replaceOutsideUrls(original);
  if (updated !== original) {
    fs.writeFileSync(file, updated);
    changed++;
    console.log("updated:", path.relative(ROOT, file));
  }
}

console.log(`\nDone. ${changed} file(s) updated.`);
