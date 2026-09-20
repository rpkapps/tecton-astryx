import {describe, expect, it, vi} from 'vitest';
import {fireEvent, render, screen} from '@testing-library/react';
import {TectonProvider} from '../../provider/TectonProvider.js';
import {Menu} from './Menu.js';

describe('Menu', () => {
  it('opens its actions from the trigger', () => {
    render(
      <TectonProvider>
        <Menu
          label="Actions"
          items={[{label: 'Rename'}, {type: 'divider'}, {label: 'Delete'}]}
        />
      </TectonProvider>,
    );

    fireEvent.click(screen.getByRole('button', {name: 'Actions'}));
    expect(screen.getByRole('menuitem', {name: 'Rename'})).toBeInTheDocument();
    expect(screen.getByRole('menuitem', {name: 'Delete'})).toBeInTheDocument();
  });

  it('calls the action that was chosen', () => {
    const onSelect = vi.fn();
    render(
      <TectonProvider>
        <Menu label="Actions" items={[{label: 'Rename', onSelect}]} />
      </TectonProvider>,
    );

    fireEvent.click(screen.getByRole('button', {name: 'Actions'}));
    fireEvent.click(screen.getByRole('menuitem', {name: 'Rename'}));
    expect(onSelect).toHaveBeenCalledOnce();
  });

  it('declares that the trigger opens a menu', () => {
    render(
      <TectonProvider>
        <Menu label="Actions" items={[{label: 'Rename'}]} />
      </TectonProvider>,
    );

    expect(screen.getByRole('button', {name: 'Actions'})).toHaveAttribute(
      'aria-haspopup',
      'menu',
    );
  });
});
