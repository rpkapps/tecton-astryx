import {Chip} from '../../Chip/Chip.js';
import {HStack} from '../../HStack/HStack.js';
import {MetadataList} from '../MetadataList.js';
import {MetadataListItem} from '../../MetadataListItem/MetadataListItem.js';

export function MetadataListMultiColumnMetadata() {
  return (
    <MetadataList columns="multi">
      <MetadataListItem label="Name">MetadataList</MetadataListItem>
      <MetadataListItem label="Status">Active</MetadataListItem>
      <MetadataListItem label="Owner">Joey</MetadataListItem>
      <MetadataListItem label="Created">Jan 15, 2026</MetadataListItem>
      <MetadataListItem label="Tags">
        <HStack gap={1}>
          <Chip label="component" />
          <Chip label="xds" />
        </HStack>
      </MetadataListItem>
      <MetadataListItem label="Priority">Tier 1</MetadataListItem>
    </MetadataList>
  );
}
