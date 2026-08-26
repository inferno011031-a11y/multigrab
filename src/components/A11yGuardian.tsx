'use client';

import { useEffect } from 'react';

/**
 * A11yGuardian
 * Actively monitors and fixes accessibility violations that third-party browser extensions
 * (like ChatGPT extensions, Grammarly, translation plugins) inject into the live DOM.
 * 
 * 1. Resets positive tabindex (>0) to 0 or removes it to preserve natural document flow.
 * 2. Injects descriptive aria-labels onto any unlabeled extension buttons.
 */
export function A11yGuardian() {
  useEffect(() => {
    if (typeof window === 'undefined') return;

    const sanitizeExtensionNodes = () => {
      // 1. Fix positive tabindex (tabindex="1", etc.)
      const elementsWithPositiveTabIndex = document.querySelectorAll<HTMLElement>(
        '[tabindex]:not([tabindex="0"]):not([tabindex="-1"])'
      );
      elementsWithPositiveTabIndex.forEach((el) => {
        const val = parseInt(el.getAttribute('tabindex') || '0', 10);
        if (val > 0) {
          el.setAttribute('tabindex', '0');
        }
      });

      // 2. Fix extension buttons missing accessible names (e.g. button.size-10, chat-gpt-query-model)
      const allButtons = document.querySelectorAll<HTMLButtonElement>('button');
      allButtons.forEach((btn) => {
        const hasAriaLabel = btn.hasAttribute('aria-label') || btn.hasAttribute('aria-labelledby');
        const hasTitle = btn.hasAttribute('title');
        const textContent = btn.textContent?.trim() || '';

        if (!hasAriaLabel && !hasTitle && !textContent) {
          if (btn.classList.contains('size-10') || btn.closest('.chat-gpt-query-model')) {
            btn.setAttribute('aria-label', 'Select AI Model');
          } else {
            btn.setAttribute('aria-label', 'Interactive button');
          }
        }
      });
    };

    sanitizeExtensionNodes();

    const observer = new MutationObserver(() => {
      sanitizeExtensionNodes();
    });

    observer.observe(document.body, {
      childList: true,
      subtree: true,
      attributes: true,
      attributeFilter: ['tabindex', 'aria-label'],
    });

    return () => {
      observer.disconnect();
    };
  }, []);

  return null;
}
