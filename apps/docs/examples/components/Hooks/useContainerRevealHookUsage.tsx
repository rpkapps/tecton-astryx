'use client';

import * as stylex from '@stylexjs/stylex';
import {useContainerReveal} from '@tecton/react/hooks';
import {Button} from '@tecton/react/Button';
import {Card} from '@tecton/react/Card';
import {Icon} from '@tecton/react/Icon';
import {Item} from '@tecton/react/Item';
import {Stack} from '@tecton/react/Layout';
import {Text} from '@tecton/react/Text';
import {mergeProps} from '@tecton/react/utils';
import {DeleteIcon, EditSquareIcon} from '@tecton/react/icons';

const styles = stylex.create({
  actions: {
    display: 'flex',
    gap: 4,
  },
  intro: {
    paddingInline: 12,
    paddingBottom: 8,
  },
});

function FileRow({name}: {name: string}) {
  // Destructure the two prop getters. Spreading getContainerProps() on the row
  // gives it a scoped hover/focus-within trigger; getContentRevealProps() hides
  // the actions at rest and reveals them when the row is hovered or focused.
  const {getContainerProps, getContentRevealProps} = useContainerReveal();

  return (
    <Item
      label={name}
      description="Edited 2 hours ago"
      endContent={
        <span
          {...mergeProps(getContentRevealProps(), stylex.props(styles.actions))}
        >
          <Button
            label={`Edit ${name}`}
            variant="ghost"
            isIconOnly
            icon={<Icon icon={EditSquareIcon} size="sm" />}
          />
          <Button
            label={`Delete ${name}`}
            variant="ghost"
            isIconOnly
            icon={<Icon icon={DeleteIcon} size="sm" />}
          />
        </span>
      }
      {...getContainerProps()}
    />
  );
}

export function UseContainerRevealHookUsage() {
  return (
    <Card width={420} padding={2}>
      <Stack gap={0}>
        <Text type="supporting" color="secondary" xstyle={styles.intro}>
          Hover a row — or Tab into it — to reveal its actions. On touch they
          stay visible.
        </Text>
        <FileRow name="report.pdf" />
        <FileRow name="budget.xlsx" />
        <FileRow name="notes.txt" />
      </Stack>
    </Card>
  );
}
