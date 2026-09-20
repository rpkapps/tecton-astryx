import {describe, expect, it} from 'vitest';
import {render, screen} from '@testing-library/react';
import {TectonProvider} from '../../provider/TectonProvider.js';
import {Progress} from './Progress.js';

describe('Progress', () => {
  it('reports its value on the linear bar', () => {
    render(
      <TectonProvider>
        <Progress label="Gridding" value={62} />
      </TectonProvider>,
    );

    const bar = screen.getByRole('progressbar', {name: /Gridding/});
    expect(bar).toHaveAttribute('aria-valuenow', '62');
  });

  it('draws a Tecton-owned ring for determinate circular progress', () => {
    render(
      <TectonProvider>
        <Progress
          label="Realisations"
          variant="circular"
          value={75}
          hasValueLabel
        />
      </TectonProvider>,
    );

    const ring = screen.getByRole('progressbar', {name: 'Realisations'});
    expect(ring).toHaveAttribute('data-tecton-progress', 'circular');
    expect(ring).toHaveAttribute('aria-valuenow', '75');
    expect(screen.getByText('75%')).toBeInTheDocument();
  });

  it('falls back to a spinner for indeterminate circular progress', () => {
    render(
      <TectonProvider>
        <Progress label="Working" variant="circular" isIndeterminate />
      </TectonProvider>,
    );

    expect(screen.getByLabelText('Working')).toBeInTheDocument();
    expect(screen.queryByRole('progressbar')).toBeNull();
  });
});
