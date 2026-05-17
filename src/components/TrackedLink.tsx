import { forwardRef, type AnchorHTMLAttributes, type MouseEvent } from "react";

declare global {
  interface Window {
    dataLayer?: Array<Record<string, unknown>>;
  }
}

interface Props extends AnchorHTMLAttributes<HTMLAnchorElement> {
  href: string;
  /** GTM/dataLayer event name. */
  event: string;
  /** Extra payload merged into the dataLayer push. */
  payload?: Record<string, unknown>;
}

/**
 * Anchor wrapper that emits a dataLayer event on click. If GTM/dataLayer
 * isn't loaded (e.g. cookie consent denied), behaves like a plain <a>.
 * Honors the consumer's own onClick by chaining it after the push.
 */
export const TrackedLink = forwardRef<HTMLAnchorElement, Props>(
  ({ href, event, payload, onClick, children, ...rest }, ref) => {
    const handleClick = (e: MouseEvent<HTMLAnchorElement>) => {
      if (typeof window !== "undefined" && Array.isArray(window.dataLayer)) {
        try {
          window.dataLayer.push({ event, ...payload });
        } catch {
          // never block navigation on a tracking error
        }
      }
      onClick?.(e);
    };
    return (
      <a ref={ref} href={href} onClick={handleClick} {...rest}>
        {children}
      </a>
    );
  }
);
TrackedLink.displayName = "TrackedLink";
