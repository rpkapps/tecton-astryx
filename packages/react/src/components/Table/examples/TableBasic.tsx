import {Chip} from '../../Chip/Chip.js';
import {Text} from '../../Text/Text.js';
import {Table} from '../Table.js';

interface Design extends Record<string, unknown> {
  rank: number;
  name: string;
  npv: string;
  risk: string;
}

const designs: Design[] = [
  {rank: 1, name: 'FDA 1.02', npv: '$350.4 mm', risk: 'Low'},
  {rank: 2, name: 'FDA 1.04', npv: '$312.8 mm', risk: 'Medium'},
  {rank: 3, name: 'FDA 2.01', npv: '$240.5 mm', risk: 'High'},
];

export function TableBasic() {
  return (
    <Table<Design>
      data={designs}
      idKey="name"
      density="sm"
      hasHover
      columns={[
        {key: 'rank', header: 'Rank', width: 64, align: 'end'},
        {key: 'name', header: 'FDA', width: {share: 2}},
        {
          key: 'npv',
          header: 'NPV',
          align: 'end',
          renderCell: design => (
            <Text variant="smallData" hasTabularNumbers>
              {design.npv}
            </Text>
          ),
        },
        {
          key: 'risk',
          header: 'Risk',
          renderCell: design => (
            <Chip
              label={design.risk}
              size="sm"
              color={design.risk === 'Low' ? 'success' : 'warning'}
            />
          ),
        },
      ]}
    />
  );
}
