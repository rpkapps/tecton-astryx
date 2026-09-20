import {Card} from '../Card.js';
import {Grid} from '../../Grid/Grid.js';
import {Heading} from '../../Heading/Heading.js';
import {Stack} from '../../Stack/Stack.js';
import {Text} from '../../Text/Text.js';

const LEVELS = [
  {elevation: 'none' as const, caption: 'Flat — sits on the page (default)'},
  {elevation: 'low' as const, caption: 'Low — lifts off slightly'},
  {elevation: 'med' as const, caption: 'Med — clearly raised'},
  {elevation: 'high' as const, caption: 'High — floats well above'},
];

export function CardElevations() {
  return (
    <Grid columns={2} gap={4} width={520}>
      {LEVELS.map(({elevation, caption}) => (
        <Card key={elevation}>
          <Stack direction="vertical" gap={1}>
            <Heading level={4}>elevation=&quot;{elevation}&quot;</Heading>
            <Text variant="small" color="secondary">
              {caption}
            </Text>
          </Stack>
        </Card>
      ))}
    </Grid>
  );
}
