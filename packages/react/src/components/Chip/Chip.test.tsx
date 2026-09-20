import {describe, expect, it, vi} from 'vitest';
import {fireEvent, render, screen} from '@testing-library/react';
import {TectonProvider} from '../../provider/TectonProvider.js';
import {Chip} from './Chip.js';

describe('Chip', () => {
  it('renders its label', () => {
    render(
      <TectonProvider>
        <Chip label="Troll West" />
      </TectonProvider>,
    );

    expect(screen.getByText('Troll West')).toBeInTheDocument();
  });

  it.each([
    ['primary', 'purple'],
    ['info', 'blue'],
    ['success', 'green'],
    ['warning', 'orange'],
    ['error', 'red'],
  ] as const)('maps the %s colour onto %s', (color, expected) => {
    const {container} = render(
      <TectonProvider>
        <Chip label="Tag" color={color} />
      </TectonProvider>,
    );

    expect(
      container.querySelector(`[data-color="${expected}"]`),
    ).not.toBeNull();
  });

  it('offers a remove button when it can be removed', () => {
    const onRemove = vi.fn();
    render(
      <TectonProvider>
        <Chip label="Jurassic" onRemove={onRemove} />
      </TectonProvider>,
    );

    fireEvent.click(screen.getByRole('button', {name: /Jurassic|Remove/i}));
    expect(onRemove).toHaveBeenCalledOnce();
  });
});
