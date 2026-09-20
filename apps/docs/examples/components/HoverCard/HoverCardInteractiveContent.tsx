'use client';

import {HoverCard} from '@tecton/react/HoverCard';
import {Icon} from '@tecton/react/Icon';
import {VStack, HStack} from '@tecton/react/Layout';
import {Link} from '@tecton/react/Link';
import {Text} from '@tecton/react/Text';
import {LinkIcon} from '@tecton/react/icons';

export function HoverCardInteractiveContent() {
  return (
    <Text type="body">
      Read more in the{' '}
      <HoverCard
        placement="below"
        content={
          <VStack gap={2} style={{maxWidth: 280}}>
            <HStack gap={2} vAlign="start">
              <Icon icon={LinkIcon} size="sm" color="secondary" />
              <VStack gap={1}>
                <Text type="label">Getting Started Guide</Text>
                <Text type="body" color="secondary">
                  Learn how to set up your first project, invite team members,
                  and configure your workspace.
                </Text>
                <Text type="supporting" color="secondary">
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
