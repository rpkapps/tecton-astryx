import {describe, expect, it} from 'vitest';
import {fireEvent, render, screen} from '@testing-library/react';
import {TectonProvider} from '../../provider/TectonProvider.js';
import {Accordion} from '../Accordion/Accordion.js';
import {AccordionGroup} from './AccordionGroup.js';

describe('AccordionGroup', () => {
  it('keeps one accordion open at a time in single mode', () => {
    render(
      <TectonProvider>
        <AccordionGroup type="single" defaultValue="a">
          <Accordion value="a" title="Geology">
            Horizons
          </Accordion>
          <Accordion value="b" title="Drilling">
            Trajectory
          </Accordion>
        </AccordionGroup>
      </TectonProvider>,
    );

    const geology = screen.getByRole('button', {name: /Geology/});
    const drilling = screen.getByRole('button', {name: /Drilling/});
    expect(geology).toHaveAttribute('aria-expanded', 'true');

    fireEvent.click(drilling);
    expect(drilling).toHaveAttribute('aria-expanded', 'true');
    expect(geology).toHaveAttribute('aria-expanded', 'false');
  });
});
