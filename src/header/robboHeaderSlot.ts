/**
 * Copyright (C) 2026 Robbo <https://robbo.ru>
 * SPDX-License-Identifier: AGPL-3.0-only
 *
 * Part of the Robbo Open edX MFE overrides. See NOTICE at repository root.
 */
import { type RefObject, useEffect, useState } from 'react';

// StudioHeader comes from a package and re-renders on its own, so Robbo buttons cannot be its
// React children: this keeps one element right before the user menu, and the buttons are rendered
// into it through a portal (RobboHeaderExtras.tsx).
export const useRobboHeaderSlot = (shellRef: RefObject<HTMLElement>): HTMLElement | null => {
  const [slot, setSlot] = useState<HTMLElement | null>(null);

  useEffect(() => {
    const shell = shellRef.current;
    if (!shell) {
      return undefined;
    }
    const holder = document.createElement('div');
    holder.className = 'robbo-header-slot';
    let frame: number | null = null;
    const place = () => {
      frame = null;
      const anchor = shell.querySelector('#user-dropdown-menu')?.closest('.nav');
      if (anchor?.parentNode && holder.nextSibling !== anchor) {
        anchor.parentNode.insertBefore(holder, anchor);
      }
    };
    const observer = new MutationObserver(() => {
      if (frame === null) {
        frame = window.requestAnimationFrame(place);
      }
    });
    place();
    observer.observe(shell, { childList: true, subtree: true });
    setSlot(holder);
    return () => {
      observer.disconnect();
      if (frame !== null) {
        window.cancelAnimationFrame(frame);
      }
      holder.remove();
      setSlot(null);
    };
  }, [shellRef]);

  return slot;
};
