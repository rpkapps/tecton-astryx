'use client';

import {Center} from '@tecton/react/Center';
import {Card} from '@tecton/react/Card';
import {Stack} from '@tecton/react/Layout';
import {Icon} from '@tecton/react/Icon';
import {IconButton} from '@tecton/react/IconButton';
import {AnnotateIcon, ImageIcon, LinkIcon, ListIcon} from '@tecton/react/icons';

export function CenterHorizontal() {
  return (
    <Card width={520} padding={2}>
      <Center axis="horizontal" width="100%">
        <Stack direction="horizontal" gap={0} vAlign="center">
          <IconButton
            label="Bold"
            icon={<Icon icon={AnnotateIcon} />}
            variant="ghost"
            size="sm"
          />
          <IconButton
            label="Italic"
            icon={<Icon icon={AnnotateIcon} />}
            variant="ghost"
            size="sm"
          />
          <IconButton
            label="Underline"
            icon={<Icon icon={AnnotateIcon} />}
            variant="ghost"
            size="sm"
          />
          <IconButton
            label="List"
            icon={<Icon icon={ListIcon} />}
            variant="ghost"
            size="sm"
          />
          <IconButton
            label="Link"
            icon={<Icon icon={LinkIcon} />}
            variant="ghost"
            size="sm"
          />
          <IconButton
            label="Image"
            icon={<Icon icon={ImageIcon} />}
            variant="ghost"
            size="sm"
          />
        </Stack>
      </Center>
    </Card>
  );
}
