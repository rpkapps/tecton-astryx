/*
 * ============================================================================
 * TEMPORARY — Phase 1 fidelity gallery.
 * ============================================================================
 *
 * This route exists to review the Tecton theme against the design screenshots
 * and to feed `scripts/capture-fidelity.mjs`. It is the ONE file in the
 * repository allowed to import the upstream component library directly,
 * because Phase 1 themes components that Tecton does not wrap yet. Phase 4
 * restructures the documentation site and this page goes away: nothing here is
 * a pattern to copy, and none of it is part of the Tecton surface.
 *
 * `?mode=light` renders the same gallery in light mode; the capture script uses
 * both.
 */
import {useSearchParams} from 'react-router';
import {TectonProvider, tecton} from '@tecton/react';
import {Button} from '@astryxdesign/core/Button';
import {TextInput} from '@astryxdesign/core/TextInput';
import {Badge} from '@astryxdesign/core/Badge';
import {Banner} from '@astryxdesign/core/Banner';
import {CheckboxInput} from '@astryxdesign/core/CheckboxInput';
import {RadioList, RadioListItem} from '@astryxdesign/core/RadioList';
import {Switch} from '@astryxdesign/core/Switch';
import {TabList, Tab} from '@astryxdesign/core/TabList';
import {ProgressBar} from '@astryxdesign/core/ProgressBar';
import {Avatar} from '@astryxdesign/core/Avatar';
import {Divider} from '@astryxdesign/core/Divider';
import {Card} from '@astryxdesign/core/Card';
import {Text} from '@astryxdesign/core/Text';
import {StatusDot} from '@astryxdesign/core/StatusDot';
import {Token} from '@astryxdesign/core/Token';
import {
  Table,
  TableBody,
  TableCell,
  TableHeader,
  TableHeaderCell,
  TableRow,
} from '@astryxdesign/core/Table';

/*
 * The names the Tecton theme adds to the upstream vocabulary, declared here.
 *
 * `@tecton/react` declares these for itself, but it does not publish them: a
 * Tecton component maps its own vocabulary onto them, so nothing a consumer
 * writes names an upstream type. This page is not a consumer — it drives the
 * upstream components directly — so it declares what it needs.
 *
 * The eight custom `Text` types are the ones whose CSS the theme compiler
 * emits without their augmentation (its lookup expects a `<Component><Prop>Map`
 * interface; the extension point for text types is `CustomTextTypes` on the
 * theme module). The fidelity report records that gap.
 */
import type {} from '@astryxdesign/core/theme';

declare module '@astryxdesign/core/theme' {
  interface CustomTextTypes {
    mediumStrong: true;
    smallStrong: true;
    tiny: true;
    largeData: true;
    mediumData: true;
    smallData: true;
    actionMedium: true;
    actionSmall: true;
  }
}

declare module '@astryxdesign/core/Button' {
  interface ButtonVariantMap {
    outlined: true;
    'text-only': true;
  }
}

declare module '@astryxdesign/core/Banner' {
  interface BannerStatusMap {
    neutral: true;
  }
}

declare module '@astryxdesign/core/Badge' {
  interface BadgeVariantMap {
    lime: true;
  }
}

/** Button emphases, in the order the Tecton matrix prints them. */
const BUTTON_VARIANTS = [
  ['primary', 'primary'],
  ['secondary', 'secondary'],
  ['ghost', 'tertiary'],
  ['outlined', 'outlined'],
  ['text-only', 'textOnly'],
  ['destructive', '(no Tecton source)'],
] as const;

/**
 * Interaction states the capture script forces through the debugger, plus the
 * two that are real props. `pseudo` is read by `scripts/capture-fidelity.mjs`.
 */
const BUTTON_STATES = [
  {label: 'Enabled', pseudo: null, disabled: false},
  {label: 'Hover', pseudo: 'hover', disabled: false},
  {label: 'Pressed', pseudo: 'active', disabled: false},
  {label: 'Focus', pseudo: 'focus-visible', disabled: false},
  {label: 'Disabled', pseudo: null, disabled: true},
] as const;

