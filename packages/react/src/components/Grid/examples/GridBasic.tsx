import {Card} from '../../Card/Card.js';
import {Text} from '../../Text/Text.js';
import {Grid} from '../Grid.js';

export function GridBasic() {
  return (
    <Grid columns={{minWidth: 160, max: 4}} gap={2}>
      {['NPV', 'IRR', 'Breakeven', 'CapEx'].map(metric => (
        <Card key={metric} padding={3}>
          <Text variant="smallStrong">{metric}</Text>
        </Card>
      ))}
    </Grid>
  );
}
