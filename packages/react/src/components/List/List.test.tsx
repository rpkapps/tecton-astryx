import {describe, expect, it} from 'vitest';
import {render, screen} from '@testing-library/react';
import {TectonProvider} from '../../provider/TectonProvider.js';
import {ListItem} from '../ListItem/ListItem.js';
import {List} from './List.js';

describe('List', () => {
  it('is a list named by its header', () => {
    render(
      <TectonProvider>
        <List header="Horizons">
          <ListItem label="Spekk fm top" />
          <ListItem label="Draupne fm top" />
        </List>
      </TectonProvider>,
    );

    expect(screen.getByRole('list', {name: 'Horizons'})).toBeInTheDocument();
    expect(screen.getAllByRole('listitem')).toHaveLength(2);
  });

  it.each([
    ['condensed', 'compact'],
    ['default', 'balanced'],
    ['comfortable', 'spacious'],
  ] as const)('maps the %s density onto %s', (density, expected) => {
    render(
      <TectonProvider>
        <List density={density} data-testid="list">
          <ListItem label="Spekk fm top" />
        </List>
      </TectonProvider>,
    );

    expect(screen.getByTestId('list')).toHaveAttribute(
      'data-density',
      expected,
    );
  });

  it('numbers an ordered list', () => {
    render(
      <TectonProvider>
        <List marker="decimal" data-testid="list">
          <ListItem label="Spud" />
        </List>
      </TectonProvider>,
    );

    expect(screen.getByTestId('list').tagName).toBe('OL');
  });
});
