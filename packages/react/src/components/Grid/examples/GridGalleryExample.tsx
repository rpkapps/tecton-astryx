import {Card} from '../../Card/Card.js';
import {Grid} from '../Grid.js';
import {Text} from '../../Text/Text.js';
import {VStack} from '../../VStack/VStack.js';

const cards = [
  {title: 'Getting Started', description: 'Learn the basics of the platform.'},
  {title: 'Components', description: 'Browse the full component library.'},
  {title: 'Design Tokens', description: 'Colors, spacing, and typography.'},
  {title: 'Theming', description: 'Customize the look and feel.'},
  {title: 'Accessibility', description: 'Build inclusive experiences.'},
  {title: 'Patterns', description: 'Common UI composition patterns.'},
];

export function GridGalleryExample() {
  return (
    <Grid columns={{minWidth: 180}} gap={5} width="100%">
      {cards.map(card => (
        <Card key={card.title}>
          <VStack gap={1}>
            <Text variant="smallStrong" display="block">
              {card.title}
            </Text>
            <Text variant="small" display="block">
              {card.description}
            </Text>
          </VStack>
        </Card>
      ))}
    </Grid>
  );
}
