import {describe, expect, it, vi} from 'vitest';
import {fireEvent, render, screen} from '@testing-library/react';
import {TectonProvider} from '../../provider/TectonProvider.js';
import {Switch} from './Switch.js';

describe('Switch', () => {
  it('is a switch that reports whether it is on', () => {
    render(
      <TectonProvider>
        <Switch label="Show line guides" value />
      </TectonProvider>,
    );

    expect(
      screen.getByRole('switch', {name: 'Show line guides'}),
    ).toBeChecked();
  });

  it('reports a flip', () => {
    const onChange = vi.fn();
    render(
      <TectonProvider>
        <Switch label="Show line guides" value={false} onChange={onChange} />
      </TectonProvider>,
    );

    fireEvent.click(screen.getByRole('switch', {name: 'Show line guides'}));
    expect(onChange).toHaveBeenCalledWith(true, expect.anything());
  });
});
