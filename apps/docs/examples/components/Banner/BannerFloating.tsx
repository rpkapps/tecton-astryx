'use client';

import {Banner} from '@tecton/react/Banner';

export function BannerFloating() {
  return (
    <Banner
      status="info"
      title="You have unsaved changes"
      description="A raised banner reads as an overlay floating above the page."
      elevation="med"
    />
  );
}
