import {describe, expect, it} from 'vitest';
import {render, screen} from '@testing-library/react';
import {TectonProvider} from '../../provider/TectonProvider.js';
import {Autocomplete} from './Autocomplete.js';

describe('Autocomplete', () => {
  it('is labelled and starts empty', () => {
    render(
      <TectonProvider>
        <Autocomplete
          label="Well"
          value={null}
          onChange={() => undefined}
          options={[{id: 'a', label: '15/9-19 A'}]}
        />
      </TectonProvider>,
    );

    const field = screen.getByLabelText('Well');
    expect(field).toBeInTheDocument();
    expect(field).toHaveValue('');
  });

  it('shows the chosen suggestion', () => {
    render(
      <TectonProvider>
        <Autocomplete
          label="Well"
          value={{id: 'a', label: '15/9-19 A'}}
          onChange={() => undefined}
          options={[{id: 'a', label: '15/9-19 A'}]}
        />
      </TectonProvider>,
    );

    expect(screen.getByText('15/9-19 A')).toBeInTheDocument();
  });
});
