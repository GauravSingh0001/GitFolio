import DOMPurify from "dompurify";
import { JSDOM } from "jsdom";

/**
 * Server-side HTML sanitization using DOMPurify + jsdom.
 * Strips XSS vectors from GitHub README HTML content.
 */
export function sanitizeHTML(dirtyHTML: string): string {
  const window = new JSDOM("").window;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const purify = DOMPurify(window as any);

  return purify.sanitize(dirtyHTML, {
    ALLOWED_TAGS: [
      "h1", "h2", "h3", "h4", "h5", "h6",
      "p", "br", "hr",
      "ul", "ol", "li",
      "a", "strong", "em", "code", "pre", "blockquote",
      "img", "table", "thead", "tbody", "tr", "th", "td",
      "span", "div", "section",
    ],
    ALLOWED_ATTR: ["href", "src", "alt", "class", "id", "target", "rel"],
    ALLOW_DATA_ATTR: false,
  });
}