const BADGE_VARIANTS = [
  'neutral',
  'info',
  'success',
  'warning',
  'error',
  'lime',
  'blue',
  'cyan',
  'green',
  'orange',
  'pink',
  'purple',
  'red',
  'teal',
  'yellow',
] as const;

const TYPE_SCALE = [
  ['display-1', 'display1 — 48/500'],
  ['display-2', 'display2 — 40/500'],
  ['display-3', 'display3 — 32/500'],
  ['large', 'large — 16/500'],
  ['body', 'medium — 14/400'],
  ['mediumStrong', 'mediumStrong — 14/500'],
  ['supporting', 'small — 12/400'],
  ['smallStrong', 'smallStrong — 12/500'],
  ['tiny', 'tiny — 10/500'],
  ['actionMedium', 'actionMedium — 14/500'],
  ['actionSmall', 'actionSmall — 12/500'],
  ['largeData', '1,248.75 bbl'],
  ['mediumData', '32.45% / 1,280 ft'],
  ['smallData', '0.0037 sec'],
] as const;

const ROWS = [
  {well: 'Spekk fm top', status: 'Active', depth: '2,525 m', id: 'USR-2048'},
  {well: 'Avery Stone', status: 'Pending', depth: '2,639 m', id: 'USR-2049'},
  {well: 'Noah Patel', status: 'Disabled', depth: '3,104 m', id: 'USR-2050'},
  {well: 'Maya Chen', status: 'Active', depth: '1,880 m', id: 'USR-2051'},
];

/** A slug the capture script uses to crop one section out of the page. */
const slug = (title: string) =>
  title
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/(^-|-$)/g, '');

function Section({title, note, children}: SectionProps) {
  return (
    <section
      data-section={slug(title)}
      style={{marginBottom: tecton.space.xxl}}
    >
      <h2
        style={{
          margin: `0 0 ${tecton.space.xs}`,
          font: 'inherit',
          fontSize: 'var(--text-heading-2-size)',
          fontWeight: 'var(--text-heading-2-weight)',
          lineHeight: 'var(--text-heading-2-leading)',
          color: tecton.color.text.primary,
        }}
      >
        {title}
      </h2>
      {note ? (
        <p
          style={{
            margin: `0 0 ${tecton.space.md}`,
            color: tecton.color.text.secondary,
            fontSize: 'var(--text-supporting-size)',
          }}
        >
          {note}
        </p>
      ) : null}
      {children}
    </section>
  );
}

interface SectionProps {
  title: string;
  note?: string;
  children: React.ReactNode;
}

const rowStyle = {
  display: 'flex',
  flexWrap: 'wrap' as const,
  alignItems: 'center',
  gap: tecton.space.md,
};

const labelStyle = {
  color: tecton.color.text.secondary,
  fontSize: 'var(--text-supporting-size)',
  minWidth: '96px',
};

