import {describe, expect, it} from 'vitest';
import {render, screen} from '@testing-library/react';
import {TectonProvider} from '../../provider/TectonProvider.js';
import {Link} from './Link.js';

describe('Link', () => {
  it('is a link to where it points', () => {
    render(
      <TectonProvider>
        <Link href="/wells">Wells</Link>
      </TectonProvider>,
    );

    expect(screen.getByRole('link', {name: 'Wells'})).toHaveAttribute(
      'href',
      '/wells',
    );
  });

  it('marks an external link as opening in a new tab', () => {
    render(
      <TectonProvider>
        <Link href="https://example.com" isExternal>
          Documentation
        </Link>
      </TectonProvider>,
    );

    const link = screen.getByRole('link', {name: /Documentation/});
    expect(link).toHaveAttribute('target', '_blank');
    expect(link.getAttribute('rel')).toContain('noopener');
  });

  it('keeps the underline when it is asked to', () => {
    render(
      <TectonProvider>
        <Link href="#" underline="always" data-testid="link">
          Shoe depth
        </Link>
      </TectonProvider>,
    );

    expect(screen.getByTestId('link')).toBeInTheDocument();
  });
});
