import {describe, expect, it, vi} from 'vitest';
import {fireEvent, render, screen} from '@testing-library/react';
import {TectonProvider} from '../../provider/TectonProvider.js';
import {Button} from './Button.js';

describe('Button', () => {
  it('renders an accessible button', () => {
    render(
      <TectonProvider>
        <Button label="Save" />
      </TectonProvider>,
    );

    expect(screen.getByRole('button', {name: 'Save'})).toBeInTheDocument();
  });

  it('reflects the disabled state', () => {
    render(
      <TectonProvider>
        <Button label="Save" isDisabled />
      </TectonProvider>,
    );

    expect(screen.getByRole('button', {name: 'Save'})).toBeDisabled();
  });

  it('calls its click handler', () => {
    const onClick = vi.fn();
    render(
      <TectonProvider>
        <Button label="Save" onClick={onClick} />
      </TectonProvider>,
    );

    fireEvent.click(screen.getByRole('button', {name: 'Save'}));
    expect(onClick).toHaveBeenCalledOnce();
  });

  it.each([
    ['primary', 'primary'],
    ['secondary', 'secondary'],
    ['tertiary', 'ghost'],
    ['outlined', 'outlined'],
    ['textOnly', 'text-only'],
  ] as const)('maps the %s emphasis onto %s', (variant, expected) => {
    render(
      <TectonProvider>
        <Button label="Save" variant={variant} />
      </TectonProvider>,
    );

    expect(screen.getByRole('button', {name: 'Save'})).toHaveAttribute(
      'data-variant',
      expected,
    );
  });

  it('renders its icon by name', () => {
    render(
      <TectonProvider>
        <Button label="Add" icon="add" />
      </TectonProvider>,
    );

    expect(
      screen
        .getByRole('button', {name: 'Add'})
        .querySelector('[data-tecton-icon="add"]'),
    ).not.toBeNull();
  });
});
