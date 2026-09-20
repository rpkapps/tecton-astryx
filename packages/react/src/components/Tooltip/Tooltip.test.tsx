import {describe, expect, it} from 'vitest';
import {fireEvent, render, screen} from '@testing-library/react';
import {TectonProvider} from '../../provider/TectonProvider.js';
import {IconButton} from '../IconButton/IconButton.js';
import {Tooltip} from './Tooltip.js';

describe('Tooltip', () => {
  it('renders its trigger', () => {
    render(
      <TectonProvider>
        <Tooltip content="Dog-leg severity">
          <IconButton label="About DLS" icon="info" />
        </Tooltip>
      </TectonProvider>,
    );

    expect(screen.getByRole('button', {name: 'About DLS'})).toBeInTheDocument();
  });

  it('opens on focus', () => {
    render(
      <TectonProvider>
        <Tooltip content="Dog-leg severity" delayMs={0}>
          <IconButton label="About DLS" icon="info" />
        </Tooltip>
      </TectonProvider>,
    );

    fireEvent.focus(screen.getByRole('button', {name: 'About DLS'}));
    expect(screen.getAllByText('Dog-leg severity').length).toBeGreaterThan(0);
  });
});
