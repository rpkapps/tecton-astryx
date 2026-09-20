import {Button} from '../../Button/Button.js';
import {Card} from '../../Card/Card.js';
import {Heading} from '../../Heading/Heading.js';
import {Stack} from '../../Stack/Stack.js';
import {Toolbar} from '../Toolbar.js';

const SIZES = [
  {size: 'sm' as const, label: 'Small'},
  {size: 'md' as const, label: 'Medium'},
  {size: 'lg' as const, label: 'Large'},
];

export function ToolbarSizes() {
  return (
    <Stack direction="vertical" gap={4}>
      {SIZES.map(({size, label}) => (
        <Card key={size}>
          <Toolbar
            label={`${label} toolbar`}
            size={size}
            startContent={<Heading level={4}>{label}</Heading>}
            endContent={
              <>
                <Button label="Filter" variant="tertiary" icon="filter" />
                <Button label="Add" icon="add" />
              </>
            }
          />
        </Card>
      ))}
    </Stack>
  );
}
