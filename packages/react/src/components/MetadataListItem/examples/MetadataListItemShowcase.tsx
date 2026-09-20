import {Badge} from '../../Badge/Badge.js';
import {Link} from '../../Link/Link.js';
import {MetadataList} from '../../MetadataList/MetadataList.js';
import {MetadataListItem} from '../MetadataListItem.js';

export function MetadataListItemShowcase() {
  return (
    <MetadataList title="Project Details">
      <MetadataListItem label="Name">Design System v2</MetadataListItem>
      <MetadataListItem label="Status">
        <Badge label="Active" />
      </MetadataListItem>
      <MetadataListItem label="Owner">
        <Link href="#">Alice Johnson</Link>
      </MetadataListItem>
      <MetadataListItem label="Created">January 15, 2025</MetadataListItem>
      <MetadataListItem label="Priority">
        <Badge label="High" />
      </MetadataListItem>
      <MetadataListItem label="Repository">
        <Link href="#">github.com/org/design-system</Link>
      </MetadataListItem>
    </MetadataList>
  );
}
