import {Icon} from '../Icon.js';
import {HStack} from '../../HStack/HStack.js';

export function IconBasic() {
  return (
    <HStack gap={2} align="center">
      <Icon name="drill-bit" size={24} label="Drill bit" />
      <Icon name="seismic" size={24} label="Seismic" />
      <Icon name="well-pick" size={24} label="Well pick" />
      <Icon name="strata" size={24} label="Strata" />
    </HStack>
  );
}
