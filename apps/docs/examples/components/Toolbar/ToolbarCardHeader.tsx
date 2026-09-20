'use client';

import {Toolbar} from '@tecton/react/Toolbar';
import {Button} from '@tecton/react/Button';
import {Icon} from '@tecton/react/Icon';
import {Heading} from '@tecton/react/Text';
import {Card} from '@tecton/react/Card';
import {Section} from '@tecton/react/Section';
import {AddIcon, FilterIcon} from '@tecton/react/icons';

export function ToolbarCardHeader() {
  return (
    <Card style={{width: 500, height: '100%', marginTop: 260}}>
      <Toolbar
        label="User list actions"
        size="sm"
        dividers={['bottom']}
        startContent={<Heading level={4}>Card title</Heading>}
        endContent={
          <>
            <Button
              label="Filter"
              variant="ghost"
              icon={<Icon icon={FilterIcon} />}
              isIconOnly
            />
            <Button
              label="Add user"
              icon={<Icon icon={AddIcon} />}
              isIconOnly
            />
          </>
        }
      />
      <Section />
    </Card>
  );
}
