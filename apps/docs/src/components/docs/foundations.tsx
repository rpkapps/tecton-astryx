'use client';
import {useMemo, useState, type ReactNode} from 'react';
import {
  Heading,
  Icon,
  Table,
  Text,
  TextField,
  ToggleButtonGroup,
} from '@tecton/react';
import type {TectonIconName} from '@tecton/react';
import {foundationData} from '@/generated/foundationData';
import type {TokenRow} from '@/types/docs';

/* -------------------------------------------------------------------------- */
/* Shared furniture                                                           */
/* -------------------------------------------------------------------------- */

function Section({title, children}: {title: string; children: ReactNode}) {
  return (
    <section className="not-prose mt-10 grid gap-4">
      <Heading level={3}>{title}</Heading>
      {children}
    </section>
  );
}

const mono = (value: ReactNode) => (
  <code className="text-[0.8125rem] whitespace-nowrap">{value}</code>
);

/** A colour chip drawn from a literal value, in both modes side by side. */
function Swatch({value, title}: {value: string; title?: string}) {
  return (
    <span
      title={title ?? value}
      className="inline-block size-6 shrink-0 rounded-[4px] border"
      style={{background: value, borderColor: 'var(--color-border)'}}
    />
  );
}

function TokenTable({
  rows,
  header = 'Token',
  render,
}: {
  rows: readonly TokenRow[];
  header?: string;
  render?: (row: TokenRow) => ReactNode;
}) {
  if (rows.length === 0) return null;
  return (
    <div className="overflow-x-auto">
      <Table
        data={rows.map(row => ({...row}))}
        idKey="path"
        density="sm"
        isStriped
        columns={[
          ...(render
            ? [
                {
                  key: 'light' as const,
                  header: '',
                  width: {share: 1, minWidth: 90},
                  renderCell: render,
                },
              ]
            : []),
          {
            key: 'path',
            header,
            width: {share: 2, minWidth: 130},
            renderCell: row => mono(row.path),
          },
          {
            key: 'token',
            header: 'Custom property',
            width: {share: 3, minWidth: 190},
            renderCell: row => mono(row.token),
          },
          {
            key: 'value',
            header: 'Value',
            width: {share: 2, minWidth: 120},
            renderCell: row => mono(row.value ?? '—'),
          },
          {
            key: 'description',
            header: 'What it is for',
            width: {share: 4, minWidth: 180},
            renderCell: row => row.description ?? '',
          },
        ]}
      />
    </div>
  );
}

/* -------------------------------------------------------------------------- */
/* Colour                                                                     */
/* -------------------------------------------------------------------------- */

function ColourFoundation() {
  const [filter, setFilter] = useState('');
  const groups = useMemo(() => {
    const needle = filter.trim().toLowerCase();
    if (!needle) return foundationData.paletteGroups;
    return foundationData.paletteGroups
      .map(group => ({
        ...group,
        rows: group.rows.filter(
          row =>
            `${group.name}.${row.path}`.toLowerCase().includes(needle) ||
            row.light.toLowerCase().includes(needle) ||
            row.dark.toLowerCase().includes(needle),
        ),
      }))
      .filter(group => group.rows.length > 0);
  }, [filter]);

  return (
    <div className="grid gap-2">
      <Text display="block" color="secondary" variant="small">
        {foundationData.paletteTotal} colour roles, each with the value it takes
        in dark and in light. {foundationData.paletteDescribed} of them carry
        the design foundation&rsquo;s own description.
      </Text>

      <div className="not-prose my-4 max-w-sm">
        <TextField
          label="Filter roles"
          placeholder="text, surface, #1d1c1f…"
          value={filter}
          onChange={setFilter}
          startIcon="search"
        />
      </div>

      {groups.map(group => (
        <Section key={group.name} title={group.title}>
          <div className="overflow-x-auto">
            <Table
              data={group.rows.map(row => ({...row}))}
              idKey="path"
              density="sm"
              isStriped
              columns={[
                {
                  key: 'path',
                  header: 'Dark',
                  width: {share: 1, minWidth: 74},
                  align: 'center',
                  renderCell: row => <Swatch value={row.dark} />,
                },
                {
                  key: 'light',
                  header: 'Light',
                  width: {share: 1, minWidth: 74},
                  align: 'center',
                  renderCell: row => <Swatch value={row.light} />,
                },
                {
                  key: 'dark',
                  header: 'Role',
                  width: {share: 3, minWidth: 160},
                  renderCell: row => mono(`${group.name}.${row.path}`),
                },
                {
                  key: 'description',
                  header: 'Values',
                  width: {share: 3, minWidth: 170},
                  renderCell: row => (
                    <span className="flex flex-col">
                      {mono(`dark  ${row.dark}`)}
                      {mono(`light ${row.light}`)}
                    </span>
                  ),
                },
              ]}
            />
          </div>
          {group.rows.some(row => row.description) ? (
            <ul className="grid gap-1 text-sm text-fd-muted-foreground">
              {group.rows
                .filter(row => row.description)
                .map(row => (
                  <li key={row.path}>
                    <code>{row.path}</code> — {row.description}
                  </li>
                ))}
            </ul>
          ) : null}
        </Section>
      ))}

      <Section title="The token map">
        <TokenTable rows={foundationData.colourTokens} header="tecton.color" />
      </Section>
    </div>
  );
}

