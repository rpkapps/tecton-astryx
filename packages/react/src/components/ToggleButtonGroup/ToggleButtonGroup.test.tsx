import {describe, expect, it, vi} from 'vitest';
import {fireEvent, render, screen} from '@testing-library/react';
import {TectonProvider} from '../../provider/TectonProvider.js';
import {ToggleButtonGroup} from './ToggleButtonGroup.js';

const items = [
  {value: 'map', label: 'Map'},
  {value: 'section', label: 'Section'},
];

describe('ToggleButtonGroup', () => {
  it('is a labelled radio group with one segment chosen', () => {
    render(
      <TectonProvider>
        <ToggleButtonGroup
          label="View"
          items={items}
          value="map"
          onChange={() => undefined}
        />
      </TectonProvider>,
    );

    expect(screen.getByRole('radiogroup', {name: 'View'})).toBeInTheDocument();
    expect(screen.getByRole('radio', {name: 'Map'})).toBeChecked();
  });

  it('reports the segment that was chosen', () => {
    const onChange = vi.fn();
    render(
      <TectonProvider>
        <ToggleButtonGroup
          label="View"
          items={items}
          value="map"
          onChange={onChange}
        />
      </TectonProvider>,
    );

    fireEvent.click(screen.getByRole('radio', {name: 'Section'}));
    expect(onChange).toHaveBeenCalledWith('section');
  });
});
