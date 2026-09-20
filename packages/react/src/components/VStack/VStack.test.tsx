import {describe, expect, it} from 'vitest';
import {render, screen} from '@testing-library/react';
import {TectonProvider} from '../../provider/TectonProvider.js';
import {VStack} from './VStack.js';

describe('VStack', () => {
  it('runs its children top to bottom', () => {
    render(
      <TectonProvider>
        <VStack gap={2} data-testid="column">
          <span>Top depth</span>
          <span>Bottom depth</span>
        </VStack>
      </TectonProvider>,
    );

    const column = screen.getByTestId('column');
    expect(column).toHaveAttribute('data-direction', 'vertical');
    expect(column.children).toHaveLength(2);
  });
});
