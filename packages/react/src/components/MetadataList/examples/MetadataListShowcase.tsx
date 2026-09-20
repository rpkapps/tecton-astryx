import {MetadataList} from '../MetadataList.js';
import {MetadataListItem} from '../../MetadataListItem/MetadataListItem.js';

export function MetadataListShowcase() {
  return (
    <MetadataList>
      <MetadataListItem label="Name">MetadataList</MetadataListItem>
      <MetadataListItem label="Status">Active</MetadataListItem>
      <MetadataListItem label="Owner">Joey</MetadataListItem>
    </MetadataList>
  );
}
