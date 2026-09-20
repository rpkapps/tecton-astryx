import {describe, expect, it} from 'vitest';
import {render, screen} from '@testing-library/react';
import {TectonProvider} from '../../provider/TectonProvider.js';
import {RadioGroup} from '../RadioGroup/RadioGroup.js';
import {Radio} from './Radio.js';

describe('Radio', () => {
  it('is one option of its group', () => {
    render(
      <TectonProvider>
        <RadioGroup label="Method" value="sgs" onChange={() => undefined}>
          <Radio value="sgs" label="Sequential Gaussian" />
          <Radio value="ti" label="Truncated indicator" isDisabled />
        </RadioGroup>
      </TectonProvider>,
    );

    expect(
      screen.getByRole('radio', {name: 'Sequential Gaussian'}),
    ).toBeChecked();
    expect(
      screen.getByRole('radio', {name: 'Truncated indicator'}),
    ).toBeDisabled();
  });
});