/* -------------------------------------------------------------------------- */
/* Typography                                                                 */
/* -------------------------------------------------------------------------- */

function TypographyFoundation() {
  const sections = [
    ...new Set(foundationData.typeRows.map(row => row.section)),
  ];
  return (
    <div className="grid gap-2">
      <Section title="Families">
        <TokenTable rows={foundationData.fontFamilies} header="tecton.font" />
      </Section>

      {sections.map(section => (
        <Section key={section} title={section}>
          <div className="grid gap-4">
            {foundationData.typeRows
              .filter(row => row.section === section)
              .map(row => (
                <div
                  key={row.name}
                  className="grid gap-1 border-b border-fd-border pb-4 last:border-b-0"
                >
                  <div className="flex flex-wrap items-baseline gap-3 text-xs text-fd-muted-foreground">
                    <code className="text-fd-foreground">{row.name}</code>
                    <span>{row.sizePx}</span>
                    <span>weight {row.weight}</span>
                    <span>leading {row.leading}</span>
                    {row.isData ? <span>monospace</span> : null}
                  </div>
                  <p
                    style={{
                      fontFamily: row.isData
                        ? 'var(--font-family-code)'
                        : 'var(--font-family-body)',
                      fontSize: row.size,
                      fontWeight: row.weight,
                      lineHeight: row.leading,
                      color: 'var(--color-text-primary)',
                      margin: 0,
                    }}
                  >
                    {row.sample}
                  </p>
                  {row.description ? (
                    <Text variant="small" color="secondary" display="block">
                      {row.description}
                    </Text>
                  ) : null}
                </div>
              ))}
          </div>
        </Section>
      ))}
    </div>
  );
}

/* -------------------------------------------------------------------------- */
/* Spacing, shape, elevation, motion                                          */
/* -------------------------------------------------------------------------- */

function Bar({value}: {value?: string}) {
  return (
    <span
      className="inline-block h-4 rounded-[2px]"
      style={{
        width: value ?? 0,
        minWidth: 2,
        background: 'var(--color-accent)',
      }}
    />
  );
}

function SpacingFoundation() {
  return (
    <div className="grid gap-2">
      <Section title="Spacing">
        <TokenTable
          rows={foundationData.spacingRows}
          header="tecton.space"
          render={row => <Bar value={row.value} />}
        />
      </Section>
      <Section title="Radius">
        <TokenTable
          rows={foundationData.radiusRows}
          header="tecton.radius"
          render={row => (
            <span
              className="inline-block size-8 border"
              style={{
                borderRadius: row.value,
                background: 'var(--color-background-muted)',
                borderColor: 'var(--color-border)',
              }}
            />
          )}
        />
      </Section>
    </div>
  );
}

