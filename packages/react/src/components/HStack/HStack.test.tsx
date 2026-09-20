import {describe, expect, it} from 'vitest';
import {render, screen} from '@testing-library/react';
import {TectonProvider} from '../../provider/TectonProvider.js';
import {HStack} from './HStack.js';

describe('HStack', () => {
  it('runs its children left to right', () => {
    render(
      <TectonProvider>
        <HStack gap={2} data-testid="row">
          <span>Cancel</span>
          <span>Apply</span>
        </HStack>
      </TectonProvider>,
    );

    const row = screen.getByTestId('row');
    expect(row).toHaveAttribute('data-direction', 'horizontal');
    expect(row.children).toHaveLength(2);
  });
});
