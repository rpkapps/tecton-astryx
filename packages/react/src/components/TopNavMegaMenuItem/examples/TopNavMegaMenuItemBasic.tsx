import {Grid} from '../../Grid/Grid.js';
import {TopNavMegaMenuItem} from '../TopNavMegaMenuItem.js';

export function TopNavMegaMenuItemBasic() {
  return (
    <Grid columns={2} gap={2}>
      <TopNavMegaMenuItem
        title="Edge Functions"
        description="Run serverless code at the network edge"
        icon="electricity"
        href="#edge"
      />
      <TopNavMegaMenuItem
        title="Storage"
        description="Object and file storage for your application"
        icon="database"
        href="#storage"
      />
    </Grid>
  );
}
