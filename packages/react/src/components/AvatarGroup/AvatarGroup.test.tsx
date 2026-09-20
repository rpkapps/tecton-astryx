import {describe, expect, it} from 'vitest';
import {render, screen} from '@testing-library/react';
import {TectonProvider} from '../../provider/TectonProvider.js';
import {Avatar} from '../Avatar/Avatar.js';
import {AvatarGroup} from './AvatarGroup.js';

describe('AvatarGroup', () => {
  it('collapses everything past max into a marker', () => {
    render(
      <TectonProvider>
        <AvatarGroup max={2}>
          <Avatar name="Ingrid Halvorsen" />
          <Avatar name="Ola Nordmann" />
          <Avatar name="Sofia Reyes" />
          <Avatar name="Tom Baird" />
        </AvatarGroup>
      </TectonProvider>,
    );

    expect(screen.getByText('IH')).toBeInTheDocument();
    expect(screen.getByText('ON')).toBeInTheDocument();
    expect(screen.queryByText('SR')).toBeNull();
    expect(screen.getByText('+2')).toBeInTheDocument();
  });

  it('shows every avatar when max is not set', () => {
    render(
      <TectonProvider>
        <AvatarGroup>
          <Avatar name="Ingrid Halvorsen" />
          <Avatar name="Ola Nordmann" />
        </AvatarGroup>
      </TectonProvider>,
    );

    expect(screen.queryByText(/^\+/)).toBeNull();
  });
});
