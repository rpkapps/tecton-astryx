import {describe, expect, it} from 'vitest';
import {render, screen} from '@testing-library/react';
import {TectonProvider} from '../../provider/TectonProvider.js';
import {Fab} from './Fab.js';

describe('Fab', () => {
  it('names a round action from its label', () => {
    render(
      <TectonProvider>
        <Fab label="New well plan" icon="add" />
      </TectonProvider>,
    );

    expect(
      screen.getByRole('button', {name: 'New well plan'}),
    ).toBeInTheDocument();
  });

  it('lifts the action off the surface', () => {
    render(
      <TectonProvider>
        <Fab label="New well plan" icon="add" elevation="high" />
      </TectonProvider>,
    );

    expect(screen.getByRole('button', {name: 'New well plan'})).toHaveAttribute(
      'data-elevation',
      'high',
    );
  });

  it('shows the label on the extended shape', () => {
    render(
      <TectonProvider>
        <Fab label="New well plan" icon="add" shape="extended" />
      </TectonProvider>,
    );

    expect(screen.getByText('New well plan')).toBeInTheDocument();
  });
});
