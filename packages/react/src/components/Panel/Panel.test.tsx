import {describe, expect, it} from 'vitest';
import {render, screen} from '@testing-library/react';
import {TectonProvider} from '../../provider/TectonProvider.js';
import {Panel} from './Panel.js';

describe('Panel', () => {
  it('renders its header and children', () => {
    render(
      <TectonProvider>
        <Panel title="Deployment" description="Last run 4 minutes ago">
          <p>Body content</p>
        </Panel>
      </TectonProvider>,
    );

    expect(
      screen.getByRole('heading', {name: 'Deployment'}),
    ).toBeInTheDocument();
    expect(screen.getByText('Last run 4 minutes ago')).toBeInTheDocument();
    expect(screen.getByText('Body content')).toBeInTheDocument();
  });

  it('exposes a labelled region when it has no visible title', () => {
    render(
      <TectonProvider>
        <Panel aria-label="Activity">
          <p>Body content</p>
        </Panel>
      </TectonProvider>,
    );

    expect(screen.getByRole('region', {name: 'Activity'})).toBeInTheDocument();
  });
});
