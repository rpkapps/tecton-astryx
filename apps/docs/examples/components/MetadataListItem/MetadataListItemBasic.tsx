'use client';

import {MetadataList, MetadataListItem} from '@tecton/react/MetadataList';
import {Badge} from '@tecton/react/Badge';

export function MetadataListItemBasic() {
  return (
    <MetadataList title="Deployment">
      <MetadataListItem label="Environment">Production</MetadataListItem>
      <MetadataListItem label="Status">
        <Badge label="Healthy" variant="green" />
      </MetadataListItem>
      <MetadataListItem label="Version">v2.14.0</MetadataListItem>
      <MetadataListItem label="Last deployed">June 12, 2026</MetadataListItem>
    </MetadataList>
  );
}
