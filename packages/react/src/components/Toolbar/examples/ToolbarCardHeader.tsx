import {Button} from '../../Button/Button.js';
import {Card} from '../../Card/Card.js';
import {Heading} from '../../Heading/Heading.js';
import {Section} from '../../Section/Section.js';
import {Toolbar} from '../Toolbar.js';

export function ToolbarCardHeader() {
  return (
    <Card>
      <Toolbar
        label="User list actions"
        size="sm"
        dividers={['bottom']}
        startContent={<Heading level={4}>Card title</Heading>}
        endContent={
          <>
            <Button label="Filter" variant="tertiary" icon="filter" />
            <Button label="Add user" icon="add" />
          </>
        }
      />
      <Section />
    </Card>
  );
}
