import {describe, expect, it, vi} from 'vitest';
import {fireEvent, render, screen} from '@testing-library/react';
import {TectonProvider} from '../../provider/TectonProvider.js';
import {CheckboxGroup} from './CheckboxGroup.js';

const items = [
  {value: 'horizons', label: 'Horizons'},
  {value: 'faults', label: 'Faults'},
];

describe('CheckboxGroup', () => {
  it('renders one checkbox per item', () => {
    render(
      <TectonProvider>
        <CheckboxGroup label="Layers" items={items} value={['horizons']} />
      </TectonProvider>,
    );

    expect(screen.getByRole('checkbox', {name: 'Horizons'})).toBeChecked();
    expect(screen.getByRole('checkbox', {name: 'Faults'})).not.toBeChecked();
  });

  it('reports the new set of keys', () => {
    const onChange = vi.fn();
    render(
      <TectonProvider>
        <CheckboxGroup
          label="Layers"
          items={items}
          value={['horizons']}
          onChange={onChange}
        />
      </TectonProvider>,
    );

    fireEvent.click(screen.getByRole('checkbox', {name: 'Faults'}));
    expect(onChange).toHaveBeenCalledWith(['horizons', 'faults']);
  });
});
