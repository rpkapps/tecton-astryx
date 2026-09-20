import type {CSSProperties} from 'react';
import {HoverCard} from '../HoverCard.js';
import {Text} from '../../Text/Text.js';
import {VStack} from '../../VStack/VStack.js';

const content: CSSProperties = {maxWidth: 200};

export function HoverCardInlineTextHoverCard() {
  return (
    <Text variant="medium">
      The component uses a{' '}
      <HoverCard
        content={
          <VStack gap={1}>
            <Text variant="smallStrong">Focus trap</Text>
            <Text variant="medium" color="secondary">
              A pattern that keeps keyboard focus inside a container, preventing
              it from moving to elements outside. Used in dialogs and modals to
              ensure accessibility.
            </Text>
          </VStack>
        }
        placement="above"
      >
        focus trap
      </HoverCard>{' '}
      to keep keyboard navigation inside the{' '}
      <HoverCard
        content={
          <VStack gap={1}>
            <Text variant="smallStrong">Modal dialog</Text>
            <Text variant="medium" color="secondary">
              An overlay that blocks interaction with the rest of the page until
              the user responds. Uses the native HTML dialog element for
              built-in accessibility and backdrop support.
            </Text>
          </VStack>
        }
        placement="above"
      >
        modal dialog
      </HoverCard>
      .
    </Text>
  );
}
