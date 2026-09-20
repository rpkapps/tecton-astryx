import {AppShell} from '../AppShell.js';
import {Heading} from '../../Heading/Heading.js';
import {Text} from '../../Text/Text.js';
import {VStack} from '../../VStack/VStack.js';

export function AppShellContentOnly() {
  return (
    <AppShell contentPadding={6} style={{height: '100%', minHeight: 0}}>
      <VStack gap={4}>
        <Heading level={3}>Page Content</Heading>
        <Text variant="medium">
          Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do
          eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad
          minim veniam, quis nostrud exercitation ullamco laboris.
        </Text>
      </VStack>
    </AppShell>
  );
}
