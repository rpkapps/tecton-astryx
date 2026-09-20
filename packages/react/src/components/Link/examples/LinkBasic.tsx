import {Link} from '../Link.js';
import {Text} from '../../Text/Text.js';

export function LinkBasic() {
  return (
    <Text as="p">
      The casing shoe sits at{' '}
      <Link href="#" underline="always">
        13,359 ft MD
      </Link>
      , which is{' '}
      <Link href="https://example.com" isExternal>
        inside the depleted interval
      </Link>
      .
    </Text>
  );
}
