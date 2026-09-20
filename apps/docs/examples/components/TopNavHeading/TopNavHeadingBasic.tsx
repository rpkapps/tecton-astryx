'use client';

import {TopNav, TopNavHeading} from '@tecton/react/TopNav';
import {NavIcon} from '@tecton/react/NavIcon';
import {Icon} from '@tecton/react/Icon';

export function TopNavHeadingBasic() {
  return (
    <TopNav
      label="Product navigation"
      heading={
        <TopNavHeading
          heading="Acme Platform"
          logo={<NavIcon icon={<Icon icon="viewColumns" />} />}
          headingHref="/"
        />
      }
    />
  );
}
