import {Badge} from '../../Badge/Badge.js';
import {MetadataList} from '../../MetadataList/MetadataList.js';
import {MetadataListItem} from '../MetadataListItem.js';

export function MetadataListItemBasic() {
  return (
    <MetadataList title="Deployment">
      <MetadataListItem label="Environment">Production</MetadataListItem>
      <MetadataListItem label="Status">
        <Badge label="Healthy" />
      </MetadataListItem>
      <MetadataListItem label="Version">v2.14.0</MetadataListItem>
      <MetadataListItem label="Last deployed">June 12, 2026</MetadataListItem>
    </MetadataList>
  );
}
