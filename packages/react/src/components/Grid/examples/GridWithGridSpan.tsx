import {Card} from '../../Card/Card.js';
import {Grid} from '../Grid.js';
import {GridSpan} from '../../GridSpan/GridSpan.js';
import {Text} from '../../Text/Text.js';
import {VStack} from '../../VStack/VStack.js';

export function GridWithGridSpan() {
  return (
    <Grid columns={3} gap={4} width="100%">
      <GridSpan rows={2}>
        <Card>
          <VStack gap={1}>
            <Text variant="smallStrong" display="block">
              Featured Release
            </Text>
            <Text variant="small" display="block">
              Tecton 4.0 is now available with new layout primitives, refreshed
              tokens, and improved theming support across the system.
            </Text>
          </VStack>
        </Card>
      </GridSpan>
      <Card>
        <Text variant="smallStrong" display="block">
          Components
        </Text>
        <Text variant="small" display="block">
          54 available
        </Text>
      </Card>
      <Card>
        <Text variant="smallStrong" display="block">
          Templates
        </Text>
        <Text variant="small" display="block">
          28 available
        </Text>
      </Card>
      <Card>
        <Text variant="smallStrong" display="block">
          Tokens
        </Text>
        <Text variant="small" display="block">
          120 defined
        </Text>
      </Card>
      <Card>
        <Text variant="smallStrong" display="block">
          Themes
        </Text>
        <Text variant="small" display="block">
          6 published
        </Text>
      </Card>
      <Card>
        <Text variant="smallStrong" display="block">
          Icons
        </Text>
        <Text variant="small" display="block">
          312 available
        </Text>
      </Card>
      <Card>
        <Text variant="smallStrong" display="block">
          Patterns
        </Text>
        <Text variant="small" display="block">
          18 documented
        </Text>
      </Card>
      <Card>
        <Text variant="smallStrong" display="block">
          Contributors
        </Text>
        <Text variant="small" display="block">
          42 active
        </Text>
      </Card>
      <GridSpan columns="full">
        <Card>
          <VStack gap={1}>
            <Text variant="smallStrong" display="block">
              Community Showcase
            </Text>
            <Text variant="small" display="block">
              See how teams are building with Tecton across the organization
            </Text>
          </VStack>
        </Card>
      </GridSpan>
    </Grid>
  );
}
