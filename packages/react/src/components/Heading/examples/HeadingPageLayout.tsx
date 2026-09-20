import {Heading} from '../Heading.js';
import {Text} from '../../Text/Text.js';
import {VStack} from '../../VStack/VStack.js';

export function HeadingPageLayout() {
  return (
    <VStack gap={6} width="100%">
      <VStack>
        <Heading level={1}>Dashboard Overview</Heading>
        <Text variant="small" display="block">
          Last updated 5 minutes ago
        </Text>
      </VStack>
      <VStack>
        <Heading level={2}>Recent Activity</Heading>
        <Text variant="medium" display="block">
          Here's what's been happening in your workspace.
        </Text>
      </VStack>
      <VStack>
        <Heading level={3}>Today</Heading>
        <Text variant="medium" display="block">
          • Project Alpha updated
          <br />
          • 3 new comments
          <br />• Task completed
        </Text>
      </VStack>
    </VStack>
  );
}
