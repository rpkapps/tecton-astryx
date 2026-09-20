import {describe, expect, it, vi} from 'vitest';
import {fireEvent, render, screen} from '@testing-library/react';
import {TectonProvider} from '../../provider/TectonProvider.js';
import {TextField} from './TextField.js';

describe('TextField', () => {
  it('is labelled by its label', () => {
    render(
      <TectonProvider>
        <TextField label="Horizon name" value="" />
      </TectonProvider>,
    );

    expect(screen.getByLabelText('Horizon name')).toBeInTheDocument();
  });

  it('reports what was typed', () => {
    const onChange = vi.fn();
    render(
      <TectonProvider>
        <TextField label="Horizon name" value="" onChange={onChange} />
      </TectonProvider>,
    );

    fireEvent.change(screen.getByLabelText('Horizon name'), {
      target: {value: 'Spekk'},
    });
    expect(onChange).toHaveBeenCalledWith('Spekk', expect.anything());
  });

  it('draws an error as detached helper text and marks the field invalid', () => {
    render(
      <TectonProvider>
        <TextField
          label="Top depth"
          value="abc"
          status={{type: 'error', message: 'Depth has to be a number.'}}
        />
      </TectonProvider>,
    );

    expect(screen.getByLabelText('Top depth')).toHaveAttribute(
      'aria-invalid',
      'true',
    );
    expect(screen.getByText('Depth has to be a number.')).toBeInTheDocument();
  });
});