function ShapeFoundation() {
  return (
    <div className="grid gap-2">
      <Section title="Corner radius">
        <TokenTable
          rows={foundationData.radiusRows}
          header="tecton.radius"
          render={row => (
            <span
              className="inline-block size-8 border"
              style={{
                borderRadius: row.value,
                background: 'var(--color-background-muted)',
                borderColor: 'var(--color-border)',
              }}
            />
          )}
        />
      </Section>
      <Section title="Border width">
        <TokenTable rows={foundationData.borderRows} header="tecton.border" />
      </Section>
      <Section title="Control size">
        <TokenTable
          rows={foundationData.sizeRows}
          header="tecton.size"
          render={row => (
            <span
              className="inline-block w-12 rounded-[4px]"
              style={{
                height: row.value,
                background: 'var(--color-background-muted)',
              }}
            />
          )}
        />
      </Section>
    </div>
  );
}

function ElevationFoundation() {
  return (
    <Section title="Shadow">
      <TokenTable
        rows={foundationData.shadowRows}
        header="tecton.shadow"
        render={row => (
          <span
            className="inline-block size-10 rounded-[4px]"
            style={{
              boxShadow: row.value,
              background: 'var(--color-background-card)',
            }}
          />
        )}
      />
    </Section>
  );
}

function MotionFoundation() {
  return (
    <Section title="Duration">
      <TokenTable
        rows={foundationData.motionRows}
        header="Duration"
        render={row => (
          <span
            className="tecton-animated inline-block h-2 w-10 rounded-full"
            style={{
              background: 'var(--color-accent)',
              transition: `opacity ${row.value ?? '0ms'} ease`,
            }}
          />
        )}
      />
    </Section>
  );
}

/* -------------------------------------------------------------------------- */
/* Icons                                                                      */
/* -------------------------------------------------------------------------- */

function IconsFoundation() {
  const [variant, setVariant] = useState<'outline' | 'filled'>('outline');
  const [filter, setFilter] = useState('');
  const names = useMemo(() => {
    const needle = filter.trim().toLowerCase();
    return foundationData.iconNames.filter(name =>
      needle ? name.includes(needle) : true,
    );
  }, [filter]);

  return (
    <div className="not-prose grid gap-6">
      <div className="flex flex-wrap items-end gap-4">
        <div className="min-w-[16rem] flex-1">
          <TextField
            label="Filter glyphs"
            placeholder="well, chevron, layers…"
            value={filter}
            onChange={setFilter}
            startIcon="search"
          />
        </div>
        <ToggleButtonGroup
          label="Which cut of the glyph to draw"
          items={[
            {value: 'outline', label: 'Outline'},
            {value: 'filled', label: 'Filled'},
          ]}
          value={variant}
          onChange={value => setVariant(value as 'outline' | 'filled')}
        />
      </div>

      <Text variant="small" color="secondary" display="block">
        {names.length} of {foundationData.iconNames.length} glyphs.
      </Text>

      <ul className="grid list-none grid-cols-[repeat(auto-fill,minmax(7.5rem,1fr))] gap-2 p-0">
        {names.map(name => (
          <li
            key={name}
            className="flex flex-col items-center gap-2 rounded-md border border-fd-border p-3 text-center"
          >
            <Icon name={name as TectonIconName} variant={variant} size={24} />
            <code className="text-[0.6875rem] leading-tight break-words">
              {name}
            </code>
          </li>
        ))}
      </ul>
    </div>
  );
}

/* -------------------------------------------------------------------------- */

const FOUNDATIONS: Record<string, () => ReactNode> = {
  colour: ColourFoundation,
  typography: TypographyFoundation,
  spacing: SpacingFoundation,
  shape: ShapeFoundation,
  elevation: ElevationFoundation,
  motion: MotionFoundation,
  icons: IconsFoundation,
};

/** Draws the foundations page the generated MDX names. */
export function Foundation({name}: {name: string}) {
  const Component = FOUNDATIONS[name];
  if (!Component) {
    return (
      <p className="text-sm" style={{color: 'var(--color-error)'}}>
        No foundations page is implemented for <code>{name}</code>.
      </p>
    );
  }
  return <Component />;
}
