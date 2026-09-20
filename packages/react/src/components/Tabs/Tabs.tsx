/**
 * Tecton Tabs.
 *
 * The strip that holds a set of `Tab`s and knows which one is current. Use the
 * `tabs` pattern when the tabs switch panels on the same page, and the
 * `navigation` pattern when each tab is a link to a different page.
 */
import type {ReactNode} from 'react';
import {TabList} from '@astryxdesign/core/TabList';
import type {ControlSize} from '../../types/field.js';

/** How the tabs share the width of the strip. */
export type TabsLayout = 'hug' | 'fill';

/** What the strip is: panels on one page, or links between pages. */
export type TabsPattern = 'tabs' | 'navigation';

export interface TabsProps {
  /** The tabs. */
  children: ReactNode;
  /** The value of the current tab. */
  value: string;
  /** Called with the value of the tab the user chose. */
  onChange: (value: string) => void;
  /**
   * Tab height.
   * @default 'md'
   */
  size?: ControlSize;
  /**
   * How the tabs share the width of the strip: `hug` sizes each to its label,
   * `fill` stretches them equally.
   * @default 'hug'
   */
  layout?: TabsLayout;
  /**
   * What the strip is. `tabs` marks up the WAI-ARIA tabs pattern and expects
   * each tab to name the panel it controls; `navigation` makes the strip a
   * navigation landmark whose tabs are links.
   * @default 'tabs'
   */
  pattern?: TabsPattern;
  /**
   * Draws a rule under the strip.
   * @default false
   */
  hasDivider?: boolean;
  /**
   * Extends the strip to the edges of its container, past the container's own
   * padding.
   * @default false
   */
  isFullBleed?: boolean;
  /** Test hook. */
  'data-testid'?: string;
}

export function Tabs({
  children,
  value,
  onChange,
  size = 'md',
  layout = 'hug',
  pattern = 'tabs',
  hasDivider = false,
  isFullBleed = false,
  'data-testid': testId,
}: TabsProps) {
  return (
    <TabList
      value={value}
      onChange={onChange}
      size={size}
      layout={layout}
      role={pattern === 'tabs' ? 'tablist' : undefined}
      hasDivider={hasDivider}
      isFullBleed={isFullBleed}
      data-testid={testId}
    >
      {children}
    </TabList>
  );
}

Tabs.displayName = 'Tabs';
