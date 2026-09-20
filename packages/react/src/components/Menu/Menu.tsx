/**
 * Tecton Menu.
 *
 * A button that opens a list of actions. The entries are data, so a menu never
 * needs anything imported alongside it: an action, a `divider`, or a `section`
 * holding more actions.
 */
import type {ReactNode} from 'react';
import {DropdownMenu} from '@astryxdesign/core/DropdownMenu';
import {
  renderIcon,
  resolveIcon,
  type TectonIconRef,
} from '../../icons/renderIcon.js';
import type {ControlSize} from '../../types/field.js';

/** Visual emphasis of the trigger button. */
export type MenuVariant =
  'primary' | 'secondary' | 'tertiary' | 'outlined' | 'textOnly';

/** Which side of the trigger the menu opens on. */
export type MenuPlacement = 'above' | 'below' | 'start' | 'end';

/** One action in a menu. */
export interface MenuItem {
  /** What the action is called. */
  label: string;
  /** Called when the action is chosen. */
  onSelect?: () => void;
  /** Glyph before the label, by name or as an SVG component. */
  icon?: TectonIconRef;
  /** Helper text under the label. */
  description?: string;
  /** Trailing content, typically a keyboard shortcut. */
  shortcut?: ReactNode;
  /**
   * Draws the action in the error colour, for something destructive.
   * @default false
   */
  isDestructive?: boolean;
  /**
   * Prevents the action from being chosen.
   * @default false
   */
  isDisabled?: boolean;
  /** Stable key, needed only when the entries reorder or filter. */
  id?: string;
}

/** A titled run of actions. */
export interface MenuSection {
  type: 'section';
  /** The heading shown above the run. */
  title?: string;
  /** The actions in the run. */
  items: readonly MenuItem[];
  /** Stable key, needed only when the entries reorder or filter. */
  id?: string;
}

/** A rule between two runs of actions. */
export interface MenuDivider {
  type: 'divider';
}

/** Anything that can appear in a menu. */
export type MenuEntry = MenuItem | MenuSection | MenuDivider;

const VARIANT = {
  primary: 'primary',
  secondary: 'secondary',
  tertiary: 'ghost',
  outlined: 'outlined',
  textOnly: 'text-only',
} as const satisfies Record<MenuVariant, string>;

function toItem(item: MenuItem) {
  return {
    id: item.id,
    label: item.label,
    onClick: item.onSelect,
    icon: resolveIcon(item.icon),
    description: item.description,
    endContent: item.shortcut,
    variant: item.isDestructive ? ('destructive' as const) : undefined,
    isDisabled: item.isDisabled,
  };
}

function toEntry(entry: MenuEntry) {
  if ('type' in entry) {
    return entry.type === 'divider'
      ? {type: 'divider' as const}
      : {
          type: 'section' as const,
          id: entry.id,
          title: entry.title,
          items: entry.items.map(toItem),
        };
  }
  return toItem(entry);
}

export interface MenuProps {
  /** The trigger button's text, which is also its accessible name. */
  label: string;
  /** The actions, sections and dividers the menu offers. */
  items: readonly MenuEntry[];
  /**
   * Visual emphasis of the trigger button.
   * @default 'secondary'
   */
  variant?: MenuVariant;
  /**
   * Trigger button height.
   * @default 'md'
   */
  size?: ControlSize;
  /** Glyph on the trigger button, by name or as an SVG component. */
  icon?: TectonIconRef;
  /**
   * Renders the trigger as an icon-only button, using `label` as its
   * accessible name. Needs `icon`.
   * @default false
   */
  isIconOnly?: boolean;
  /**
   * Which side of the trigger the menu opens on.
   * @default 'below'
   */
  placement?: MenuPlacement;
  /**
   * How the menu lines up with the trigger.
   * @default 'start'
   */
  alignment?: 'start' | 'center' | 'end';
  /** Open state, when the menu is controlled. */
  isOpen?: boolean;
  /** Called with the new open state whenever it changes. */
  onOpenChange?: (isOpen: boolean) => void;
  /** Smallest width of the open menu — a number is pixels. */
  menuWidth?: number | string;
  /** Test hook. */
  'data-testid'?: string;
}

export function Menu({
  label,
  items,
  variant = 'secondary',
  size = 'md',
  icon,
  isIconOnly = false,
  placement = 'below',
  alignment = 'start',
  isOpen,
  onOpenChange,
  menuWidth,
  'data-testid': testId,
}: MenuProps) {
  return (
    <DropdownMenu
      button={{
        label,
        variant: VARIANT[variant],
        size,
        icon: renderIcon(icon, size === 'sm' ? 16 : 20),
        isIconOnly,
      }}
      items={items.map(toEntry)}
      hasChevron={!isIconOnly}
      placement={placement}
      alignment={alignment}
      isMenuOpen={isOpen}
      onOpenChange={onOpenChange}
      menuWidth={menuWidth}
      data-testid={testId}
    />
  );
}

Menu.displayName = 'Menu';
