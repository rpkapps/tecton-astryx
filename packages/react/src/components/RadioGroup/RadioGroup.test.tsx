import {describe, expect, it, vi} from 'vitest';
import {fireEvent, render, screen} from '@testing-library/react';
import {TectonProvider} from '../../provider/TectonProvider.js';
import {Radio} from '../Radio/Radio.js';
import {RadioGroup} from './RadioGroup.js';

describe('RadioGroup', () => {
  it('is a labelled radio group', () => {
    render(
      <TectonProvider>
        <RadioGroup
          label="Grid increment"
          value="25"
          onChange={() => undefined}
        >
          <Radio value="12" label="12.5 m" />
          <Radio value="25" label="25 m" />
        </RadioGroup>
      </TectonProvider>,
    );

    expect(
      screen.getByRole('radiogroup', {name: /Grid increment/}),
    ).toBeInTheDocument();
  });

  it('reports the option that was chosen', () => {
    const onChange = vi.fn();
    render(
      <TectonProvider>
        <RadioGroup label="Grid increment" value="25" onChange={onChange}>
          <Radio value="12" label="12.5 m" />
          <Radio value="25" label="25 m" />
        </RadioGroup>
      </TectonProvider>,
    );

    fireEvent.click(screen.getByRole('radio', {name: '12.5 m'}));
    expect(onChange).toHaveBeenCalledWith('12');
  });
});
