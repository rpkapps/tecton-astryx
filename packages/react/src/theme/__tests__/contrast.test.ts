/**
 * Contrast, in both colour modes.
 *
 * Text pairings are held to WCAG AA (4.5:1). Affordances that carry meaning
 * without text — the focus ring, a switch that is on, a separator that has to
 * be seen — are held to 3:1 (WCAG 1.4.11).
 *
 * One pairing does not clear its bar. It is asserted at its real value rather
 * than left out, so the number is visible in CI and a change to it is a test
 * failure rather than a surprise. See "Deviations" in
 * `docs/design/fidelity-report.md`.
 */
import {describe, expect, it} from 'vitest';
import {resolveThemeTokens} from '@astryxdesign/core/theme/tokens';
import {tectonTheme} from '../tectonTheme.js';
import {contrastRatio} from './contrast.js';

const modes = {
  dark: resolveThemeTokens(tectonTheme, {mode: 'dark'}),
  light: resolveThemeTokens(tectonTheme, {mode: 'light'}),
} as const;

type Mode = keyof typeof modes;
const MODES = Object.keys(modes) as Mode[];

function ratio(mode: Mode, foreground: string, background: string): number {
  const tokens = modes[mode];
  return contrastRatio(tokens[foreground], tokens[background]);
}

/** Text that has to be readable: ink token, surface token. */
const TEXT_PAIRS: ReadonlyArray<readonly [string, string]> = [
  ['--color-text-primary', '--color-background-body'],
  ['--color-text-primary', '--color-background-surface'],
  ['--color-text-secondary', '--color-background-body'],
  ['--color-text-secondary', '--color-background-surface'],
  ['--color-on-accent', '--color-accent'],
  ['--color-on-success', '--color-success'],
  ['--color-on-warning', '--color-warning'],
  ['--color-on-error', '--color-error'],
];

/** Meaningful non-text marks: mark token, surface token. */
const MARK_PAIRS: ReadonlyArray<readonly [string, string]> = [
  ['--focus-outline-color', '--color-background-body'],
  ['--focus-outline-color', '--color-background-surface'],
  ['--color-icon-secondary', '--color-background-body'],
  ['--color-track', '--color-background-body'],
  ['--tecton-color-divider-strong', '--color-background-body'],
];

/** The theme-local tokens are not portable, so resolve them from the theme. */
function localSides(name: string): {light: string; dark: string} {
  const value = tectonTheme.localTokens?.[name] ?? '';
  const match = value.match(/^light-dark\(([^,]+),\s*(.+)\)$/);
  return match
    ? {light: match[1].trim(), dark: match[2].trim()}
    : {light: value, dark: value};
}

describe.each(MODES)('%s mode', mode => {
  it.each(TEXT_PAIRS)('%s on %s reaches 4.5:1', (ink, surfaceToken) => {
    expect(ratio(mode, ink, surfaceToken)).toBeGreaterThanOrEqual(4.5);
  });

  it.each(MARK_PAIRS)('%s on %s reaches 3:1', (mark, surfaceToken) => {
    const tokens = modes[mode];
    const markValue =
      tokens[mark] ?? localSides(mark)[mode === 'dark' ? 'dark' : 'light'];
    expect(
      contrastRatio(markValue, tokens[surfaceToken]),
    ).toBeGreaterThanOrEqual(3);
  });

  it('keeps the info status readable on its own fill', () => {
    const side = mode === 'dark' ? 'dark' : 'light';
    expect(
      contrastRatio(
        localSides('--tecton-color-on-info')[side],
        localSides('--tecton-color-info-filled')[side],
      ),
    ).toBeGreaterThanOrEqual(4.5);
  });

  it('keeps the neutral status readable on its own fill', () => {
    const side = mode === 'dark' ? 'dark' : 'light';
    expect(
      contrastRatio(
        localSides('--tecton-color-on-status-neutral')[side],
        localSides('--tecton-color-status-neutral-filled')[side],
      ),
    ).toBeGreaterThanOrEqual(4.5);
  });

  it('keeps table header text readable on the header fill', () => {
    const side = mode === 'dark' ? 'dark' : 'light';
    expect(
      contrastRatio(
        modes[mode]['--color-text-primary'],
        localSides('--tecton-color-table-header')[side],
      ),
    ).toBeGreaterThanOrEqual(4.5);
  });

  /**
   * Tecton's "Divider medium" is the default border, and it does not reach 3:1
   * against the page in either mode — it is a quiet rule by design. Pinned
   * here so the shortfall is a measured number rather than an assumption; use
   * `divider strong` where a separator has to be seen.
   */
  it('records that the default border stays under 3:1', () => {
    const measured = ratio(
      mode,
      '--color-border-emphasized',
      '--color-background-body',
    );
    expect(measured).toBeGreaterThan(2);
    expect(measured).toBeLessThan(3);
  });
});
