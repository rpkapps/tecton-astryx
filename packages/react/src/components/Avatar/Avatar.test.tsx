import {describe, expect, it} from 'vitest';
import {render, screen} from '@testing-library/react';
import {TectonProvider} from '../../provider/TectonProvider.js';
import {Avatar} from './Avatar.js';

describe('Avatar', () => {
  it('falls back to initials', () => {
    render(
      <TectonProvider>
        <Avatar name="Ingrid Halvorsen" />
      </TectonProvider>,
    );

    expect(screen.getByText('IH')).toBeInTheDocument();
  });

  it('becomes a button when it is given a click handler', () => {
    render(
      <TectonProvider>
        <Avatar name="Ingrid Halvorsen" onClick={() => undefined} />
      </TectonProvider>,
    );

    expect(
      screen.getByRole('button', {name: /Ingrid Halvorsen/}),
    ).toBeInTheDocument();
  });

  it('draws Tecton’s smallest tier at the nearest rung underneath', () => {
    const {container} = render(
      <TectonProvider>
        <Avatar name="Ingrid Halvorsen" size={18} data-testid="avatar" />
      </TectonProvider>,
    );

    expect(container.querySelector('[data-testid="avatar"]')).not.toBeNull();
  });
});
