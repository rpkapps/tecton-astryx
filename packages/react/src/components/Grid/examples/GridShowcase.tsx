import {Card} from '../../Card/Card.js';
import {Grid} from '../Grid.js';

export function GridShowcase() {
  return (
    <Grid columns={3} gap={2} width={400}>
      {Array.from({length: 12}, (_, i) => (
        <Card key={i}>Item {i + 1}</Card>
      ))}
    </Grid>
  );
}
