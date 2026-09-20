'use client';

import {MetadataList, MetadataListItem} from '@tecton/react/MetadataList';
import {Token} from '@tecton/react/Token';
import {HStack} from '@tecton/react/Layout';

export function MetadataListMultiColumnMetadata() {
  return (
    <MetadataList columns="multi">
      <MetadataListItem label="Name">MetadataList</MetadataListItem>
      <MetadataListItem label="Status">Active</MetadataListItem>
      <MetadataListItem label="Owner">Joey</MetadataListItem>
      <MetadataListItem label="Created">Jan 15, 2026</MetadataListItem>
      <MetadataListItem label="Tags">
        <HStack gap={1}>
          <Token label="component" />
          <Token label="xds" />
        </HStack>
      </MetadataListItem>
      <MetadataListItem label="Priority">Tier 1</MetadataListItem>
    </MetadataList>
  );
}
