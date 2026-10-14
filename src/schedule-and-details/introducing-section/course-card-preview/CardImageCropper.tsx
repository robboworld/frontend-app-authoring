/**
 * Copyright (C) 2026 Robbo <https://robbo.ru>
 * SPDX-License-Identifier: AGPL-3.0-only
 * Part of the Robbo Open edX distribution. See NOTICE at repository root.
 *
 * Crop the course card image to 4:3: a fixed 4:3 frame, the picture moves and zooms under it and
 * stays visible (dimmed) around the frame. Two labelled sets of lines mark where the picture ends:
 * «Каталог» — the whole 4:3 frame; «Мои курсы» — its 16:9 middle (also home page and About page).
 * «Apply» cuts the fragment in a canvas and hands a new file to the field, which uploads it to
 * Files & Uploads and puts it into the form (the original file stays). The new file remembers its
 * original and frame (cropMetadata), so cropping it again starts from the original.
 */
import {
  KeyboardEvent, PointerEvent, useEffect, useRef, useState,
} from 'react';
import { useIntl } from '@edx/frontend-platform/i18n';
import {
  ActionRow, Alert, Button, Form, Icon, ModalDialog, StatefulButton,
} from '@openedx/paragon';
import { Info } from '@openedx/paragon/icons';

import { CropMetadata, readCropMetadata, writeCropMetadata } from './cropMetadata';
import {
  CropRect,
  cropToBlob,
  getCropFileName,
  getCropZoom,
  getInitialCrop,
  getMaxZoom,
  getOutputSize,
  ImageSize,
  isBelowRecommended,
  moveCrop,
  RECOMMENDED_IMAGE,
  restoreCrop,
  zoomCrop,
} from './utils';
import messages from './messages';

interface CardImageCropperProps {
  isOpen: boolean;
  imageUrl: string;
  onClose: () => void;
  onApply: (file: File) => Promise<void>;
}

const KEY_STEP = 0.02;
const KEY_STEP_LARGE = 0.1;
const ZOOM_STEP = 1.1;

interface LoadedImage {
  image: HTMLImageElement;
  bytes: Uint8Array;
}

// Through fetch: the bytes carry the crop metadata, and a blob: URL keeps the canvas untainted.
const loadImage = async (url: string): Promise<LoadedImage> => {
  const response = await fetch(url, { credentials: 'same-origin' });
  if (!response.ok) {
    throw new Error(`Image request failed: ${response.status}`);
  }
  const blob = await response.blob();
  const image = await new Promise<HTMLImageElement>((resolve, reject) => {
    const element = new Image();
    element.onload = () => resolve(element);
    element.onerror = reject;
    element.src = URL.createObjectURL(blob);
  });
  return { image, bytes: new Uint8Array(await blob.arrayBuffer()) };
};

type SourceState = 'current' | 'original' | 'original-missing';

interface CropSource {
  image: HTMLImageElement;
  path: string; // URL-encoded asset path the crop is cut from
  state: SourceState;
  crop: CropRect;
}

/** The original of an earlier crop (with its frame) when it is still there, else the image itself. */
const loadCropSource = async (imageUrl: string): Promise<CropSource> => {
  const current = await loadImage(imageUrl);
  const sizeOf = (image: HTMLImageElement) => ({ width: image.naturalWidth, height: image.naturalHeight });
  const metadata: CropMetadata | null = readCropMetadata(current.bytes);
  if (metadata) {
    try {
      const original = await loadImage(new URL(metadata.source, imageUrl).href);
      URL.revokeObjectURL(current.image.src);
      return {
        image: original.image,
        path: metadata.source,
        state: 'original',
        crop: restoreCrop(metadata, sizeOf(original.image)),
      };
    } catch {
      // the original was deleted or renamed: crop the image itself
    }
  }
  return {
    image: current.image,
    path: new URL(imageUrl).pathname,
    state: metadata ? 'original-missing' : 'current',
    crop: getInitialCrop(sizeOf(current.image)),
  };
};

