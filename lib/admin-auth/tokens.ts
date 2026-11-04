type JwtPayload = {
  exp?: number;
};

function decodeJwtPayload(token: string): JwtPayload | null {
  const parts = token.split(".");
  if (parts.length < 2) return null;

  try {
    const base64 = parts[1].replace(/-/g, "+").replace(/_/g, "/");
    const padded = base64.padEnd(base64.length + ((4 - (base64.length % 4)) % 4), "=");
    const json = Buffer.from(padded, "base64").toString("utf8");
    return JSON.parse(json) as JwtPayload;
  } catch {
    return null;
  }
}

/** Returns true when the token exists and is not expired (JWT `exp` claim). */
export function isAccessTokenValid(token: string | undefined): boolean {
  if (!token?.trim()) return false;

  const payload = decodeJwtPayload(token);
  if (!payload?.exp) return false;

  const nowSeconds = Math.floor(Date.now() / 1000);
  return payload.exp > nowSeconds;
}

export function isRefreshTokenPresent(token: string | undefined): boolean {
  return Boolean(token?.trim());
}
