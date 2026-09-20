/**
 * Tecton Avatar.
 *
 * A person or a thing, shown as an image, initials or a glyph. Tecton draws
 * avatars at four literal sizes — 40, 32, 24 and 18 px — so `size` is a number
 * rather than a name.
 */
import type {MouseEventHandler, ReactNode} from 'react';
import {Avatar as BaseAvatar} from '@astryxdesign/core/Avatar';

/** Corner treatment. */
export type AvatarShape = 'circle' | 'rounded' | 'square';

/** The four diameters Tecton draws avatars at, in pixels. */
export type AvatarSize = 18 | 24 | 32 | 40;

/**
 * The size scale underneath has no 18px tier, so Tecton's smallest avatar is
 * drawn at 20px — the nearest rung. Recorded in the component's docs.
 */
const SIZE = {18: 20, 24: 24, 32: 32, 40: 40} as const satisfies Record<
  AvatarSize,
  number
>;

export interface AvatarProps {
  /** The name behind the avatar: the initials, the alt text and the tooltip. */
  name?: string;
  /** Image to show instead of initials. */
  src?: string;
  /** Image to fall back to when `src` fails to load. */
  fallbackSrc?: string;
  /** Alt text, when it should differ from the name. */
  alt?: string;
  /**
   * Diameter in pixels.
   * @default 32
   */
  size?: AvatarSize;
  /**
   * Corner treatment.
   * @default 'circle'
   */
  shape?: AvatarShape;
  /**
   * Text shown on hover and keyboard focus. `true` shows the name, `false`
   * shows nothing.
   * @default true
   */
  tooltip?: string | boolean;
  /** When set, the avatar is a link to here. */
  href?: string;
  /** When set without `href`, the avatar behaves as a button. */
  onClick?: MouseEventHandler;
  /** Corner content, such as a presence dot. */
  status?: ReactNode;
  /** Test hook. */
  'data-testid'?: string;
}

export function Avatar({
  name,
  src,
  fallbackSrc,
  alt,
  size = 32,
  shape = 'circle',
  tooltip = true,
  href,
  onClick,
  status,
  'data-testid': testId,
}: AvatarProps) {
  return (
    <BaseAvatar
      name={name}
      src={src}
      fallbackSrc={fallbackSrc}
      alt={alt}
      size={SIZE[size]}
      shape={shape}
      tooltip={tooltip}
      href={href}
      onClick={onClick}
      status={status}
      data-testid={testId}
    />
  );
}

Avatar.displayName = 'Avatar';
