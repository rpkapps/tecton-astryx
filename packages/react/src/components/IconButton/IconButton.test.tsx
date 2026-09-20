import {describe, expect, it, vi} from 'vitest';
import {fireEvent, render, screen} from '@testing-library/react';
import {TectonProvider} from '../../provider/TectonProvider.js';
import {IconButton} from './IconButton.js';

describe('IconButton', () => {
  it('takes its accessible name from the label', () => {
    render(
      <TectonProvider>
        <IconButton label="Close panel" icon="close" />
      </TectonProvider>,
    );

    expect(
      screen.getByRole('button', {name: 'Close panel'}),
    ).toBeInTheDocument();
  });

  it('maps the Tecton emphasis onto the underlying variant', () => {
    render(
      <TectonProvider>
        <IconButton label="More" icon="more-vert" variant="tertiary" />
      </TectonProvider>,
    );

    expect(screen.getByRole('button', {name: 'More'})).toHaveAttribute(
      'data-variant',
      'ghost',
    );
  });

  it('calls its click handler', () => {
    const onClick = vi.fn();
    render(
      <TectonProvider>
        <IconButton label="Edit" icon="edit-square" onClick={onClick} />
      </TectonProvider>,
    );

    fireEvent.click(screen.getByRole('button', {name: 'Edit'}));
    expect(onClick).toHaveBeenCalledOnce();
  });
});