const CardImageCropper = ({
  isOpen, imageUrl, onClose, onApply,
}: CardImageCropperProps) => {
  const intl = useIntl();
  const viewportRef = useRef<HTMLDivElement>(null);
  const frameRef = useRef<HTMLDivElement>(null);
  const dragRef = useRef<{ x: number, y: number } | null>(null);
  const [source, setSource] = useState<CropSource | null>(null);
  const image = source?.image || null;
  const [crop, setCrop] = useState<CropRect | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [isApplying, setIsApplying] = useState(false);

  useEffect(() => {
    if (!isOpen) {
      return undefined;
    }
    let isActive = true;
    let loaded: CropSource | null = null;
    setSource(null);
    setCrop(null);
    setError(null);
    loadCropSource(imageUrl)
      .then((result) => {
        loaded = result;
        if (isActive) {
          setSource(result);
          setCrop(result.crop);
        }
      })
      .catch(() => isActive && setError(intl.formatMessage(messages.cropLoadError)));
    return () => {
      isActive = false;
      if (loaded) {
        URL.revokeObjectURL(loaded.image.src);
      }
    };
  }, [isOpen, imageUrl]);

  const size: ImageSize | null = image && { width: image.naturalWidth, height: image.naturalHeight };
  const maxZoom = size ? getMaxZoom(size) : 1;
  const zoom = size && crop ? getCropZoom(crop, size) : 1;
  const output = crop && getOutputSize(crop);

  // A picture too small to zoom: say why the slider is off and where the crop can still move
  // (otherwise the dimmed picture around the frame shows it).
  const spansWidth = Boolean(size && crop && crop.width >= size.width - 0.5);
  const spansHeight = Boolean(size && crop && crop.height >= size.height - 0.5);
  let lockedHint = null;
  if (size && maxZoom <= 1) {
    if (spansWidth && spansHeight) {
      lockedHint = messages.cropLockedBothSmall;
    } else if (spansHeight) {
      lockedHint = messages.cropLockedVerticalSmall;
    } else if (spansWidth) {
      lockedHint = messages.cropLockedHorizontalSmall;
    }
  }

  // Wheel zoom needs a non-passive listener to keep the page from scrolling.
  useEffect(() => {
    const viewport = viewportRef.current;
    if (!viewport || !image) {
      return undefined;
    }
    const imageSize = { width: image.naturalWidth, height: image.naturalHeight };
    const handleWheel = (event: globalThis.WheelEvent) => {
      event.preventDefault();
      const factor = event.deltaY < 0 ? ZOOM_STEP : 1 / ZOOM_STEP;
      setCrop((current) => current && zoomCrop(current, getCropZoom(current, imageSize) * factor, imageSize));
    };
    viewport.addEventListener('wheel', handleWheel, { passive: false });
    return () => viewport.removeEventListener('wheel', handleWheel);
  }, [image]);

  const move = (dxImage: number, dyImage: number) => {
    if (size) {
      setCrop((current) => current && moveCrop(current, dxImage, dyImage, size));
    }
  };
  const setZoom = (value: number) => {
    if (size) {
      setCrop((current) => current && zoomCrop(current, value, size));
    }
  };
  // Screen pixels → image pixels at the current zoom.
  const toImage = (pixels: number) => {
    const width = frameRef.current?.getBoundingClientRect().width || 1;
    return crop ? (pixels * crop.width) / width : 0;
  };

  const handlePointerDown = (event: PointerEvent<HTMLDivElement>) => {
    try {
      event.currentTarget.setPointerCapture(event.pointerId);
    } catch {
      // the drag still works while the pointer stays over the frame
    }
    dragRef.current = { x: event.clientX, y: event.clientY };
  };
  const handlePointerMove = (event: PointerEvent<HTMLDivElement>) => {
    if (!dragRef.current) {
      return;
    }
    const dx = event.clientX - dragRef.current.x;
    const dy = event.clientY - dragRef.current.y;
    dragRef.current = { x: event.clientX, y: event.clientY };
    // Dragging the picture right shows more of its left side.
    move(-toImage(dx), -toImage(dy));
  };
  const handlePointerUp = () => {
    dragRef.current = null;
  };
  const handleKeyDown = (event: KeyboardEvent<HTMLDivElement>) => {
    if (!crop) {
      return;
    }
    const step = crop.width * (event.shiftKey ? KEY_STEP_LARGE : KEY_STEP);
    const moves: Record<string, [number, number]> = {
      ArrowLeft: [-step, 0], ArrowRight: [step, 0], ArrowUp: [0, -step], ArrowDown: [0, step],
    };
    if (moves[event.key]) {
      move(...moves[event.key]);
    } else if (event.key === '+' || event.key === '=') {
      setZoom(zoom * ZOOM_STEP);
    } else if (event.key === '-' || event.key === '_') {
      setZoom(zoom / ZOOM_STEP);
    } else {
      return;
    }
    event.preventDefault();
  };

  const handleApply = async () => {
    if (!source || !crop) {
      return;
    }
    setIsApplying(true);
    setError(null);
    try {
      const fileName = getCropFileName(source.path);
      const blob = await writeCropMetadata(await cropToBlob(source.image, crop, fileName), {
        source: source.path, x: crop.x, y: crop.y, width: crop.width,
      });
      await onApply(new File([blob], fileName, { type: blob.type }));
      onClose();
    } catch (exception) {
      setError(intl.formatMessage(
        exception instanceof DOMException && exception.name === 'SecurityError'
          ? messages.cropCanvasError
          : messages.cropUploadError,
      ));
    } finally {
      setIsApplying(false);
    }
  };

  // Image box in % of the 4:3 frame: the crop fills the frame.
  const imageStyle = size && crop ? {
    height: `${(size.height / crop.height) * 100}%`,
    left: `${(-crop.x / crop.width) * 100}%`,
    top: `${(-crop.y / crop.height) * 100}%`,
    width: `${(size.width / crop.width) * 100}%`,
  } : undefined;

  return (
    <ModalDialog
      title={intl.formatMessage(messages.cropTitle)}
      isOpen={isOpen}
      onClose={onClose}
      size="lg"
      hasCloseButton
      isOverflowVisible={false}
    >
      <ModalDialog.Header>
        <ModalDialog.Title>{intl.formatMessage(messages.cropTitle)}</ModalDialog.Title>
      </ModalDialog.Header>
      <ModalDialog.Body>
        <div className="robbo-card-cropper">
          <div
            ref={viewportRef}
            className="robbo-card-cropper__viewport"
            role="group"
            tabIndex={0}
            aria-label={intl.formatMessage(messages.cropViewportLabel)}
            aria-describedby="robbo-card-cropper-help"
            onPointerDown={handlePointerDown}
            onPointerMove={handlePointerMove}
            onPointerUp={handlePointerUp}
            onPointerCancel={handlePointerUp}
            onKeyDown={handleKeyDown}
          >
            <div ref={frameRef} className="robbo-card-cropper__frame">
              {image && imageStyle && (
                <img className="robbo-card-cropper__image" src={image.src} alt="" style={imageStyle} draggable={false} />
              )}
              <div className="robbo-card-cropper__shade" aria-hidden="true" />
              <div className="robbo-card-cropper__bounds robbo-card-cropper__bounds--catalog" aria-hidden="true">
                <span className="robbo-card-cropper__label robbo-card-cropper__label--catalog">
                  {intl.formatMessage(messages.cropLabelCatalog)}
                </span>
              </div>
              <div className="robbo-card-cropper__bounds robbo-card-cropper__bounds--dashboard" aria-hidden="true">
                <span className="robbo-card-cropper__label robbo-card-cropper__label--dashboard">
                  {intl.formatMessage(messages.cropLabelDashboard)}
                </span>
              </div>
            </div>
          </div>
          <div className="robbo-card-cropper__controls">
            {source && source.state !== 'current' && (
              <p className="robbo-card-cropper__text robbo-card-cropper__text--source">
                {intl.formatMessage(
                  source.state === 'original' ? messages.cropFromOriginal : messages.cropOriginalMissing,
                )}
              </p>
            )}
            <p className="robbo-card-cropper__text" id="robbo-card-cropper-help">
              {intl.formatMessage(messages.cropHelp)}
            </p>
            <p className="robbo-card-cropper__text">{intl.formatMessage(messages.cropLegend)}</p>
            <Form.Group className="robbo-card-cropper__zoom">
              <Form.Label htmlFor="robbo-card-cropper-zoom">{intl.formatMessage(messages.cropZoom)}</Form.Label>
              <input
                id="robbo-card-cropper-zoom"
                className="robbo-card-cropper__zoom-range"
                type="range"
                min={1}
                max={maxZoom}
                step={0.01}
                value={zoom}
                disabled={!crop || maxZoom <= 1}
                onChange={(event) => setZoom(Number(event.target.value))}
              />
            </Form.Group>
            {lockedHint && (
              <p className="robbo-card-cropper__text robbo-card-cropper__text--hint" role="status">
                <Icon src={Info} size="xs" className="robbo-card-cropper__hint-icon" />
                {intl.formatMessage(lockedHint)}
              </p>
            )}
            {output && (
              <p className="robbo-card-cropper__text">
                {intl.formatMessage(messages.cropResult, output)}
                {isBelowRecommended(output) && ` ${intl.formatMessage(messages.cropResultSmall, RECOMMENDED_IMAGE)}`}
              </p>
            )}
            {error && <Alert variant="danger" className="mb-0">{error}</Alert>}
          </div>
        </div>
      </ModalDialog.Body>
      <ModalDialog.Footer>
        <ActionRow>
          <Button
            variant="tertiary"
            disabled={!size || isApplying}
            onClick={() => size && setCrop(getInitialCrop(size))}
          >
            {intl.formatMessage(messages.cropReset)}
          </Button>
          <ActionRow.Spacer />
          <ModalDialog.CloseButton variant="tertiary">
            {intl.formatMessage(messages.cropCancel)}
          </ModalDialog.CloseButton>
          <StatefulButton
            state={isApplying ? 'pending' : 'default'}
            labels={{
              default: intl.formatMessage(messages.cropApply),
              pending: intl.formatMessage(messages.cropApplying),
            }}
            disabledStates={['pending']}
            disabled={!crop}
            onClick={handleApply}
          />
        </ActionRow>
      </ModalDialog.Footer>
    </ModalDialog>
  );
};

export default CardImageCropper;
