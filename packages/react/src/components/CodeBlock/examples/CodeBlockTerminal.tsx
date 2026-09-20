import {CodeBlock} from '../CodeBlock.js';
import {CodeTheme} from '../../CodeTheme/CodeTheme.js';
import {githubDark} from '../../../support/index.js';

const commands = `$ astryx init --features agents
✓ AI agent docs installed → AGENTS.md
$ pnpm astryx component CodeBlock --dense`;

export function CodeBlockTerminal() {
  return (
    <CodeTheme theme={githubDark}>
      <CodeBlock
        code={commands}
        language="bash"
        hasCopyButton
        style={{width: '100%', maxWidth: 480}}
      />
    </CodeTheme>
  );
}
