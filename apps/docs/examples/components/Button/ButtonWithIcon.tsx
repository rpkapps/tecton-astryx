'use client';

import {Button} from '@tecton/react/Button';
import {Icon} from '@tecton/react/Icon';
import {Stack} from '@tecton/react/Layout';
import {Text} from '@tecton/react/Text';
import {
  AddIcon,
  DeleteIcon,
  EditSquareIcon,
  ExportUploadIcon,
} from '@tecton/react/icons';

export function ButtonWithIcon() {
  return (
    <Stack direction="vertical" gap={4}>
      <Text type="supporting" color="secondary">
        Icons reinforce the action
      </Text>
      <Stack direction="horizontal" gap={3} vAlign="center">
        <Button
          label="New item"
          variant="primary"
          icon={<Icon icon={AddIcon} />}
        />
        <Button
          label="Edit"
          variant="secondary"
          icon={<Icon icon={EditSquareIcon} />}
        />
        <Button
          label="Download"
          variant="ghost"
          icon={<Icon icon={ExportUploadIcon} />}
        />
        <Button
          label="Delete"
          variant="destructive"
          icon={<Icon icon={DeleteIcon} />}
        />
      </Stack>
    </Stack>
  );
}
