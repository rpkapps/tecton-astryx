/**
 * The landing page.
 *
 * It says what Tecton is in one sentence — the component system's surface, one
 * for one, under Tecton's theme — shows the two snippets that get a consumer to
 * a rendered button, and then hands over to the gallery, where every tile is
 * the component itself running.
 */

import {Link} from 'fumadocs-core/framework';
import {Card} from '@tecton/react/Card';
import {HStack, VStack} from '@tecton/react/Layout';
import {Heading, Text} from '@tecton/react/Text';
import {siteCounts} from '@/generated/siteCounts';
import {ComponentGallery} from './gallery';

const INSTALL = 'pnpm add @tecton/react react react-dom';

const MOUNT = `import {TectonProvider} from '@tecton/react';
import {Button} from '@tecton/react/Button';
import '@tecton/react/styles.css';

export function App() {
  return (
    <TectonProvider mode="dark">
      <Button label="Generate facies model" variant="primary" />
    </TectonProvider>
  );
}`;

function Snippet({code, label}: {code: string; label: string}) {
  return (
    <div className="grid gap-1.5">
      <p className="text-xs font-medium text-fd-muted-foreground">{label}</p>
      <pre className="overflow-x-auto rounded-lg border border-fd-border bg-fd-card p-4 text-[0.8125rem] leading-relaxed">
        <code>{code}</code>
      </pre>
    </div>
  );
}

function Stat({value, label}: {value: string | number; label: string}) {
  return (
    <Card variant="muted">
      <VStack gap={0}>
        <Text type="display-3">{String(value)}</Text>
        <Text type="supporting" color="secondary">
          {label}
        </Text>
      </VStack>
    </Card>
  );
}

const componentCount = siteCounts.components;
const hookCount = siteCounts.hooks;

export function Landing() {
  return (
    <main className="mx-auto grid w-full max-w-6xl gap-16 px-6 py-16">
      <section className="grid gap-6">
        <Heading level={1} type="display-1">
          Tecton
        </Heading>
        <div className="max-w-2xl">
          <Text type="large" color="secondary" display="block">
            One React package, {componentCount} component modules and{' '}
            {hookCount} hooks, published with the names and props their authors
            gave them and themed by Tecton. Everything on this site is printed
            from that package — every example below is the running code.
          </Text>
        </div>

        <HStack gap={3} wrap="wrap">
          <Link
            href="/docs/getting-started/"
            className="rounded-md px-4 py-2 text-sm font-semibold no-underline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-fd-ring"
            style={{
              background: 'var(--color-text-accent)',
              color: 'var(--color-background-body)',
            }}
          >
            Get started
          </Link>
          <Link
            href="/docs/components/"
            className="rounded-md border border-fd-border px-4 py-2 text-sm font-semibold text-fd-foreground no-underline transition-colors hover:bg-fd-accent focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-fd-ring"
          >
            Browse components
          </Link>
        </HStack>

        <div className="grid max-w-4xl grid-cols-2 gap-3 sm:grid-cols-5">
          <Stat value={componentCount} label="Component modules" />
          <Stat value={hookCount} label="Hooks" />
          <Stat value={siteCounts.examples} label="Live examples" />
          <Stat value={siteCounts.templates} label="Page templates" />
          <Stat value={siteCounts.icons} label="Icons" />
        </div>
      </section>

      <section className="grid items-start gap-6 lg:grid-cols-2">
        <Snippet label="Install" code={INSTALL} />
        <Snippet label="Mount" code={MOUNT} />
      </section>

      <section className="grid gap-6">
        <Heading level={2}>The library</Heading>
        <ComponentGallery />
      </section>
    </main>
  );
}
