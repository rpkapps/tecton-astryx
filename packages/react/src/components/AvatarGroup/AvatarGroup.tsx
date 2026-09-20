/**
 * Tecton AvatarGroup.
 *
 * A row of overlapping avatars with a `+N` marker once there are more than
 * `max`. The group owns the size and the shape, so the avatars inside it do
 * not have to agree.
 */
import {Children, isValidElement, type ReactNode} from 'react';
import {
  AvatarGroup as BaseAvatarGroup,
  AvatarGroupOverflow,
} from '@astryxdesign/core/AvatarGroup';
import type {AvatarShape, AvatarSize} from '../Avatar/Avatar.js';

export interface AvatarGroupProps {
  /** The avatars in the group. */
  children: ReactNode;
  /**
   * Diameter in pixels, applied to every avatar in the group.
   * @default 32
   */
  size?: AvatarSize;
  /**
   * Corner treatment, applied to every avatar in the group.
   * @default 'circle'
   */
  shape?: AvatarShape;
  /**
   * How many avatars to show before the rest collapse into a `+N` marker. Omit
   * it to show them all.
   */
  max?: number;
  /** Called when the `+N` marker is activated. */
  onOverflowClick?: () => void;
  /** Test hook. */
  'data-testid'?: string;
}

export function AvatarGroup({
  children,
  size = 32,
  shape = 'circle',
  max,
  onOverflowClick,
  'data-testid': testId,
}: AvatarGroupProps) {
  const avatars = Children.toArray(children).filter(isValidElement);
  const visible =
    max === undefined || avatars.length <= max
      ? avatars
      : avatars.slice(0, max);
  const hidden = avatars.length - visible.length;

  return (
    <BaseAvatarGroup
      size={size === 18 ? 20 : size}
      shape={shape}
      data-testid={testId}
    >
      {visible}
      {hidden > 0 ? (
        <AvatarGroupOverflow count={hidden} onClick={onOverflowClick} />
      ) : null}
    </BaseAvatarGroup>
  );
}

AvatarGroup.displayName = 'AvatarGroup';
