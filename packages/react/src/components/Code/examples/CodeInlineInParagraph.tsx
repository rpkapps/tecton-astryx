import {Code} from '../Code.js';
import {Text} from '../../Text/Text.js';

export function CodeInlineInParagraph() {
  return (
    <Text variant="medium">
      Use <Code>useState</Code>for local state and <Code>useEffect</Code>for
      side effects. If you need shared state across components, consider{' '}
      <Code>useContext</Code>or a state management library.
    </Text>
  );
}
