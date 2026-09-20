import {describe, expect, it, vi} from 'vitest';
import {fireEvent, render, screen} from '@testing-library/react';
import {TectonProvider} from '../../provider/TectonProvider.js';
import {Select} from './Select.js';

const options = [
  {value: 'facies-01', label: 'Facies Model 01'},
  {value: 'facies-02', label: 'Facies Model 02'},
];

describe('Select', () => {
  it('is a labelled combobox showing the chosen value', () => {
    render(
      <TectonProvider>
        <Select label="Model name" options={options} value="facies-01" />
      </TectonProvider>,
    );

    const trigger = screen.getByRole('combobox', {name: /Model name/});
    expect(trigger).toHaveTextContent('Facies Model 01');
  });

  it('reports the option that was chosen', () => {
    const onChange = vi.fn();
    render(
      <TectonProvider>
        <Select
          label="Model name"
          options={options}
          value="facies-01"
          onChange={onChange}
        />
      </TectonProvider>,
    );

    fireEvent.click(screen.getByRole('combobox', {name: /Model name/}));
    fireEvent.click(screen.getByRole('option', {name: 'Facies Model 02'}));
    expect(onChange).toHaveBeenCalledWith('facies-02');
  });

  it('maps the text-only appearance onto the borderless trigger', () => {
    const {container} = render(
      <TectonProvider>
        <Select
          label="Compare"
          options={options}
          value="facies-01"
          appearance="textOnly"
        />
      </TectonProvider>,
    );

    expect(container.querySelector('[data-variant="ghost"]')).not.toBeNull();
  });
});
