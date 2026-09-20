import {Card} from '../../Card/Card.js';
import {Grid} from '../Grid.js';
import {GridSpan} from '../../GridSpan/GridSpan.js';
import {Text} from '../../Text/Text.js';

const metrics = [
  {label: 'Revenue', value: '$48,290'},
  {label: 'Active Users', value: '12,841'},
  {label: 'Conversion', value: '3.2%'},
  {label: 'Avg Response', value: '245ms'},
];

export function GridDashboardLayout() {
  return (
    <Grid columns={4} gap={4} width="100%">
      <GridSpan columns={2} rows={2}>
        <Card>
          <Text variant="smallStrong" display="block">
            Weekly Traffic
          </Text>
          <Text variant="small" display="block">
            Page views and unique visitors over the last 7 days
          </Text>
        </Card>
      </GridSpan>
      {metrics.map(m => (
        <Card key={m.label}>
          <Text variant="small" display="block">
            {m.label}
          </Text>
          <Text variant="smallStrong" display="block">
            {m.value}
          </Text>
        </Card>
      ))}
      <GridSpan columns="full">
        <Card>
          <Text variant="smallStrong" display="block">
            Recent Activity
          </Text>
          <Text variant="small" display="block">
            Latest events across all projects
          </Text>
        </Card>
      </GridSpan>
    </Grid>
  );
}
