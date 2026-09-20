import {describe, expect, it, vi} from 'vitest';
import {fireEvent, render, screen} from '@testing-library/react';
import {TectonProvider} from '../../provider/TectonProvider.js';
import {ColorSwatch} from './ColorSwatch.js';

describe('ColorSwatch', () => {
  it('is hidden from assistive technology when it is decoration', () => {
    const {container} = render(
      <TectonProvider>
        <ColorSwatch color="#c2867a" />
      </TectonProvider>,
    );

    expect(
      container.querySelector('[data-tecton-color-swatch]'),
    ).toHaveAttribute('aria-hidden', 'true');
  });

  it('becomes a pressable button when it can be chosen', () => {
    const onClick = vi.fn();
    render(
      <TectonProvider>
        <ColorSwatch
          color="#c2867a"
          label="Channel sand"
          isSelected
          onClick={onClick}
        />
      </TectonProvider>,
    );

    const swatch = screen.getByRole('button', {name: 'Channel sand'});
    expect(swatch).toHaveAttribute('aria-pressed', 'true');
    fireEvent.click(swatch);
    expect(onClick).toHaveBeenCalledOnce();
  });

  it('paints the colour it is given', () => {
    render(
      <TectonProvider>
        <ColorSwatch
          color="rgb(194, 134, 122)"
          label="Channel sand"
          data-testid="swatch"
        />
      </TectonProvider>,
    );

    expect(screen.getByTestId('swatch')).toHaveStyle({
      backgroundColor: 'rgb(194, 134, 122)',
    });
  });
});
