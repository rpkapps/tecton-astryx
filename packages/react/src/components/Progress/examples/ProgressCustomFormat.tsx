import {Progress} from '../Progress.js';
import {Text} from '../../Text/Text.js';
import {VStack} from '../../VStack/VStack.js';

export function ProgressCustomFormat() {
  return (
    <div style={{width: 300}}>
      <VStack gap={1}>
        <Progress
          value={3.2}
          max={5}
          label="Disk usage"
          hasValueLabel
          formatValueLabel={(value: number, max: number) =>
            `${value} GB / ${max} GB`
          }
        />
        <Text variant="small" color="secondary">
          1.8 GB remaining
        </Text>
      </VStack>
    </div>
  );
}
