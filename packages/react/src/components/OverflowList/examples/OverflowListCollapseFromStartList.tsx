import {Button} from '../../Button/Button.js';
import {Card} from '../../Card/Card.js';
import {Center} from '../../Center/Center.js';
import {OverflowList} from '../OverflowList.js';

export function OverflowListCollapseFromStartList() {
  return (
    <Center width={300}>
      <Card padding={2}>
        <OverflowList
          gap={2}
          collapseFrom="start"
          overflowRenderer={overflowItems => (
            <Button
              label={`+${overflowItems.length} more`}
              variant="tertiary"
              size="sm"
            />
          )}
        >
          <Button label="Step 1" size="sm" />
          <Button label="Step 2" size="sm" />
          <Button label="Step 3" size="sm" />
          <Button label="Step 4" size="sm" />
          <Button label="Step 5" size="sm" />
        </OverflowList>
      </Card>
    </Center>
  );
}
