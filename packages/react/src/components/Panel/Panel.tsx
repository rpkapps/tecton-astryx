/**
 * Tecton Panel.
 *
 * A Tecton-owned surface with no counterpart underneath: it is written in
 * StyleX against the design tokens, which is what proves the package can ship
 * its own compiled styles. The atomic CSS this file produces is extracted at
 * build time into `@tecton/react/styles.css`; consumers need no StyleX
 * tooling.
 *
 * The shape comes from `design/patterns/panels.md`: a 1px subtle rule, 8px
 * corners, 16px padding, no shadow, and a surface **darker** than the page —
 * Tecton's elevation runs down, not up. The header is a title row with an
 * optional leading glyph, optional actions and an optional close, followed by a
 * 1px divider.
 */
import type {ReactNode} from 'react';
import * as stylex from '@stylexjs/stylex';
import {
  colorVars,
  spacingVars,
  radiusVars,
  borderVars,
  typeScaleVars,
  typographyVars,
} from '@astryxdesign/core/theme/tokens.stylex';
import {IconButton} from '../IconButton/IconButton.js';
import {renderIcon, type TectonIconRef} from '../../icons/renderIcon.js';

const styles = stylex.create({
  root: {
    display: 'flex',
    flexDirection: 'column',
    minWidth: 0,
    padding: spacingVars['--spacing-4'],
    gap: spacingVars['--spacing-3'],
    backgroundColor: colorVars['--color-background-surface'],
    color: colorVars['--color-text-primary'],
    borderRadius: radiusVars['--radius-container'],
    borderWidth: borderVars['--border-width'],
    borderStyle: 'solid',
    borderColor: colorVars['--color-border'],
    // Tecton panels carry a rule, never a shadow.
    boxShadow: 'none',
  },
  header: {
    display: 'flex',
    alignItems: 'center',
    gap: spacingVars['--spacing-2'],
    paddingBottom: spacingVars['--spacing-3'],
    borderBottomWidth: borderVars['--border-width'],
    borderBottomStyle: 'solid',
    borderBottomColor: colorVars['--color-border'],
  },
  headingGroup: {
    display: 'flex',
    flexDirection: 'column',
    gap: spacingVars['--spacing-0-5'],
    minWidth: 0,
    flexGrow: 1,
  },
  icon: {
    display: 'inline-flex',
    flexShrink: 0,
    color: colorVars['--color-icon-primary'],
  },
  title: {
    margin: 0,
    fontFamily: typographyVars['--font-family-heading'],
    fontSize: typeScaleVars['--text-heading-4-size'],
    fontWeight: typeScaleVars['--text-heading-4-weight'],
    lineHeight: typeScaleVars['--text-heading-4-leading'],
    color: colorVars['--color-text-primary'],
    overflow: 'hidden',
    textOverflow: 'ellipsis',
    whiteSpace: 'nowrap',
  },
  description: {
    margin: 0,
    fontSize: typeScaleVars['--text-supporting-size'],
    lineHeight: typeScaleVars['--text-supporting-leading'],
    color: colorVars['--color-text-secondary'],
  },
  actions: {
    display: 'flex',
    alignItems: 'center',
    gap: spacingVars['--spacing-1'],
    flexShrink: 0,
  },
  body: {
    display: 'flex',
    flexDirection: 'column',
    gap: spacingVars['--spacing-3'],
    minWidth: 0,
  },
});

export interface PanelProps {
  /** Heading shown in the panel header. */
  title?: ReactNode;
  /** Glyph rendered before the title, by name or as an SVG component. */
  icon?: TectonIconRef;
  /** Supporting copy rendered under the title. */
  description?: ReactNode;
  /** Controls aligned to the end of the header row. */
  actions?: ReactNode;
  /** When set, the header ends with a close button that calls this. */
  onClose?: () => void;
  /**
   * Accessible name for the close button.
   * @default 'Close panel'
   */
  closeLabel?: string;
  /** Panel content. */
  children?: ReactNode;
  /** Id applied to the panel element. */
  id?: string;
  /** Accessible label when the panel has no visible title. */
  'aria-label'?: string;
  /** Test hook. */
  'data-testid'?: string;
}

export function Panel({
  title,
  icon,
  description,
  actions,
  onClose,
  closeLabel = 'Close panel',
  children,
  id,
  'aria-label': ariaLabel,
  'data-testid': testId,
}: PanelProps) {
  const hasHeader =
    title !== undefined ||
    description !== undefined ||
    actions !== undefined ||
    onClose !== undefined;

  return (
    <section
      id={id}
      aria-label={ariaLabel}
      data-testid={testId}
      data-tecton-panel=""
      {...stylex.props(styles.root)}
    >
      {hasHeader ? (
        <header {...stylex.props(styles.header)}>
          {icon !== undefined ? (
            <span {...stylex.props(styles.icon)}>{renderIcon(icon, 20)}</span>
          ) : null}
          <div {...stylex.props(styles.headingGroup)}>
            {title !== undefined ? (
              <h2 {...stylex.props(styles.title)}>{title}</h2>
            ) : null}
            {description !== undefined ? (
              <p {...stylex.props(styles.description)}>{description}</p>
            ) : null}
          </div>
          {actions !== undefined || onClose !== undefined ? (
            <div {...stylex.props(styles.actions)}>
              {actions}
              {onClose !== undefined ? (
                <IconButton
                  label={closeLabel}
                  icon="close"
                  variant="tertiary"
                  size="sm"
                  onClick={onClose}
                />
              ) : null}
            </div>
          ) : null}
        </header>
      ) : null}
      <div {...stylex.props(styles.body)}>{children}</div>
    </section>
  );
}

Panel.displayName = 'Panel';
