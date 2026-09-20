import {useState} from 'react';
import {Menu} from '../Menu.js';
import {Text} from '../../Text/Text.js';
import {VStack} from '../../VStack/VStack.js';
import {useMediaQuery} from '../../../support/index.js';

const COMPACT_TOUCH_QUERY =
  '(max-width: 639px) and (pointer: coarse) and (hover: none)';

const ACTIONS = [
  {label: 'Edit project', icon: 'edit-square'},
  {label: 'Duplicate project', icon: 'copy'},
  {label: 'Share project', icon: 'link'},
  {label: 'Archive project', icon: 'folder'},
] as const;

export function MenuBottomSheet() {
  const [lastAction, setLastAction] = useState<string | null>(null);
  const isCompactTouchSurface = useMediaQuery(COMPACT_TOUCH_QUERY);

  return (
    <VStack gap={3}>
      <Menu
        button={{label: 'Project actions'}}
        presentation={isCompactTouchSurface ? 'bottom-sheet' : 'popover'}
        items={ACTIONS.map(({label, icon}) => ({
          label,
          icon,
          onClick: () => setLastAction(label),
        }))}
      />
      {lastAction && (
        <Text variant="small" color="secondary">
          Last action: {lastAction}
        </Text>
      )}
    </VStack>
  );
}
