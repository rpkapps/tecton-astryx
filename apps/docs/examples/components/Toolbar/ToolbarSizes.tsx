'use client';

import {Toolbar} from '@tecton/react/Toolbar';
import {Button} from '@tecton/react/Button';
import {Icon} from '@tecton/react/Icon';
import {Heading} from '@tecton/react/Text';
import {Stack} from '@tecton/react/Layout';
import {Card} from '@tecton/react/Card';
import {AddIcon, FilterIcon} from '@tecton/react/icons';

const SIZES = [
  {size: 'sm' as const, label: 'Small'},
  {size: 'md' as const, label: 'Medium'},
  {size: 'lg' as const, label: 'Large'},
];

export function ToolbarSizes() {
  return (
    <Stack direction="vertical" gap={4} style={{width: 500}}>
      {SIZES.map(({size, label}) => (
        <Card key={size}>
          <Toolbar
            label={`${label} toolbar`}
            size={size}
            startContent={<Heading level={4}>{label}</Heading>}
            endContent={
              <>
                <Button
                  label="Filter"
                  variant="ghost"
                  icon={<Icon icon={FilterIcon} />}
                  isIconOnly
                />
                <Button label="Add" icon={<Icon icon={AddIcon} />} />
              </>
            }
          />
        </Card>
      ))}
    </Stack>
  );
}
