'use client';

import {Toolbar} from '@tecton/react/Toolbar';
import {Button} from '@tecton/react/Button';
import {Icon} from '@tecton/react/Icon';
import {Card} from '@tecton/react/Card';
import {Section} from '@tecton/react/Section';
import {Text} from '@tecton/react/Text';
import {VStack} from '@tecton/react/Layout';
import {AnnotateIcon} from '@tecton/react/icons';

export function UseKeyboardHintHookUsage() {
  return (
    <Card style={{width: 420}}>
      <Toolbar
        label="Text formatting"
        dividers={['bottom']}
        startContent={
          <>
            <Button
              label="Bold"
              variant="ghost"
              icon={<Icon icon={AnnotateIcon} />}
              isIconOnly
            />
            <Button
              label="Italic"
              variant="ghost"
              icon={<Icon icon={AnnotateIcon} />}
              isIconOnly
            />
            <Button
              label="Underline"
              variant="ghost"
              icon={<Icon icon={AnnotateIcon} />}
              isIconOnly
            />
          </>
        }
      />
      <Section>
        <VStack gap={1}>
          <Text type="body" weight="bold">
            Keyboard-friendly by default
          </Text>
          <Text type="supporting" color="secondary">
            Tab into the toolbar with your keyboard and Toolbar shows an
            ephemeral "← → to navigate" hint — powered by useKeyboardHint — so
            sighted keyboard users learn that arrows move within the group.
          </Text>
        </VStack>
      </Section>
    </Card>
  );
}
