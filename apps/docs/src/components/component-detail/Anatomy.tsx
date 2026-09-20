/**
 * The parts a component is drawn from.
 *
 * Ported from the upstream docsite's
 * `src/components/component-detail/Anatomy.tsx` and its `anatomyHelpers.ts`:
 * the `required` flag becomes a bold lead-in rather than a column of its own,
 * and a part name with a solidus in it is given a break opportunity, because
 * the Element column is laid out fixed and would otherwise break mid-word.
 */

import {Fragment} from 'react';
import {VStack} from '@tecton/react/Layout';
import {Section} from '@tecton/react/Section';
import {Table, pixel, proportional} from '@tecton/react/Table';
import {Card} from '@tecton/react/Card';
import type {AnatomyElement} from '@/types/docs';
import {MarkdownText} from './MarkdownText';

const REQUIRED_LEAD_IN = '**Required:**';

/** Where the browser may break a part name; a name with no solidus is one piece. */
export function anatomyNameSegments(name: string): string[] {
  return name.split(/(?<=\/)/);
}

/** The description to print for one part, with the required flag folded in. */
export function anatomyDescription(element: AnatomyElement): string {
  const description = (element.description ?? '').trim();
  if (!element.required) return description;
  return description ? `${REQUIRED_LEAD_IN} ${description}` : REQUIRED_LEAD_IN;
}

export function Anatomy({elements}: {elements: readonly AnatomyElement[]}) {
  if (elements.length === 0) return null;

  const data = elements.map(element => ({
    name: element.name as unknown,
    description: anatomyDescription(element) as unknown,
  })) as Record<string, unknown>[];

  return (
    <Section>
      <VStack gap={4}>
        <Card variant="default">
          <Table
            data={data}
            columns={[
              {
                key: 'name',
                header: 'Element',
                width: pixel(140),
                renderCell: (item: Record<string, unknown>) =>
                  anatomyNameSegments(item.name as string).map(
                    (segment, index) => (
                      <Fragment key={index}>
                        {index > 0 ? <wbr /> : null}
                        {segment}
                      </Fragment>
                    ),
                  ),
              },
              {
                key: 'description',
                header: 'Description',
                width: proportional(1, {minWidth: 220}),
                renderCell: (item: Record<string, unknown>) => (
                  <MarkdownText type="body">
                    {item.description as string}
                  </MarkdownText>
                ),
              },
            ]}
            density="spacious"
            dividers="rows"
          />
        </Card>
      </VStack>
    </Section>
  );
}
