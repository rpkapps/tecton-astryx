import {describe, expect, it} from 'vitest';
import {render, screen} from '@testing-library/react';
import {TectonProvider} from '../../provider/TectonProvider.js';
import {Stack} from './Stack.js';

describe('Stack', () => {
  it('lays its children out along the direction it is given', () => {
    render(
      <TectonProvider>
        <Stack direction="horizontal" gap={3} data-testid="stack">
          <span>One</span>
          <span>Two</span>
        </Stack>
      </TectonProvider>,
    );

    expect(screen.getByTestId('stack')).toHaveAttribute(
      'data-direction',
      'horizontal',
    );
  });

  it('renders as the element it is asked for', () => {
    render(
      <TectonProvider>
        <Stack as="ul" data-testid="stack">
          <li>One</li>
        </Stack>
      </TectonProvider>,
    );

    expect(screen.getByTestId('stack').tagName).toBe('UL');
  });
});
