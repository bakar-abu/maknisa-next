/** Direct file extensions the HTML video player can load. */
const DIRECT_VIDEO_PATTERN =
  /\.(mp4|webm|m4v|mov)(\?.*)?$/i;

const PAGE_URL_PATTERNS: { pattern: RegExp; message: string }[] = [
  {
    pattern: /pexels\.com\/video\//i,
    message:
      "This is a Pexels page link. Download the video from Pexels and use the direct .mp4 file URL, or upload the file to Supabase Storage.",
  },
  {
    pattern: /youtube\.com\/watch|youtu\.be\//i,
    message: "YouTube page links cannot play in the slider. Use a direct .mp4 file URL instead.",
  },
  {
    pattern: /vimeo\.com\/\d+/i,
    message: "Vimeo page links cannot play in the slider. Use a direct .mp4 file URL instead.",
  },
];

export function resolveVideoUrl(path: string): string {
  if (!path) return "";
  if (path.startsWith("http")) return path;
  return path.startsWith("/") ? path : `/${path}`;
}

export function isDirectVideoUrl(url: string): boolean {
  const trimmed = url.trim();
  if (!trimmed) return false;
  return DIRECT_VIDEO_PATTERN.test(trimmed);
}

export function getVideoUrlIssue(url: string): string | null {
  const trimmed = url.trim();
  if (!trimmed) return null;

  for (const entry of PAGE_URL_PATTERNS) {
    if (entry.pattern.test(trimmed)) {
      return entry.message;
    }
  }

  if (!isDirectVideoUrl(trimmed) && trimmed.startsWith("http")) {
    return "Use a direct video file URL ending in .mp4, .webm, or .m4v — not a website page.";
  }

  return null;
}
