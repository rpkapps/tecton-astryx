import {describe, expect, it, vi} from 'vitest';
import {fireEvent, render, screen} from '@testing-library/react';
import {TectonProvider} from '../../provider/TectonProvider.js';
import {ToggleButton} from './ToggleButton.js';

describe('ToggleButton', () => {
  it('reports whether it is down', () => {
    render(
      <TectonProvider>
        <ToggleButton label="Show wells" isPressed />
      </TectonProvider>,
    );

    expect(screen.getByRole('button', {name: 'Show wells'})).toHaveAttribute(
      'aria-pressed',
      'true',
    );
  });

  it('reports a press', () => {
    const onPressedChange = vi.fn();
    render(
      <TectonProvider>
        <ToggleButton
          label="Show wells"
          isPressed={false}
          onPressedChange={onPressedChange}
        />
      </TectonProvider>,
    );

    fireEvent.click(screen.getByRole('button', {name: 'Show wells'}));
    expect(onPressedChange).toHaveBeenCalledWith(true);
  });

  it.each([
    ['extraSmall', 'sm'],
    ['small', 'sm'],
    ['medium', 'md'],
    ['large', 'lg'],
  ] as const)('maps the %s size onto %s', (size, expected) => {
    render(
      <TectonProvider>
        <ToggleButton label="Show wells" size={size} />
      </TectonProvider>,
    );

    expect(screen.getByRole('button', {name: 'Show wells'})).toHaveAttribute(
      'data-size',
      expected,
    );
  });
});
