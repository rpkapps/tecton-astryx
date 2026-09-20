import {describe, expect, it, vi} from 'vitest';
import {fireEvent, render, screen} from '@testing-library/react';
import {TectonProvider} from '../../provider/TectonProvider.js';
import {Tab} from '../Tab/Tab.js';
import {Tabs} from './Tabs.js';

describe('Tabs', () => {
  it('speaks the tabs pattern by default', () => {
    render(
      <TectonProvider>
        <Tabs value="overview" onChange={() => undefined}>
          <Tab value="overview" label="Overview" panelId="a" />
          <Tab value="framing" label="Framing" panelId="b" />
        </Tabs>
      </TectonProvider>,
    );

    expect(screen.getByRole('tablist')).toBeInTheDocument();
    expect(screen.getAllByRole('tab')).toHaveLength(2);
  });

  it('becomes a navigation landmark in the navigation pattern', () => {
    render(
      <TectonProvider>
        <Tabs value="overview" onChange={() => undefined} pattern="navigation">
          <Tab value="overview" label="Overview" href="/overview" />
        </Tabs>
      </TectonProvider>,
    );

    expect(screen.queryByRole('tablist')).toBeNull();
    expect(screen.getByRole('navigation')).toBeInTheDocument();
  });

  it('reports the stop that was chosen', () => {
    const onChange = vi.fn();
    render(
      <TectonProvider>
        <Tabs value="overview" onChange={onChange}>
          <Tab value="overview" label="Overview" panelId="a" />
          <Tab value="framing" label="Framing" panelId="b" />
        </Tabs>
      </TectonProvider>,
    );

    fireEvent.click(screen.getByRole('tab', {name: 'Framing'}));
    expect(onChange).toHaveBeenCalledWith('framing');
  });
});
