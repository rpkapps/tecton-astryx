'use client';

import {SyntaxTheme} from '@tecton/react/theme';
import {oneDarkPro} from '@tecton/react/theme/syntax';
import {CodeBlock} from '@tecton/react/CodeBlock';
import {Stack} from '@tecton/react/Layout';
import {Text} from '@tecton/react/Text';

const sampleCode = `async function save() {
  await api.update(values);
  toast.show('Saved');
}`;

export function SyntaxThemeShowcase() {
  return (
    <SyntaxTheme theme={oneDarkPro}>
      <Stack
        direction="vertical"
        gap={2}
        style={{width: 360, maxWidth: '100%'}}
      >
        <Text type="supporting" weight="bold" color="secondary">
          One Dark Pro preset
        </Text>
        <CodeBlock code={sampleCode} language="tsx" />
      </Stack>
    </SyntaxTheme>
  );
}
