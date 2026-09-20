import {describe, expect, it} from 'vitest';
import {render, screen} from '@testing-library/react';
import {TectonProvider} from '../../provider/TectonProvider.js';
import {Heading} from './Heading.js';

describe('Heading', () => {
  it('renders a heading at the level it is given', () => {
    render(
      <TectonProvider>
        <Heading level={3}>Lithotype density</Heading>
      </TectonProvider>,
    );

    expect(
      screen.getByRole('heading', {name: 'Lithotype density', level: 3}),
    ).toBeInTheDocument();
  });

  it('keeps the element when a display size is used', () => {
    render(
      <TectonProvider>
        <Heading level={2} variant="display2" data-testid="figure">
          $1.2M
        </Heading>
      </TectonProvider>,
    );

    const heading = screen.getByTestId('figure');
    expect(heading.tagName).toBe('H2');
    expect(heading).toHaveAttribute('data-type', 'display-2');
  });

  it('announces the outline level it is given', () => {
    render(
      <TectonProvider>
        <Heading level={2} outlineLevel={4}>
          Sidebar
        </Heading>
      </TectonProvider>,
    );

    expect(
      screen.getByRole('heading', {name: 'Sidebar', level: 4}),
    ).toBeInTheDocument();
  });
});
