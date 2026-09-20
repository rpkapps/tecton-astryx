/**
 * Tecton Progress.
 *
 * Reports how far along something is. `linear` is the bar a page or a panel
 * puts above its content; `circular` is the compact form that sits inside a
 * control or beside a row.
 *
 * Determinate circular progress has no counterpart underneath, so the ring is
 * Tecton's own, drawn in StyleX against the design tokens; the indeterminate
 * ring and the linear bar are the shared ones, themed.
 */
import * as stylex from '@stylexjs/stylex';
import {colorVars, typeScaleVars} from '@astryxdesign/core/theme/tokens.stylex';
import {ProgressBar} from '@astryxdesign/core/ProgressBar';
import {Spinner} from '@astryxdesign/core/Spinner';

/** Which shape the indicator takes. */
export type ProgressVariant = 'linear' | 'circular';

/** Which role the filled part is coloured from. */
export type ProgressTone =
  'accent' | 'success' | 'warning' | 'error' | 'neutral';

/** Ring diameter, in pixels. Tecton draws circular progress at 32 and 16. */
export type ProgressSize = 16 | 32;

const styles = stylex.create({
  ring: {
    display: 'inline-flex',
    position: 'relative',
    alignItems: 'center',
    justifyContent: 'center',
    flexShrink: 0,
  },
  svg: {display: 'block', transform: 'rotate(-90deg)'},
  track: {stroke: colorVars['--color-track'], fill: 'none'},
  fill: {fill: 'none', strokeLinecap: 'butt'},
  toneAccent: {stroke: colorVars['--color-accent']},
  toneSuccess: {stroke: colorVars['--color-success']},
  toneWarning: {stroke: colorVars['--color-warning']},
  toneError: {stroke: colorVars['--color-error']},
  toneNeutral: {stroke: colorVars['--color-neutral']},
  disabled: {stroke: colorVars['--color-text-disabled']},
  value: {
    position: 'absolute',
    fontSize: typeScaleVars['--text-heading-6-size'],
    fontWeight: typeScaleVars['--text-heading-6-weight'],
    color: colorVars['--color-text-primary'],
    fontVariantNumeric: 'tabular-nums',
  },
});

const TONE = {
  accent: styles.toneAccent,
  success: styles.toneSuccess,
  warning: styles.toneWarning,
  error: styles.toneError,
  neutral: styles.toneNeutral,
} as const;

export interface ProgressProps {
  /** What is making progress. Names the indicator for assistive technology. */
  label: string;
  /**
   * Which shape the indicator takes.
   * @default 'linear'
   */
  variant?: ProgressVariant;
  /**
   * How far along, on a scale that ends at `max`. Ignored while
   * indeterminate.
   * @default 0
   */
  value?: number;
  /**
   * The value that counts as finished.
   * @default 100
   */
  max?: number;
  /**
   * Animates without reporting a position, for work whose length is unknown.
   * @default false
   */
  isIndeterminate?: boolean;
  /**
   * Which role the filled part is coloured from.
   * @default 'accent'
   */
  tone?: ProgressTone;
  /**
   * Ring diameter, for circular progress.
   * @default 32
   */
  size?: ProgressSize;
  /**
   * Shows the percentage as text — inside the ring, or after the bar.
   * @default false
   */
  hasValueLabel?: boolean;
  /**
   * Visually hides the label, keeping it for assistive technology.
   * @default false
   */
  isLabelHidden?: boolean;
  /**
   * Greys the indicator out, for work that was cancelled or is inactive.
   * @default false
   */
  isDisabled?: boolean;
  /** Test hook. */
  'data-testid'?: string;
}

export function Progress({
  label,
  variant = 'linear',
  value = 0,
  max = 100,
  isIndeterminate = false,
  tone = 'accent',
  size = 32,
  hasValueLabel = false,
  isLabelHidden = false,
  isDisabled = false,
  'data-testid': testId,
}: ProgressProps) {
  if (variant === 'linear') {
    return (
      <ProgressBar
        label={label}
        value={value}
        max={max}
        isIndeterminate={isIndeterminate}
        variant={tone}
        hasValueLabel={hasValueLabel}
        isLabelHidden={isLabelHidden}
        isDisabled={isDisabled}
        data-testid={testId}
      />
    );
  }

  if (isIndeterminate) {
    return (
      <Spinner
        size={size === 16 ? 'sm' : 'lg'}
        aria-label={label}
        data-testid={testId}
      />
    );
  }

  const fraction = max <= 0 ? 0 : Math.min(Math.max(value / max, 0), 1);
  const stroke = size === 16 ? 2 : 3;
  const radius = (size - stroke) / 2;
  const circumference = 2 * Math.PI * radius;

  return (
    <span
      role="progressbar"
      aria-label={label}
      aria-valuenow={Math.round(fraction * max)}
      aria-valuemin={0}
      aria-valuemax={max}
      data-testid={testId}
      data-tecton-progress="circular"
      {...stylex.props(styles.ring)}
    >
      <svg width={size} height={size} {...stylex.props(styles.svg)}>
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          strokeWidth={stroke}
          {...stylex.props(styles.track)}
        />
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          strokeWidth={stroke}
          strokeDasharray={circumference}
          strokeDashoffset={circumference * (1 - fraction)}
          {...stylex.props(
            styles.fill,
            isDisabled ? styles.disabled : TONE[tone],
          )}
        />
      </svg>
      {hasValueLabel && size === 32 ? (
        <span {...stylex.props(styles.value)}>
          {Math.round(fraction * 100)}%
        </span>
      ) : null}
    </span>
  );
}

Progress.displayName = 'Progress';
