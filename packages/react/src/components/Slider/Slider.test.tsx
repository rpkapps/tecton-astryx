import {describe, expect, it, vi} from 'vitest';
import {fireEvent, render, screen} from '@testing-library/react';
import {TectonProvider} from '../../provider/TectonProvider.js';
import {Slider} from './Slider.js';

describe('Slider', () => {
  it('reports its value and its range', () => {
    render(
      <TectonProvider>
        <Slider label="Net to gross" value={68} min={0} max={100} />
      </TectonProvider>,
    );

    const thumb = screen.getByRole('slider', {name: /Net to gross/});
    expect(thumb).toHaveAttribute('aria-valuenow', '68');
    expect(thumb).toHaveAttribute('aria-valuemax', '100');
  });

  it('draws two thumbs for a range', () => {
    render(
      <TectonProvider>
        <Slider
          label="Depth window"
          value={[2500, 2650]}
          min={2400}
          max={2800}
        />
      </TectonProvider>,
    );

    expect(screen.getAllByRole('slider')).toHaveLength(2);
  });

  it('moves by a step from the keyboard', () => {
    const onChange = vi.fn();
    render(
      <TectonProvider>
        <Slider label="Net to gross" value={68} step={1} onChange={onChange} />
      </TectonProvider>,
    );

    fireEvent.keyDown(screen.getByRole('slider', {name: /Net to gross/}), {
      key: 'ArrowRight',
    });
    expect(onChange).toHaveBeenCalledWith(69);
  });
});
