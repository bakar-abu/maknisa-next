import { getApiBaseUrl } from "@/lib/api-config";

/** Keep under Vercel’s ~60s static page budget (many pages fetch in parallel). */
const FETCH_TIMEOUT_MS = 8_000;

/**
 * On Vercel, never call localhost — TCP hangs until the page build times out.
 * Local/dev still uses localhost when MAKNISA_API_URL is unset.
 */
export function canReachRemoteApi(): boolean {
  const configured = process.env.MAKNISA_API_URL?.trim();
  if (!process.env.VERCEL) return true;
  if (!configured) return false;
  if (/localhost|127\.0\.0\.1/i.test(configured)) return false;
  return true;
}

export async function fetchPublicJson<T>(
  path: string,
  options?: { revalidate?: number },
): Promise<T | null> {
  if (!canReachRemoteApi()) return null;

  try {
    const response = await fetch(`${getApiBaseUrl()}${path}`, {
      next: { revalidate: options?.revalidate ?? 30 },
      signal: AbortSignal.timeout(FETCH_TIMEOUT_MS),
    });
    if (!response.ok) return null;
    return (await response.json()) as T;
  } catch {
    return null;
  }
}
