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
          logo={<NavIcon icon="diamond-mark" />}
          headingHref="/"
        />
      }
    />
  );
}
