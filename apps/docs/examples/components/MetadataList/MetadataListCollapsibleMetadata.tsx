'use client';

import {MetadataList, MetadataListItem} from '@tecton/react/MetadataList';

export function MetadataListCollapsibleMetadata() {
  return (
    <MetadataList maxNumOfItems={3}>
      <MetadataListItem label="Name">MetadataList</MetadataListItem>
      <MetadataListItem label="Status">Active</MetadataListItem>
      <MetadataListItem label="Owner">Joey</MetadataListItem>
      <MetadataListItem label="Created">Jan 15, 2026</MetadataListItem>
      <MetadataListItem label="Updated">Mar 26, 2026</MetadataListItem>
      <MetadataListItem label="Priority">Tier 1</MetadataListItem>
    </MetadataList>
  );
}
