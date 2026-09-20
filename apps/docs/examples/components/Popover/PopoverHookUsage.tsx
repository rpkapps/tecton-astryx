'use client';

import {usePopover} from '@tecton/react/Popover';
import {Button} from '@tecton/react/Button';
import {Card} from '@tecton/react/Card';
import {Center} from '@tecton/react/Center';
import {VStack} from '@tecton/react/Layout';
import {Text} from '@tecton/react/Text';

export function PopoverHookUsage() {
  const popover = usePopover({dialogLabel: 'Quick actions'});

  return (
    <Center height={240}>
      <Button
        label="Open actions"
        ref={popover.triggerRef}
        onClick={popover.toggle}
        {...popover.triggerProps}
      />
      {popover.render(
        <Card width={220} padding={3} variant="transparent">
          <VStack gap={2}>
            <Text type="body" weight="bold">
              Quick actions
            </Text>
            <Button label="Create task" size="sm" />
            <Button label="Share report" variant="secondary" size="sm" />
          </VStack>
        </Card>,
        {placement: 'below', alignment: 'center'},
      )}
    </Center>
  );
}
