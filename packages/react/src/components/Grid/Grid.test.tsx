import {describe, expect, it} from 'vitest';
import {render, screen} from '@testing-library/react';
import {TectonProvider} from '../../provider/TectonProvider.js';
import {Grid} from './Grid.js';

describe('Grid', () => {
  it('lays its children out', () => {
    render(
      <TectonProvider>
        <Grid columns={2} gap={2} data-testid="grid">
          <span>NPV</span>
          <span>IRR</span>
        </Grid>
      </TectonProvider>,
    );

    expect(screen.getByTestId('grid').children).toHaveLength(2);
    expect(screen.getByText('NPV')).toBeInTheDocument();
  });
});
