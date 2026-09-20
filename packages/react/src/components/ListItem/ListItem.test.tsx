import {describe, expect, it, vi} from 'vitest';
import {fireEvent, render, screen} from '@testing-library/react';
import {TectonProvider} from '../../provider/TectonProvider.js';
import {List} from '../List/List.js';
import {ListItem} from './ListItem.js';

describe('ListItem', () => {
  it('renders its label and description', () => {
    render(
      <TectonProvider>
        <List>
          <ListItem label="15/9-19 A" description="Producer, drilled 2019" />
        </List>
      </TectonProvider>,
    );

    expect(screen.getByText('15/9-19 A')).toBeInTheDocument();
    expect(screen.getByText('Producer, drilled 2019')).toBeInTheDocument();
  });

  it('becomes one click target when it is given a handler', () => {
    const onClick = vi.fn();
    render(
      <TectonProvider>
        <List>
          <ListItem label="15/9-19 A" onClick={onClick} />
        </List>
      </TectonProvider>,
    );

    fireEvent.click(screen.getByRole('button', {name: '15/9-19 A'}));
    expect(onClick).toHaveBeenCalledOnce();
  });

  it('marks the row that is selected', () => {
    const {container} = render(
      <TectonProvider>
        <List>
          <ListItem label="15/9-19 A" isSelected />
          <ListItem label="15/9-19 BT2" />
        </List>
      </TectonProvider>,
    );

    expect(container.querySelectorAll('[aria-current="true"]')).toHaveLength(1);
  });
});
