import {describe, expect, it} from 'vitest';
import {render, screen} from '@testing-library/react';
import {TectonProvider} from '../../provider/TectonProvider.js';
import {Card} from './Card.js';

describe('Card', () => {
  it('renders its content', () => {
    render(
      <TectonProvider>
        <Card>
          <p>Reduced DLS</p>
        </Card>
      </TectonProvider>,
    );

    expect(screen.getByText('Reduced DLS')).toBeInTheDocument();
  });

  it('carries its background variant', () => {
    const {container} = render(
      <TectonProvider>
        <Card variant="muted">Body</Card>
      </TectonProvider>,
    );

    expect(container.querySelector('[data-variant="muted"]')).not.toBeNull();
  });
});
