import {CodeBlock} from '../../CodeBlock/CodeBlock.js';
import {CodeTheme} from '../CodeTheme.js';
import {Stack} from '../../Stack/Stack.js';
import {Text} from '../../Text/Text.js';
import {oneDarkPro} from '../../../support/index.js';

const sampleCode = `async function save() {
  await api.update(values);
  toast.show('Saved');
}`;

export function CodeThemeShowcase() {
  return (
    <CodeTheme theme={oneDarkPro}>
      <Stack direction="vertical" gap={2}>
        <Text variant="small" weight="bold" color="secondary">
          One Dark Pro preset
        </Text>
        <CodeBlock code={sampleCode} language="tsx" />
      </Stack>
    </CodeTheme>
  );
}
