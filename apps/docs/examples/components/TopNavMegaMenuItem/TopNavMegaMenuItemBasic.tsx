'use client';

import {TopNavMegaMenuItem} from '@tecton/react/TopNav';
import {Grid} from '@tecton/react/Grid';
import {DatabaseIcon, ElectricityIcon} from '@tecton/react/icons';

export function TopNavMegaMenuItemBasic() {
  return (
    <Grid columns={2} gap={2}>
      <TopNavMegaMenuItem
        title="Edge Functions"
        description="Run serverless code at the network edge"
        icon={<ElectricityIcon width={20} height={20} />}
        href="#edge"
      />
      <TopNavMegaMenuItem
        title="Storage"
        description="Object and file storage for your application"
        icon={<DatabaseIcon width={20} height={20} />}
        href="#storage"
      />
    </Grid>
  );
}
