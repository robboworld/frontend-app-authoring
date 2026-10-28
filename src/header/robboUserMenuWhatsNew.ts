/**
 * Copyright (C) 2026 Robbo <https://robbo.ru>
 * SPDX-License-Identifier: AGPL-3.0-only
 *
 * Part of the Robbo Open edX MFE overrides. See NOTICE at repository root.
 */
import { type RefObject, useEffect } from 'react';

export interface RobboWhatsNewState {
  inMenu: boolean;
  unread: number;
  label: string;
  open: () => void;
  pageUrl: string;
}

const TOGGLE = '#user-dropdown-menu';
const MENU = '.dropdown-menu[aria-labelledby="user-dropdown-menu"]';

export const findUserMenuToggle = (shell: HTMLElement | null): HTMLElement | null => (
  shell ? shell.querySelector<HTMLElement>(TOGGLE) : null
);

// Writes only on change: text changes are child mutations and would wake the observer again.
const setText = (node: Node, text: string) => {
  if (node.textContent !== text) {
    // eslint-disable-next-line no-param-reassign
    node.textContent = text;
  }
};

const syncDot = (toggle: HTMLElement, unread: number) => {
  const dot = toggle.querySelector(':scope > .robbo-wn-dot');
  if (!unread) {
    dot?.remove();
    return;
  }
  if (!dot) {
    const span = document.createElement('span');
    span.className = 'robbo-wn-dot';
    span.setAttribute('aria-hidden', 'true');
    toggle.classList.add('robbo-wn-dot-host');
    toggle.appendChild(span);
  }
};

const syncItem = (menu: HTMLElement, whatsNew: RobboWhatsNewState, text: string, toggle: HTMLElement | null) => {
  let item = menu.querySelector<HTMLAnchorElement>(':scope > .robbo-header-whats-new-item');
  if (!whatsNew.inMenu) {
    item?.remove();
    return;
  }
  if (!item) {
    item = document.createElement('a');
    item.className = 'dropdown-item small robbo-wn-item robbo-header-whats-new-item';
    item.setAttribute('role', 'menuitem');
    item.appendChild(document.createElement('span'));
    const count = document.createElement('span');
    count.className = 'robbo-wn-count';
    count.setAttribute('aria-hidden', 'true');
    item.appendChild(count);
  }
  // Right above «Выйти», the last item of the package menu.
  const items = Array.from(menu.querySelectorAll(':scope > .dropdown-item')).filter((node) => node !== item);
  const logout = items[items.length - 1] || null;
  if (item.parentNode !== menu || item.nextSibling !== logout) {
    menu.insertBefore(item, logout);
  }
  item.href = whatsNew.pageUrl;
  setText(item.firstChild as Node, text);
  if (whatsNew.label) {
    item.setAttribute('aria-label', whatsNew.label);
  }
  const count = item.lastChild as HTMLElement;
  count.hidden = !whatsNew.unread;
  setText(count, whatsNew.unread > 9 ? '9+' : String(whatsNew.unread || ''));
  item.onclick = (event) => {
    event.preventDefault();
    if (toggle?.getAttribute('aria-expanded') === 'true') {
      toggle.click();
    }
    whatsNew.open();
  };
};

// The package header owns the user menu, so «Что нового» as a menu item and the dot on its button are kept
// in its markup from outside, like the slot in robboHeaderSlot.ts (staff choose it in account settings).
export const useRobboUserMenuWhatsNew = (
  shellRef: RefObject<HTMLElement>,
  whatsNew: RobboWhatsNewState | null,
  text: string,
) => {
  useEffect(() => {
    const shell = shellRef.current;
    if (!shell || !whatsNew) {
      return undefined;
    }
    let frame: number | null = null;
    const sync = () => {
      frame = null;
      const toggle = findUserMenuToggle(shell);
      if (toggle) {
        syncDot(toggle, whatsNew.inMenu ? whatsNew.unread : 0);
      }
      const menu = shell.querySelector<HTMLElement>(MENU);
      if (menu) {
        syncItem(menu, whatsNew, text, toggle);
      }
    };
    const observer = new MutationObserver(() => {
      if (frame === null) {
        frame = window.requestAnimationFrame(sync);
      }
    });
    sync();
    observer.observe(shell, { childList: true, subtree: true });
    return () => {
      observer.disconnect();
      if (frame !== null) {
        window.cancelAnimationFrame(frame);
      }
    };
  }, [shellRef, whatsNew, text]);
};
