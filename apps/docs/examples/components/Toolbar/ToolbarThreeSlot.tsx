'use client';

import {Toolbar} from '@tecton/react/Toolbar';
import {Button} from '@tecton/react/Button';
import {Icon} from '@tecton/react/Icon';
import {Heading} from '@tecton/react/Text';
import {Card} from '@tecton/react/Card';
import {Section} from '@tecton/react/Section';
import {ArrowLeftIcon} from '@tecton/react/icons';

export function ToolbarThreeSlot() {
  return (
    <Card style={{width: 600, height: '100%', marginTop: 260}}>
      <Toolbar
        label="Document toolbar"
        dividers={['bottom']}
        startContent={
          <Button
            label="Back"
            variant="ghost"
            icon={<Icon icon={ArrowLeftIcon} />}
            isIconOnly
          />
        }
        centerContent={<Heading level={4}>Title</Heading>}
        endContent={
          <>
            <Button label="Discard" variant="secondary" />
            <Button label="Save" variant="primary" />
          </>
        }
      />
      <Section />
    </Card>
  );
}
