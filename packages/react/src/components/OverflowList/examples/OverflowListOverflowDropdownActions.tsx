import {Button} from '../../Button/Button.js';
import {Card} from '../../Card/Card.js';
import {Menu} from '../../Menu/Menu.js';
import {OverflowList} from '../OverflowList.js';

const actions = ['Save', 'Edit', 'Duplicate', 'Share', 'Archive', 'Delete'];

export function OverflowListOverflowDropdownActions() {
  return (
    <Card padding={2}>
      <OverflowList
        gap={2}
        overflowRenderer={overflowItems => (
          <Menu
            button={{
              label: `+${overflowItems.length}`,
              variant: 'ghost',
              size: 'sm',
            }}
            items={overflowItems.map(({index}) => ({
              label: actions[index],
              onClick: () => {},
            }))}
          />
        )}
      >
        <Button label="Save" size="sm" variant="primary" />
        <Button label="Edit" size="sm" />
        <Button label="Duplicate" size="sm" />
        <Button label="Share" size="sm" />
        <Button label="Archive" size="sm" />
        <Button label="Delete" size="sm" variant="destructive" />
      </OverflowList>
    </Card>
  );
}
