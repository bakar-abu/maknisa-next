export function getApiBaseUrl(): string {
  return process.env.MAKNISA_API_URL ?? "http://localhost:4000";
}
