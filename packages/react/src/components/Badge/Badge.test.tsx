import {describe, expect, it} from 'vitest';
import {render, screen} from '@testing-library/react';
import {TectonProvider} from '../../provider/TectonProvider.js';
import {Badge} from './Badge.js';

describe('Badge', () => {
  it('renders its label', () => {
    render(
      <TectonProvider>
        <Badge label="Ongoing" />
      </TectonProvider>,
    );

    expect(screen.getByText('Ongoing')).toBeInTheDocument();
  });

  it('carries the colour role through to the pill', () => {
    const {container} = render(
      <TectonProvider>
        <Badge label="Nominated" variant="lime" />
      </TectonProvider>,
    );

    expect(container.querySelector('[data-variant="lime"]')).not.toBeNull();
  });
});
