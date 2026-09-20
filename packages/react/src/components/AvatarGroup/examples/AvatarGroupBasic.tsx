import {Avatar} from '../../Avatar/Avatar.js';
import {AvatarGroup} from '../AvatarGroup.js';

export function AvatarGroupBasic() {
  return (
    <AvatarGroup size={32} max={3}>
      <Avatar name="Ingrid Halvorsen" />
      <Avatar name="Ola Nordmann" />
      <Avatar name="Sofia Reyes" />
      <Avatar name="Tom Baird" />
      <Avatar name="Yuki Tanaka" />
    </AvatarGroup>
  );
}
