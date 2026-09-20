/**
 * Tecton Tab.
 *
 * One stop in a `Tabs` strip. In the tabs pattern give it the `panelId` of the
 * panel it controls; in the navigation pattern give it an `href`.
 */
import type {ReactNode} from 'react';
import {Tab as BaseTab} from '@astryxdesign/core/TabList';
import {renderIcon, type TectonIconRef} from '../../icons/renderIcon.js';

export interface TabProps {
  /** The tab's text, which is also its accessible name. */
  label: string;
  /** The value this tab sets on the strip. */
  value: string;
  /** Glyph shown while the tab is not current. */
  icon?: TectonIconRef;
  /** Glyph shown while the tab is current. Falls back to `icon`. */
  selectedIcon?: TectonIconRef;
  /** Content after the label, such as a count or a status dot. */
  endContent?: ReactNode;
  /** Id of the panel this tab controls, in the tabs pattern. */
  panelId?: string;
  /** Where the tab goes, in the navigation pattern. */
  href?: string;
  /**
   * Visually hides the label, leaving the glyph and using the label as the
   * accessible name.
   * @default false
   */
  isLabelHidden?: boolean;
  /** Test hook. */
  'data-testid'?: string;
}

export function Tab({
  label,
  value,
  icon,
  selectedIcon,
  endContent,
  panelId,
  href,
  isLabelHidden = false,
  'data-testid': testId,
}: TabProps) {
  return (
    <BaseTab
      label={label}
      value={value}
      icon={renderIcon(icon, 16)}
      selectedIcon={renderIcon(selectedIcon, 16)}
      endContent={endContent}
      panelId={panelId}
      href={href}
      isLabelHidden={isLabelHidden}
      data-testid={testId}
    />
  );
}

Tab.displayName = 'Tab';
