'use client';

import {useState} from 'react';
import * as stylex from '@stylexjs/stylex';
import {HistoryIcon, NumericIcon, PersonIcon} from '@tecton/react/icons';
import {BottomSheet} from '@tecton/react/BottomSheet';
import {Button} from '@tecton/react/Button';
import {Icon} from '@tecton/react/Icon';
import {List, ListItem} from '@tecton/react/List';
import {VStack} from '@tecton/react/Layout';
import {Section} from '@tecton/react/Section';
import {Heading, Text} from '@tecton/react/Text';
import {spacingVars} from '@tecton/react/theme/tokens.stylex';

const styles = stylex.create({
  header: {
    // Match the unchanged spacious ListItem inset so the title and description
    // align with the action icons.
    marginInlineStart: spacingVars['--spacing-3'],
  },
});

const PROJECT_ACTIONS = [
  [PersonIcon, 'Assign owner', 'Route follow-up to a teammate.'],
  [NumericIcon, 'Add label', 'Group this item with related work.'],
  [HistoryIcon, 'Set due date', 'Pick a reminder for review.'],
] as const;

export function PopoverBottomSheetAlternative() {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <>
      <Button label="Open project actions" onClick={() => setIsOpen(true)}>
        Open project actions
      </Button>
      <BottomSheet
        isOpen={isOpen}
        onOpenChange={setIsOpen}
        label="Project actions"
        height="hug"
      >
        <Section paddingBlock={4} paddingInline={1}>
          <VStack gap={3}>
            <VStack gap={1} xstyle={styles.header}>
              <Heading level={3}>Project actions</Heading>
              <Text type="supporting" color="secondary">
                Use this modal touch surface when the task should move away from
                its trigger and stay close to the bottom edge.
              </Text>
            </VStack>
            <List density="spacious">
              {PROJECT_ACTIONS.map(([icon, label, description]) => (
                <ListItem
                  key={label}
                  label={label}
                  description={description}
                  startContent={
                    <Icon icon={icon} size="md" color="secondary" />
                  }
                  onClick={() => setIsOpen(false)}
                />
              ))}
            </List>
          </VStack>
        </Section>
      </BottomSheet>
    </>
  );
}
