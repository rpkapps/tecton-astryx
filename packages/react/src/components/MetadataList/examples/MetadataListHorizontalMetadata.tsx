import {MetadataList} from '../MetadataList.js';
import {MetadataListItem} from '../../MetadataListItem/MetadataListItem.js';

export function MetadataListHorizontalMetadata() {
  return (
    <MetadataList orientation="horizontal">
      <MetadataListItem label="Status">Active</MetadataListItem>
      <MetadataListItem label="Type">Premium</MetadataListItem>
      <MetadataListItem label="Owner">Joey</MetadataListItem>
      <MetadataListItem label="Created">Jan 15, 2026</MetadataListItem>
    </MetadataList>
  );
}
