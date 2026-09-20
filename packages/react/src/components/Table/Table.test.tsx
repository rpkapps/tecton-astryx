import {describe, expect, it} from 'vitest';
import {render, screen} from '@testing-library/react';
import {TectonProvider} from '../../provider/TectonProvider.js';
import {Table} from './Table.js';

interface Row extends Record<string, unknown> {
  name: string;
  npv: string;
}

const data: Row[] = [
  {name: 'FDA 1.02', npv: '$350.4 mm'},
  {name: 'FDA 1.04', npv: '$312.8 mm'},
];

describe('Table', () => {
  it('renders a header row and one row per record', () => {
    render(
      <TectonProvider>
        <Table<Row>
          data={data}
          idKey="name"
          columns={[
            {key: 'name', header: 'FDA'},
            {key: 'npv', header: 'NPV'},
          ]}
        />
      </TectonProvider>,
    );

    expect(screen.getByRole('columnheader', {name: 'FDA'})).toBeInTheDocument();
    expect(screen.getByRole('cell', {name: 'FDA 1.02'})).toBeInTheDocument();
    expect(screen.getAllByRole('row')).toHaveLength(3);
  });

  it.each([
    ['md', 'balanced'],
    ['sm', 'compact'],
  ] as const)('maps the %s density onto %s', (density, expected) => {
    const {container} = render(
      <TectonProvider>
        <Table<Row>
          data={data}
          idKey="name"
          density={density}
          columns={[{key: 'name', header: 'FDA'}]}
        />
      </TectonProvider>,
    );

    expect(
      container.querySelector(`[data-density="${expected}"]`),
    ).not.toBeNull();
  });

  it('lets a column render its own cell', () => {
    render(
      <TectonProvider>
        <Table<Row>
          data={data}
          idKey="name"
          columns={[
            {
              key: 'npv',
              header: 'NPV',
              renderCell: row => <span data-testid="npv">{row.npv}</span>,
            },
          ]}
        />
      </TectonProvider>,
    );

    expect(screen.getAllByTestId('npv')).toHaveLength(2);
  });
});
