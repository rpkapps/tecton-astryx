'use client';

import {SyntaxTheme} from '@tecton/react/theme';
import {githubDark} from '@tecton/react/theme/syntax';
import {CodeBlock} from '@tecton/react/CodeBlock';

const commands = `$ tecton init --features agents
✓ AI agent docs installed → AGENTS.md
$ pnpm tecton component CodeBlock --dense`;

export function CodeBlockTerminal() {
  return (
    <SyntaxTheme theme={githubDark}>
      <CodeBlock
        code={commands}
        language="bash"
        hasCopyButton
        style={{width: '100%', maxWidth: 480}}
      />
    </SyntaxTheme>
  );
}
