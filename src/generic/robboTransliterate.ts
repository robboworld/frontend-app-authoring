/**
 * Copyright (C) 2026 Robbo <https://robbo.ru>
 * SPDX-License-Identifier: AGPL-3.0-only
 * Part of the Robbo Open edX distribution. See NOTICE at repository root.
 *
 * Russian → Latin for file names: course file links keep only Latin letters reliably
 * (`/static/` links are not percent-decoded by the platform).
 */
const RU_TO_LATIN: Record<string, string> = {
  а: 'a',
  б: 'b',
  в: 'v',
  г: 'g',
  д: 'd',
  е: 'e',
  ё: 'e',
  ж: 'zh',
  з: 'z',
  и: 'i',
  й: 'y',
  к: 'k',
  л: 'l',
  м: 'm',
  н: 'n',
  о: 'o',
  п: 'p',
  р: 'r',
  с: 's',
  т: 't',
  у: 'u',
  ф: 'f',
  х: 'kh',
  ц: 'ts',
  ч: 'ch',
  ш: 'sh',
  щ: 'shch',
  ъ: '',
  ы: 'y',
  ь: '',
  э: 'e',
  ю: 'yu',
  я: 'ya',
};

export const transliterate = (text: string): string => (
  Array.from(text.normalize('NFC').toLowerCase()).map(char => RU_TO_LATIN[char] ?? char).join('')
);

/** `Урок 3. Датчики` → `urok-3-datchiki`: Latin letters, digits, `_` and `-`, at most `maxLength`. */
export const toFileSlug = (text: string, maxLength = 40): string => (
  transliterate(text)
    .replace(/[^a-z0-9_-]+/g, '-')
    .replace(/-{2,}/g, '-')
    .replace(/^-+|-+$/g, '')
    .slice(0, maxLength)
    .replace(/-+$/g, '')
);