export function ThemePreview() {
  const [params] = useSearchParams();
  const mode = params.get('mode') === 'light' ? 'light' : 'dark';

  return (
    <TectonProvider mode={mode}>
      <div
        data-fidelity-gallery={mode}
        style={{
          background: tecton.color.surface.body,
          color: tecton.color.text.primary,
          fontFamily: tecton.font.family.body,
          padding: tecton.space.xxl,
          minHeight: '100vh',
        }}
      >
        <h1
          style={{
            margin: `0 0 ${tecton.space.lg}`,
            font: 'inherit',
            fontSize: 'var(--text-heading-1-size)',
            fontWeight: 'var(--text-heading-1-weight)',
          }}
        >
          Tecton theme — {mode} mode
        </h1>

        <Section
          title="Buttons"
          note="Five Tecton emphases plus destructive, across every state. Hover, pressed and focus are forced for the capture."
        >
          <div style={{display: 'grid', gap: tecton.space.sm}}>
            <div style={rowStyle}>
              <span style={labelStyle} />
              {BUTTON_STATES.map(state => (
                <span
                  key={state.label}
                  style={{...labelStyle, minWidth: '112px'}}
                >
                  {state.label}
                </span>
              ))}
            </div>
            {BUTTON_VARIANTS.map(([variant, tectonName]) => (
              <div key={variant} style={rowStyle}>
                <span style={labelStyle}>{tectonName}</span>
                {BUTTON_STATES.map(state => (
                  <span
                    key={state.label}
                    style={{minWidth: '112px'}}
                    data-force-pseudo={state.pseudo ?? undefined}
                  >
                    <Button
                      label="Label"
                      variant={variant}
                      isDisabled={state.disabled}
                    />
                  </span>
                ))}
              </div>
            ))}
            <div style={rowStyle}>
              <span style={labelStyle}>sizes</span>
              <Button label="Small" size="sm" />
              <Button label="Medium" size="md" />
              <Button label="Large" size="lg" />
            </div>
          </div>
        </Section>

        <Section
          title="Text input"
          note="Tecton's default field is the outlined one. Filled and text-only have no variant axis here."
        >
          <div style={{...rowStyle, alignItems: 'flex-start'}}>
            <div style={{width: '220px'}}>
              <TextInput
                label="Field label"
                value="Value"
                onChange={() => {}}
              />
            </div>
            <div style={{width: '220px'}}>
              <TextInput
                label="Field label"
                value=""
                placeholder="Type here"
                onChange={() => {}}
              />
            </div>
            <div style={{width: '220px'}}>
              <TextInput
                label="Field label"
                value="Value"
                onChange={() => {}}
                status={{type: 'error', message: 'Validation failed'}}
              />
            </div>
            <div style={{width: '220px'}}>
              <TextInput
                label="Field label"
                value="Value"
                onChange={() => {}}
                isDisabled
              />
            </div>
          </div>
        </Section>

        <Section
          title="Table"
          note="Header is the lightest surface in the component; alternate rows carry the stripe."
        >
          <Table isStriped hasHover>
            <TableHeader>
              <TableRow>
                <TableHeaderCell>Well</TableHeaderCell>
                <TableHeaderCell>Status</TableHeaderCell>
                <TableHeaderCell>Depth (TVDSS)</TableHeaderCell>
                <TableHeaderCell>ID</TableHeaderCell>
              </TableRow>
            </TableHeader>
            <TableBody>
              {ROWS.map(item => (
                <TableRow key={item.id}>
                  <TableCell>{item.well}</TableCell>
                  <TableCell>
                    <span style={rowStyle}>
                      <StatusDot
                        variant={
                          item.status === 'Active'
                            ? 'success'
                            : item.status === 'Pending'
                              ? 'warning'
                              : 'neutral'
                        }
                        label={item.status}
                      />
                      {item.status}
                    </span>
                  </TableCell>
                  <TableCell>
                    <Text type="mediumData">{item.depth}</Text>
                  </TableCell>
                  <TableCell>
                    <Text type="mediumData">{item.id}</Text>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </Section>

        <Section
          title="Badges and chips"
          note="The standalone pill is Tecton's chip: semantic variants are solid fills with dark ink, hue variants stay tinted."
        >
          <div style={{...rowStyle, marginBottom: tecton.space.md}}>
            {BADGE_VARIANTS.map(variant => (
              <Badge key={variant} variant={variant} label={variant} />
            ))}
          </div>
          <div style={rowStyle}>
            <Token label="Chip" />
            <Token label="Deletable" onRemove={() => {}} />
            <Token label="Disabled" isDisabled />
            <Token label="Blue" color="blue" />
            <Token label="Green" color="green" />
            <Token label="Red" color="red" />
          </div>
        </Section>

        <Section
          title="Banners"
          note="Tecton's alert is a saturated fill carrying dark ink. Neutral is a Tecton-only status."
        >
          <div
            style={{display: 'grid', gap: tecton.space.sm, maxWidth: '760px'}}
          >
            {(['info', 'success', 'warning', 'error', 'neutral'] as const).map(
              status => (
                <Banner
                  key={status}
                  status={status}
                  title={`${status} title`}
                  description="A short description that sits under the title."
                  collapsible={false}
                />
              ),
            )}
          </div>
        </Section>

        <Section
          title="Selection controls"
          note="Tecton reads selection as a bright chip, not as the accent. Only the switch carries the violet."
        >
          <div
            style={{
              ...rowStyle,
              alignItems: 'flex-start',
              gap: tecton.space.xl,
            }}
          >
            <div style={{display: 'grid', gap: tecton.space.sm}}>
              <CheckboxInput
                label="Unchecked"
                value={false}
                onChange={() => {}}
              />
              <CheckboxInput
                label="Indeterminate"
                value="indeterminate"
                onChange={() => {}}
              />
              <CheckboxInput label="Checked" value onChange={() => {}} />
              <CheckboxInput
                label="Disabled"
                value
                isDisabled
                onChange={() => {}}
              />
            </div>
            <RadioList label="Choose one" value="one" onChange={() => {}}>
              <RadioListItem value="one" label="Option one" />
              <RadioListItem value="two" label="Option two" />
              <RadioListItem value="three" label="Disabled option" isDisabled />
            </RadioList>
            <div style={{display: 'grid', gap: tecton.space.sm}}>
              <Switch label="Off" value={false} onChange={() => {}} />
              <Switch label="On" value onChange={() => {}} />
              <Switch
                label="Disabled on"
                value
                isDisabled
                onChange={() => {}}
              />
            </div>
          </div>
        </Section>

        <Section
          title="Tabs"
          note="Selected tab: near-white label plus the indicator rule."
        >
          <TabList value="overview" onChange={() => {}} hasDivider>
            <Tab value="overview" label="Overview" />
            <Tab value="framing" label="Framing" />
            <Tab value="team" label="Team" />
            <Tab value="well" label="Project Well" />
          </TabList>
        </Section>

        <Section
          title="Progress"
          note="The track is drawn at divider-strong weight; accent is the neutral Tecton 'primary'."
        >
          <div
            style={{display: 'grid', gap: tecton.space.md, maxWidth: '420px'}}
          >
            {(
              ['accent', 'success', 'warning', 'error', 'neutral'] as const
            ).map(variant => (
              <ProgressBar
                key={variant}
                label={variant}
                value={50}
                variant={variant}
                hasValueLabel
              />
            ))}
          </div>
        </Section>

        <Section title="Avatar, divider, panel">
          <div style={{...rowStyle, marginBottom: tecton.space.lg}}>
            <Avatar name="Olivia Park" />
            <Avatar name="Avery Stone" shape="rounded" />
            <Avatar name="Noah Patel" shape="square" />
            <Avatar name="Maya Chen" size="lg" />
          </div>
          <div style={{maxWidth: '520px', marginBottom: tecton.space.lg}}>
            <div style={labelStyle}>subtle</div>
            <Divider variant="subtle" />
            <div style={labelStyle}>strong</div>
            <Divider variant="strong" />
          </div>
          <Card maxWidth={520}>
            <div
              style={{
                display: 'flex',
                justifyContent: 'space-between',
                marginBottom: tecton.space.sm,
              }}
            >
              <Text type="mediumStrong">2 Horizons</Text>
              <Badge variant="info" label="Ongoing" />
            </div>
            <Divider variant="subtle" />
            <div
              style={{
                display: 'flex',
                justifyContent: 'space-between',
                marginTop: tecton.space.sm,
              }}
            >
              <Text type="supporting">Top Depth (TVDSS)</Text>
              <Text type="mediumData">2,525 m</Text>
            </div>
            <div style={{display: 'flex', justifyContent: 'space-between'}}>
              <Text type="supporting">Bottom Depth (TVDSS)</Text>
              <Text type="mediumData">2,639 m</Text>
            </div>
          </Card>
        </Section>

        <Section
          title="Type scale"
          note="Sixteen Tecton variants: eleven interface styles, three data styles, two action styles."
        >
          <div style={{display: 'grid', gap: tecton.space.sm}}>
            {TYPE_SCALE.map(([type, sample]) => (
              <div key={type} style={rowStyle}>
                <span style={{...labelStyle, minWidth: '140px'}}>{type}</span>
                <Text type={type}>{sample}</Text>
              </div>
            ))}
          </div>
        </Section>
      </div>
    </TectonProvider>
  );
}
