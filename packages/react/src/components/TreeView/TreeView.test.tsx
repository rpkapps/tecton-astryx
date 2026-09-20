import {describe, expect, it} from 'vitest';
import {render, screen} from '@testing-library/react';
import {TectonProvider} from '../../provider/TectonProvider.js';
import {TreeView} from './TreeView.js';

const items = [
  {
    id: 'horizons',
    label: 'Horizons',
    isExpanded: true,
    items: [{id: 'spekk', label: 'Spekk fm top'}],
  },
  {id: 'wells', label: 'Wells', items: [{id: 'a', label: '15/9-19 A'}]},
];

describe('TreeView', () => {
  it('renders the branches it is given', () => {
    render(
      <TectonProvider>
        <TreeView items={items} />
      </TectonProvider>,
    );

    expect(screen.getByText('Horizons')).toBeInTheDocument();
    expect(screen.getByText('Wells')).toBeInTheDocument();
  });

  it('shows the children of a branch that starts open', () => {
    render(
      <TectonProvider>
        <TreeView items={items} />
      </TectonProvider>,
    );

    expect(screen.getByText('Spekk fm top')).toBeInTheDocument();
    expect(screen.queryByText('15/9-19 A')).toBeNull();
  });

  it('hides the connector lines unless they are asked for', () => {
    const {container} = render(
      <TectonProvider>
        <TreeView items={items} data-testid="tree" />
      </TectonProvider>,
    );

    expect(container.querySelector('[data-variant="noGuides"]')).not.toBeNull();
  });
});
