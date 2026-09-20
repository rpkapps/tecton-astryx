import {describe, expect, it} from 'vitest';
import {render, screen} from '@testing-library/react';
import {TectonProvider} from '../../provider/TectonProvider.js';
import {Tabs} from '../Tabs/Tabs.js';
import {Tab} from './Tab.js';

describe('Tab', () => {
  it('reports whether it is the current stop', () => {
    render(
      <TectonProvider>
        <Tabs value="wells" onChange={() => undefined}>
          <Tab value="overview" label="Overview" panelId="overview-panel" />
          <Tab value="wells" label="Wells" panelId="wells-panel" />
        </Tabs>
      </TectonProvider>,
    );

    expect(screen.getByRole('tab', {name: 'Wells'})).toHaveAttribute(
      'aria-selected',
      'true',
    );
    expect(screen.getByRole('tab', {name: 'Overview'})).toHaveAttribute(
      'aria-selected',
      'false',
    );
  });

  it('points at the panel it controls', () => {
    render(
      <TectonProvider>
        <Tabs value="wells" onChange={() => undefined}>
          <Tab value="wells" label="Wells" panelId="wells-panel" />
        </Tabs>
      </TectonProvider>,
    );

    expect(screen.getByRole('tab', {name: 'Wells'})).toHaveAttribute(
      'aria-controls',
      'wells-panel',
    );
  });
});
