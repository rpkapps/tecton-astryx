/**
 * What a component has to meet, and where to read the rule.
 *
 * Ported from the upstream docsite's
 * `src/components/component-detail/Accessibility.tsx`. The vendored docs carry
 * the structured requirement rows but no audited theme-coverage tables, so this
 * is the requirements half: grouped by category, with the WCAG criterion each
 * row cites linked out.
 */

import {HStack, VStack} from '@tecton/react/Layout';
import {Card} from '@tecton/react/Card';
import {Link} from '@tecton/react/Link';
import {Table, proportional} from '@tecton/react/Table';
import {Heading, Text} from '@tecton/react/Text';
import type {AccessibilityRequirement} from '@/types/docs';

const CATEGORY_ORDER = [
  'Color contrast',
  'Keyboard',
  'Semantics',
  'Content',
  'General',
];

const WCAG_REFERENCES: Record<string, {label: string; href: string}> = {
  '1.4.3': {
    label: 'WCAG 1.4.3: Contrast (Minimum)',
    href: 'https://www.w3.org/WAI/WCAG22/Understanding/contrast-minimum.html',
  },
  '1.4.11': {
    label: 'WCAG 1.4.11: Non-text Contrast',
    href: 'https://www.w3.org/WAI/WCAG22/Understanding/non-text-contrast.html',
  },
};

function referencesFor(criterion: string) {
  return Object.entries(WCAG_REFERENCES)
    .filter(([number]) => criterion.includes(number))
    .map(([, reference]) => reference);
}

function groupRequirements(requirements: readonly AccessibilityRequirement[]) {
  const groups = new Map<string, AccessibilityRequirement[]>();
  for (const requirement of requirements) {
    const category = requirement.category ?? 'General';
    groups.set(category, [...(groups.get(category) ?? []), requirement]);
  }
  return [...groups.entries()].sort(
    ([a], [b]) => CATEGORY_ORDER.indexOf(a) - CATEGORY_ORDER.indexOf(b),
  );
}

function RequirementsTable({
  items,
}: {
  items: readonly AccessibilityRequirement[];
}) {
  const data = items.map(item => ({
    name: item.name as unknown,
    criterion: (item.criterion ?? '') as unknown,
    requirement: (item.requirement ?? '—') as unknown,
    states: (item.states ?? []) as unknown,
    description: item.description as unknown,
  })) as Record<string, unknown>[];

  return (
    <Card>
      <Table
        data={data}
        columns={[
          {
            key: 'name',
            header: 'Requirement',
            width: proportional(1.2, {minWidth: 120}),
            renderCell: (item: Record<string, unknown>) => (
              <Text weight="bold">{item.name as string}</Text>
            ),
          },
          {
            key: 'requirement',
            header: 'Ratio',
            width: proportional(1, {minWidth: 90}),
            renderCell: (item: Record<string, unknown>) => (
              <Text>{item.requirement as string}</Text>
            ),
          },
          {
            key: 'states',
            header: 'Applies to',
            width: proportional(1.1, {minWidth: 110}),
            renderCell: (item: Record<string, unknown>) => {
              const states = item.states as string[];
              return (
                <Text color="secondary">
                  {states.length > 0 ? states.join(', ') : '—'}
                </Text>
              );
            },
          },
          {
            key: 'description',
            header: 'Guidance',
            width: proportional(4.5, {minWidth: 240}),
            renderCell: (item: Record<string, unknown>) => {
              const references = referencesFor(item.criterion as string);
              return (
                <VStack gap={2}>
                  <Text>{item.description as string}</Text>
                  {references.length > 0 && (
                    <HStack gap={3} wrap="wrap">
                      {references.map(reference => (
                        <Link
                          key={reference.href}
                          href={reference.href}
                          type="supporting"
                          color="secondary"
                          hasUnderline
                          target="_blank"
                        >
                          {reference.label}
                        </Link>
                      ))}
                    </HStack>
                  )}
                </VStack>
              );
            },
          },
        ]}
        density="spacious"
        dividers="rows"
      />
    </Card>
  );
}

export function Accessibility({
  requirements,
}: {
  requirements: readonly AccessibilityRequirement[];
}) {
  if (requirements.length === 0) return null;
  return (
    <VStack gap={8}>
      {groupRequirements(requirements).map(([category, items]) => (
        <VStack key={category} gap={3}>
          <Heading level={3}>{category}</Heading>
          {category === 'Color contrast' && (
            <Text color="secondary" weight="normal">
              Components must meet WCAG 2.2 Level AA across variants, states and
              modes. Measure foreground and background colours as they appear
              together on screen.
            </Text>
          )}
          <RequirementsTable items={items} />
        </VStack>
      ))}
    </VStack>
  );
}
