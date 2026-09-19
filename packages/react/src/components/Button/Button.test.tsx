import {describe, expect, it} from 'vitest';
import {render, screen} from '@testing-library/react';
import {TectonProvider} from '../../provider/TectonProvider.js';
import {Button} from './Button.js';

describe('Button', () => {
  it('renders an accessible button inside a Tecton application', () => {
    render(
      <TectonProvider>
        <Button label="Save" />
      </TectonProvider>,
    );

    expect(screen.getByRole('button', {name: 'Save'})).toBeInTheDocument();
  });

  it('reflects the disabled state', () => {
    render(
      <TectonProvider>
        <Button label="Save" isDisabled />
      </TectonProvider>,
    );

    expect(screen.getByRole('button', {name: 'Save'})).toBeDisabled();
  });
});
