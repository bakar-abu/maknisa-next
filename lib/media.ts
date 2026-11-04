/** Catalog media origin for relative asset paths. */
const CATALOG_MEDIA_ORIGIN = "https://www.scavolini.com";

export function mediaUrl(path: string): string {
  if (!path) return "";
  if (path.startsWith("http")) return path;
  return `${CATALOG_MEDIA_ORIGIN}${path.startsWith("/") ? path : `/${path}`}`;
}
