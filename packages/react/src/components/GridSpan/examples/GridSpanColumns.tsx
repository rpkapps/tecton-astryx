import {Card} from '../../Card/Card.js';
import {Grid} from '../../Grid/Grid.js';
import {GridSpan} from '../GridSpan.js';
import {Text} from '../../Text/Text.js';

export function GridSpanColumns() {
  return (
    <Grid columns={3} gap={3} width={400}>
      <GridSpan columns={2}>
        <Card>
          <Text variant="medium" color="secondary">
            Spans 2 columns
          </Text>
        </Card>
      </GridSpan>
      <Card>
        <Text variant="medium" color="secondary">
          1 col
        </Text>
      </Card>
      <Card>
        <Text variant="medium" color="secondary">
          1 col
        </Text>
      </Card>
      <GridSpan columns={2}>
        <Card>
          <Text variant="medium" color="secondary">
            Spans 2 columns
          </Text>
        </Card>
      </GridSpan>
    </Grid>
  );
}
