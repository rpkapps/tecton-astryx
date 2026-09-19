/**
 * Tecton Panel.
 *
 * A Tecton-owned surface with no counterpart upstream: it is written in StyleX
 * against the design tokens, which is what proves the package can ship its own
 * compiled styles. The atomic CSS this file produces is extracted at build time
 * into `@tecton/react/styles.css`; consumers need no StyleX tooling.
 */
import type {ReactNode} from 'react';
import * as stylex from '@stylexjs/stylex';
import {
  colorVars,
  spacingVars,
  radiusVars,
  shadowVars,
  borderVars,
  typeScaleVars,
  typographyVars,
} from '@astryxdesign/core/theme/tokens.stylex';

const styles = stylex.create({
  root: {
    display: 'flex',
    flexDirection: 'column',
    gap: spacingVars['--spacing-3'],
    padding: spacingVars['--spacing-4'],
    backgroundColor: colorVars['--color-background-surface'],
    color: colorVars['--color-text-primary'],
    borderRadius: radiusVars['--radius-container'],
    borderWidth: borderVars['--border-width'],
    borderStyle: 'solid',
    borderColor: colorVars['--color-border'],
    boxShadow: shadowVars['--shadow-low'],
  },
  header: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: spacingVars['--spacing-2'],
  },
  title: {
    margin: 0,
    fontFamily: typographyVars['--font-family-heading'],
    fontSize: typeScaleVars['--text-heading-4-size'],
    fontWeight: 600,
    color: colorVars['--color-text-primary'],
  },
  description: {
    margin: 0,
    fontSize: typeScaleVars['--text-body-size'],
    color: colorVars['--color-text-secondary'],
  },
  body: {
    display: 'flex',
    flexDirection: 'column',
    gap: spacingVars['--spacing-3'],
  },
});

export interface PanelProps {
  /** Heading shown in the panel header. */
  title?: ReactNode;
  /** Supporting copy rendered under the title. */
  description?: ReactNode;
  /** Controls aligned to the end of the header row. */
  actions?: ReactNode;
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
  description,
  actions,
  children,
  id,
  'aria-label': ariaLabel,
  'data-testid': testId,
}: PanelProps) {
  const hasHeader = title !== undefined || actions !== undefined;

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
          <div>
            {title !== undefined ? (
              <h2 {...stylex.props(styles.title)}>{title}</h2>
            ) : null}
            {description !== undefined ? (
              <p {...stylex.props(styles.description)}>{description}</p>
            ) : null}
          </div>
          {actions !== undefined ? <div>{actions}</div> : null}
        </header>
      ) : null}
      <div {...stylex.props(styles.body)}>{children}</div>
    </section>
  );
}

Panel.displayName = 'Panel';
