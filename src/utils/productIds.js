/**
 * Parse product id from the URL segment. Fake Store uses positive integer ids.
 * @param {string | undefined} raw
 * @returns {number | null}
 */
export function parseProductRouteId(raw) {
  if (raw == null || raw === "") return null;
  const n = Number.parseInt(String(raw), 10);
  if (!Number.isFinite(n) || n < 1) return null;
  return n;
}
