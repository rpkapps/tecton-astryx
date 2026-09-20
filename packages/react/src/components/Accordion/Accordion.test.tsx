import {describe, expect, it} from 'vitest';
import {fireEvent, render, screen} from '@testing-library/react';
import {TectonProvider} from '../../provider/TectonProvider.js';
import {Accordion} from './Accordion.js';

describe('Accordion', () => {
  it('discloses its content from the header', () => {
    render(
      <TectonProvider>
        <Accordion
          title="Drilling"
          secondaryText="4 sections"
          defaultIsOpen={false}
        >
          Weight on bit
        </Accordion>
      </TectonProvider>,
    );

    const header = screen.getByRole('button', {name: /Drilling/});
    expect(header).toHaveAttribute('aria-expanded', 'false');
    fireEvent.click(header);
    expect(header).toHaveAttribute('aria-expanded', 'true');
    expect(screen.getByText('Weight on bit')).toBeInTheDocument();
  });

  it('shows its secondary column', () => {
    render(
      <TectonProvider>
        <Accordion title="Casing" secondaryText="4 sections" />
      </TectonProvider>,
    );

    expect(screen.getByText('4 sections')).toBeInTheDocument();
  });
});
