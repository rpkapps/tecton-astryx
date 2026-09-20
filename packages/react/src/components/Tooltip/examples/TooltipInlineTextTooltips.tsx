import {Text} from '../../Text/Text.js';
import {Tooltip} from '../Tooltip.js';

export function TooltipInlineTextTooltips() {
  return (
    <Text variant="medium">
      Learn more about our{' '}
      <Tooltip
        content="Your data is encrypted and never shared"
        placement="above"
      >
        privacy policy
      </Tooltip>{' '}
      and{' '}
      <Tooltip content="Standard 30-day agreement" placement="above">
        terms of service
      </Tooltip>
      .
    </Text>
  );
}
