'use client';

import {useRef, useState} from 'react';
import * as stylex from '@stylexjs/stylex';
import {BaseTypeahead, createStaticSource} from '@tecton/react/Typeahead';
import type {SearchableItem} from '@tecton/react/Typeahead';
import {VStack} from '@tecton/react/Layout';
import {Text} from '@tecton/react/Text';
import {
  borderVars,
  colorVars,
  focusVars,
  radiusVars,
  spacingVars,
} from '@tecton/react/theme/tokens.stylex';

const frameworks: SearchableItem[] = [
  {id: 'react', label: 'React', auxiliaryData: {category: 'UI library'}},
  {id: 'remix', label: 'Remix', auxiliaryData: {category: 'Web framework'}},
  {id: 'next', label: 'Next.js', auxiliaryData: {category: 'Web framework'}},
];

const source = createStaticSource(frameworks);

const styles = stylex.create({
  root: {
    width: '100%',
    maxWidth: 360,
  },
  field: {
    backgroundColor: colorVars['--color-background-surface'],
    borderColor: colorVars['--color-border'],
    borderRadius: radiusVars['--radius-element'],
    borderStyle: 'solid',
    borderWidth: borderVars['--border-width'],
    paddingBlock: spacingVars['--spacing-1-5'],
    paddingInline: spacingVars['--spacing-2'],
    outlineColor: {
      default: 'transparent',
      ':has(input:focus-visible)': focusVars['--focus-outline-color'],
    },
    outlineOffset: focusVars['--focus-outline-offset'],
    outlineStyle: 'solid',
    outlineWidth: {
      default: '0',
      ':has(input:focus-visible)': focusVars['--focus-outline-width'],
    },
  },
  result: {
    minWidth: 0,
  },
});

export function BaseTypeaheadShowcase() {
  const [value, setValue] = useState<SearchableItem | null>(null);
  const wrapperRef = useRef<HTMLDivElement>(null);

  return (
    <VStack gap={3} xstyle={styles.root}>
      <div ref={wrapperRef} {...stylex.props(styles.field)}>
        <BaseTypeahead
          aria-label="Search frameworks"
          searchSource={source}
          value={value}
          onChange={setValue}
          anchorRef={wrapperRef}
          placeholder="Search frameworks…"
          hasEntriesOnFocus
          debounceMs={0}
          renderItem={item => (
            <VStack gap={0} xstyle={styles.result}>
              <Text type="label">{item.label}</Text>
              <Text type="supporting" color="secondary">
                {
                  (item.auxiliaryData as {category?: string} | undefined)
                    ?.category
                }
              </Text>
            </VStack>
          )}
        />
      </div>
    </VStack>
  );
}
