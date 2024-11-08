/** Helper for fetch calls during SSR */
export function getBaseUrl() {
  if (typeof window !== "undefined") {
    return "";
  }
  return "http://localhost:3000";
}
