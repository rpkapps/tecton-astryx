import {describe, expect, it, vi} from 'vitest';
import {fireEvent, render, screen} from '@testing-library/react';
import {TectonProvider} from '../../provider/TectonProvider.js';
import {Checkbox} from './Checkbox.js';

describe('Checkbox', () => {
  it('is labelled and reports its state', () => {
    render(
      <TectonProvider>
        <Checkbox label="Include uncertainty" value={false} />
      </TectonProvider>,
    );

    expect(
      screen.getByRole('checkbox', {name: 'Include uncertainty'}),
    ).not.toBeChecked();
  });

  it('reports a toggle', () => {
    const onChange = vi.fn();
    render(
      <TectonProvider>
        <Checkbox
          label="Include uncertainty"
          value={false}
          onChange={onChange}
        />
      </TectonProvider>,
    );

    fireEvent.click(
      screen.getByRole('checkbox', {name: 'Include uncertainty'}),
    );
    expect(onChange).toHaveBeenCalledWith(true, expect.anything());
  });

  it('puts the control in the indeterminate state', () => {
    render(
      <TectonProvider>
        <Checkbox label="All layers" value="indeterminate" />
      </TectonProvider>,
    );

    const box = screen.getByRole('checkbox', {
      name: 'All layers',
    }) as HTMLInputElement;
    expect(box.indeterminate).toBe(true);
    expect(box.checked).toBe(false);
  });
});
