import {describe, expect, it} from 'vitest';
import {render, screen} from '@testing-library/react';
import {TectonProvider} from '../../provider/TectonProvider.js';
import {Alert} from './Alert.js';

describe('Alert', () => {
  it('renders its title and description', () => {
    render(
      <TectonProvider>
        <Alert
          status="warning"
          title="The velocity model is out of date"
          description="Rebuild it before depth-converting."
        />
      </TectonProvider>,
    );

    expect(
      screen.getByText('The velocity model is out of date'),
    ).toBeInTheDocument();
    expect(
      screen.getByText('Rebuild it before depth-converting.'),
    ).toBeInTheDocument();
  });

  it.each(['info', 'success', 'warning', 'error', 'neutral'] as const)(
    'carries the %s status through to the surface',
    status => {
      const {container} = render(
        <TectonProvider>
          <Alert status={status} title="Message" />
        </TectonProvider>,
      );

      expect(
        container.querySelector(`[data-status="${status}"]`),
      ).not.toBeNull();
    },
  );
});
