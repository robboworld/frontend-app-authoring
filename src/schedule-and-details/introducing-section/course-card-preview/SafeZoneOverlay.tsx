/**
 * Copyright (C) 2026 Robbo <https://robbo.ru>
 * SPDX-License-Identifier: AGPL-3.0-only
 * Part of the Robbo Open edX distribution. See NOTICE at repository root.
 *
 * Safe zone over a card image: SVG in image coordinates whose preserveAspectRatio repeats the
 * image's object-fit/object-position, so the dashed frame sits on the same pixels at any frame size.
 */
import { ImageRect, ImageSize } from './utils';

export type ImageFit = 'cover-top' | 'cover-center' | 'contain';

export interface SafeZone {
  imageSize: ImageSize;
  zone: ImageRect | null;
}

const ASPECT: Record<ImageFit, string> = {
  'cover-top': 'xMidYMin slice',
  'cover-center': 'xMidYMid slice',
  contain: 'xMidYMid meet',
};

interface SafeZoneOverlayProps extends SafeZone {
  fit: ImageFit;
}

const SafeZoneOverlay = ({ imageSize: { width, height }, zone, fit }: SafeZoneOverlayProps) => {
  const image = `M0 0H${width}V${height}H0Z`;
  const shade = zone
    ? `${image}M${zone.x} ${zone.y}h${zone.width}v${zone.height}h${-zone.width}Z`
    : image;

  return (
    <svg
      className={`robbo-card-safe-zone robbo-card-safe-zone--${fit}`}
      viewBox={`0 0 ${width} ${height}`}
      preserveAspectRatio={ASPECT[fit]}
      aria-hidden="true"
      focusable="false"
    >
      <path className="robbo-card-safe-zone__shade" d={shade} fillRule="evenodd" />
      {zone && (
        <>
          <rect
            className="robbo-card-safe-zone__outline"
            x={zone.x}
            y={zone.y}
            width={zone.width}
            height={zone.height}
            vectorEffect="non-scaling-stroke"
          />
          <rect
            className="robbo-card-safe-zone__frame"
            x={zone.x}
            y={zone.y}
            width={zone.width}
            height={zone.height}
            vectorEffect="non-scaling-stroke"
          />
        </>
      )}
    </svg>
  );
};

export default SafeZoneOverlay;
