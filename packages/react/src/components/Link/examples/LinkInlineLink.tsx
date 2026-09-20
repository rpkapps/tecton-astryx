import {Link} from '../Link.js';
import {Text} from '../../Text/Text.js';

export function LinkInlineLink() {
  return (
    <Text variant="medium">
      Read the <Link href="#">documentation</Link> for more information about
      using Tecton components.
    </Text>
  );
}
