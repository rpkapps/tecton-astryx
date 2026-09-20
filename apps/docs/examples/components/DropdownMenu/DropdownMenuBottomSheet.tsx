'use client';

import {useState} from 'react';
import {
  CopyIcon,
  EditSquareIcon,
  FolderIcon,
  LinkIcon,
} from '@tecton/react/icons';
import {DropdownMenu} from '@tecton/react/DropdownMenu';
import {VStack} from '@tecton/react/Stack';
import {Text} from '@tecton/react/Text';
import {useMediaQuery} from '@tecton/react/hooks';

const COMPACT_TOUCH_QUERY =
  '(max-width: 639px) and (pointer: coarse) and (hover: none)';

const ACTIONS = [
  {label: 'Edit project', icon: EditSquareIcon},
  {label: 'Duplicate project', icon: CopyIcon},
  {label: 'Share project', icon: LinkIcon},
  {label: 'Archive project', icon: FolderIcon},
] as const;

export function DropdownMenuBottomSheet() {
  const [lastAction, setLastAction] = useState<string | null>(null);
  const isCompactTouchSurface = useMediaQuery(COMPACT_TOUCH_QUERY);

  return (
    <VStack gap={3}>
      <DropdownMenu
        button={{label: 'Project actions'}}
        presentation={isCompactTouchSurface ? 'bottom-sheet' : 'popover'}
        items={ACTIONS.map(({label, icon}) => ({
          label,
          icon,
          onClick: () => setLastAction(label),
        }))}
      />
      {lastAction && (
        <Text type="supporting" color="secondary">
          Last action: {lastAction}
        </Text>
      )}
    </VStack>
  );
}
