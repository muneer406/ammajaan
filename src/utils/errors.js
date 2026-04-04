/**
 * User-facing message for HTTP / network failures (axios-compatible).
 */
export function getRequestErrorMessage(
  error,
  fallback = "Something went wrong. Please try again.",
) {
  if (error == null) return fallback;
  if (typeof error === "string") return error;

  if (error.code === "INVALID_PRODUCT_ID") {
    return "This product link is invalid.";
  }
  if (error.code === "BAD_RESPONSE") {
    return "Received an unexpected response from the server. Please try again.";
  }

  if (error.code === "ERR_CANCELED" || error.name === "CanceledError") {
    return "Request was cancelled.";
  }

  const status = error.response?.status;

  if (status === 404) {
    return "We could not find what you were looking for.";
  }
  if (status === 408 || error.code === "ECONNABORTED") {
    return "The request timed out. Check your connection and try again.";
  }
  if (!error.response) {
    return "Network error. Check your internet connection and try again.";
  }
  if (status === 523) {
    return "The product API is temporarily unreachable (often a host outage). Try again in a few minutes.";
  }
  if (status >= 500) {
    return "The server is having trouble. Please try again in a moment.";
  }

  const data = error.response?.data;
  if (typeof data === "string" && data.trim()) return data.trim();
  if (data && typeof data === "object" && data.message != null) {
    return String(data.message);
  }

  return fallback;
}
