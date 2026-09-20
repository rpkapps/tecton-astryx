import {Icon} from '../../Icon/Icon.js';
import {NavIcon} from '../../NavIcon/NavIcon.js';
import {TopNav} from '../../TopNav/TopNav.js';
import {TopNavHeading} from '../TopNavHeading.js';

export function TopNavHeadingBasic() {
  return (
    <TopNav
      label="Product navigation"
      heading={
        <TopNavHeading
          heading="Acme Platform"
          logo={<NavIcon icon={<Icon name="diamond-mark" />} />}
          headingHref="/"
        />
      }
    />
  );
}
