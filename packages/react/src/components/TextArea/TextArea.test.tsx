import {describe, expect, it, vi} from 'vitest';
import {fireEvent, render, screen} from '@testing-library/react';
import {TectonProvider} from '../../provider/TectonProvider.js';
import {TextArea} from './TextArea.js';

describe('TextArea', () => {
  it('is labelled and sized by its rows', () => {
    render(
      <TectonProvider>
        <TextArea label="Design notes" value="" rows={5} />
      </TectonProvider>,
    );

    expect(screen.getByLabelText('Design notes')).toHaveAttribute('rows', '5');
  });

  it('reports what was typed', () => {
    const onChange = vi.fn();
    render(
      <TectonProvider>
        <TextArea label="Design notes" value="" onChange={onChange} />
      </TectonProvider>,
    );

    fireEvent.change(screen.getByLabelText('Design notes'), {
      target: {value: 'Shallower shoe'},
    });
    expect(onChange).toHaveBeenCalledWith('Shallower shoe', expect.anything());
  });

  it('marks the field invalid on an error', () => {
    render(
      <TectonProvider>
        <TextArea
          label="Design notes"
          value=""
          status={{type: 'error', message: 'Notes are required.'}}
        />
      </TectonProvider>,
    );

    expect(screen.getByLabelText('Design notes')).toHaveAttribute(
      'aria-invalid',
      'true',
    );
    expect(screen.getByText('Notes are required.')).toBeInTheDocument();
  });
});
