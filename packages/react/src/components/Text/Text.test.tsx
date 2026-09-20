import {describe, expect, it} from 'vitest';
import {render, screen} from '@testing-library/react';
import {TectonProvider} from '../../provider/TectonProvider.js';
import {Text} from './Text.js';

describe('Text', () => {
  it('renders its content', () => {
    render(
      <TectonProvider>
        <Text>2,525 m</Text>
      </TectonProvider>,
    );

    expect(screen.getByText('2,525 m')).toBeInTheDocument();
  });

  it('maps a Tecton variant onto the type scale', () => {
    render(
      <TectonProvider>
        <Text variant="mediumData" data-testid="value">
          68%
        </Text>
      </TectonProvider>,
    );

    expect(screen.getByTestId('value')).toHaveAttribute(
      'data-type',
      'mediumData',
    );
  });

  it('renders as the element it is asked for', () => {
    render(
      <TectonProvider>
        <Text as="p" data-testid="copy">
          Body copy
        </Text>
      </TectonProvider>,
    );

    expect(screen.getByTestId('copy').tagName).toBe('P');
  });
});
