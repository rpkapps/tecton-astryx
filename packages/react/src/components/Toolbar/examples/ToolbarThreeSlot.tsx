import {Button} from '../../Button/Button.js';
import {Card} from '../../Card/Card.js';
import {Heading} from '../../Heading/Heading.js';
import {Section} from '../../Section/Section.js';
import {Toolbar} from '../Toolbar.js';

export function ToolbarThreeSlot() {
  return (
    <Card>
      <Toolbar
        label="Document toolbar"
        dividers={['bottom']}
        startContent={
          <Button label="Back" variant="tertiary" icon="arrow-left" />
        }
        centerContent={<Heading level={4}>Title</Heading>}
        endContent={
          <>
            <Button label="Discard" variant="secondary" />
            <Button label="Save" variant="primary" />
          </>
        }
      />
      <Section />
    </Card>
  );
}
