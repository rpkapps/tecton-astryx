import {Button} from '../../Button/Button.js';
import {Card} from '../../Card/Card.js';
import {Center} from '../../Center/Center.js';
import {Menu} from '../../Menu/Menu.js';
import {OverflowList} from '../OverflowList.js';

const actions = ['Save', 'Edit', 'Duplicate', 'Share', 'Archive', 'Delete'];

export function OverflowListCappedToolbar() {
  return (
    <Center width={420}>
      <Card padding={2}>
        <OverflowList
          gap={2}
          maxVisibleItems={3}
          overflowRenderer={overflowItems => (
            <Menu
              button={{
                label: `+${overflowItems.length}`,
                variant: 'ghost',
                size: 'sm',
              }}
              items={overflowItems.map(({index}) => ({
                label: actions[index],
              }))}
            />
          )}
        >
          {actions.map(action => (
            <Button key={action} label={action} size="sm" />
          ))}
        </OverflowList>
      </Card>
    </Center>
  );
}
