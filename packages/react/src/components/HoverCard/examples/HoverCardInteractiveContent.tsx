import {HStack} from '../../HStack/HStack.js';
import {HoverCard} from '../HoverCard.js';
import {Icon} from '../../Icon/Icon.js';
import {Link} from '../../Link/Link.js';
import {Text} from '../../Text/Text.js';
import {VStack} from '../../VStack/VStack.js';

export function HoverCardInteractiveContent() {
  return (
    <Text variant="medium">
      Read more in the{' '}
      <HoverCard
        placement="below"
        content={
          <VStack gap={2}>
            <HStack gap={2}>
              <Icon name={'link'} size={16} />
              <VStack gap={1}>
                <Text variant="smallStrong">Getting Started Guide</Text>
                <Text variant="medium" color="secondary">
                  Learn how to set up your first project, invite team members,
                  and configure your workspace.
                </Text>
                <Text variant="small" color="secondary">
                  docs.example.com/getting-started
                </Text>
              </VStack>
            </HStack>
          </VStack>
        }
      >
        <Link href="#" hasUnderline>
          Getting Started Guide
        </Link>
      </HoverCard>
      .
    </Text>
  );
}
