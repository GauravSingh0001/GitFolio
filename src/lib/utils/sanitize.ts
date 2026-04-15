/**
 * Lightweight HTML escape for template rendering.
 *
 * All values passed to this function come from user-typed plain-text fields
 * (names, bios, skill names, descriptions, etc.) — not from raw untrusted HTML.
 * Standard entity encoding is sufficient to prevent XSS in the generated output
 * without the overhead of jsdom + DOMPurify (which caused Vercel serverless
 * function cold-start failures when the module failed to initialise).
 */
export function sanitizeHTML(text: string): string {
  return String(text)
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#x27;");
}
