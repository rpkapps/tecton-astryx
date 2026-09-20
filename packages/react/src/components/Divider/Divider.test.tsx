import {describe, expect, it} from 'vitest';
import {render, screen} from '@testing-library/react';
import {TectonProvider} from '../../provider/TectonProvider.js';
import {Divider} from './Divider.js';

describe('Divider', () => {
  it('is a separator', () => {
    render(
      <TectonProvider>
        <Divider data-testid="rule" />
      </TectonProvider>,
    );

    expect(screen.getByTestId('rule')).toHaveAttribute('role', 'separator');
  });

  it.each([
    ['subtle', 'subtle'],
    ['strong', 'strong'],
  ] as const)('maps the %s emphasis onto %s', (variant, expected) => {
    render(
      <TectonProvider>
        <Divider variant={variant} data-testid="rule" />
      </TectonProvider>,
    );

    expect(screen.getByTestId('rule')).toHaveAttribute(
      'data-variant',
      expected,
    );
  });

  it('paints the medium emphasis itself, because there is no variant for it', () => {
    render(
      <TectonProvider>
        <Divider variant="medium" data-testid="rule" />
      </TectonProvider>,
    );

    const rule = screen.getByTestId('rule');
    expect(rule).toHaveAttribute('data-variant', 'subtle');
    expect([...rule.classList].some(name => name.startsWith('tecton'))).toBe(
      true,
    );
  });
});
