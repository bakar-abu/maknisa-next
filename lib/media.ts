/** Media CDN (reference assets hosted on scavolini.com) */
const REFERENCE_MEDIA_ORIGIN = "https://www.scavolini.com";

export function mediaUrl(path: string): string {
  if (!path) return "";
  if (path.startsWith("http")) return path;
  return `${REFERENCE_MEDIA_ORIGIN}${path.startsWith("/") ? path : `/${path}`}`;
}
