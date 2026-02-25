import Stripe from 'stripe';
import Autolinker from 'autolinker';
import DOMPurify from 'dompurify';
import { marked } from 'marked';
import { html } from 'lit';
import { unsafeHTML } from 'lit/directives/unsafe-html.js';

const RUNTIME_ENVIRONMENT = import.meta.env.PUBLIC_RUNTIME_ENVIRONMENT;

export const emitEvent = (element: HTMLElement, name: string, detail = {}, bubbles = true, composed = true) => {
  element.dispatchEvent(
    new CustomEvent(name, { bubbles, composed, detail }),
  );
};

export const isObjectEmpty = <T extends object>(obj: T): boolean => {
  return Object.entries(obj).length === 0;
}

export const isLocalhost = RUNTIME_ENVIRONMENT === 'local';
export const isDevelopment = RUNTIME_ENVIRONMENT === 'development';
export const isProduction = RUNTIME_ENVIRONMENT === 'production';

export const throttle = <T extends (...args: any[]) => void>(
  func: T,
  delay: number
): T & { cancel: () => void } => {
  let lastCall = 0;
  let timeout: ReturnType<typeof setTimeout> | null = null;

  const throttled = ((...args: Parameters<T>) => {
    const now = Date.now();

    if (now - lastCall >= delay) {
      lastCall = now;
      func(...args);
    } else if (!timeout) {
      timeout = setTimeout(() => {
        lastCall = Date.now();
        timeout = null;
        func(...args);
      }, delay - (now - lastCall));
    }
  }) as T & { cancel: () => void };

  throttled.cancel = () => {
    if (timeout) {
      clearTimeout(timeout);
      timeout = null;
    }
  };

  return throttled;
};

const _stripe: Stripe | null = null;
export const getStripe = () => {
  const test_key = import.meta.env.STRIPE_SECRET_KEY_TEST;
  const live_key = import.meta.env.STRIPE_SECRET_KEY_LIVE;
  const mode = isProduction ? live_key : test_key;

  if (!_stripe) {
    return new Stripe(mode as string);
  }

  return _stripe;
}

export const parseStringToSafeLit = (theString: string) => {
  const sanitizedString = DOMPurify.sanitize(marked.parse(theString) as string);
  return html`${unsafeHTML(Autolinker.link(sanitizedString))}`;
}

export function getPWADisplayMode() {
  const isStandalone = window.matchMedia('(display-mode: standalone)').matches;
  if (document.referrer.startsWith('android-app://')) {
    return 'twa'; // Detected Android Wrapper
  } else if ((navigator as any).standalone || isStandalone) {
    return 'standalone';
  }
  return 'browser';
}


/**
 * Truncates a string to a specified length and appends an ellipsis.
 * * @param str The input string to truncate
 * @param count The maximum character count (including the ellipsis)
 * @returns The truncated string
 */
export const truncateString = (str: string, count: number): string => {
  if (!str || str.length <= count) return str;
  const sub = str.slice(0, count - 3);
  // Find the last space within the substring to avoid splitting words
  const lastSpace = sub.lastIndexOf(' ');
  return (lastSpace > 0 ? sub.slice(0, lastSpace) : sub).trim() + '...';
};

