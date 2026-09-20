'use client';
import Link from 'next/link';
import {Heading, Text} from '@tecton/react';
import {componentRegistry} from '@/generated/componentRegistry';
import {exampleRegistry} from '@/generated/exampleRegistry';
import {foundationData} from '@/generated/foundationData';
import {guideRegistry} from '@/generated/guideRegistry';
import {ComponentGallery} from './gallery';

const INSTALL = `pnpm add @tecton/react react react-dom`;

const MOUNT = `import {TectonProvider, Button} from '@tecton/react';
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
    <div className="rounded-lg border border-fd-border px-4 py-3">
      <p className="text-2xl font-semibold text-fd-foreground">{value}</p>
      <p className="text-xs text-fd-muted-foreground">{label}</p>
    </div>
  );
}

export function Landing() {
  return (
    <main className="mx-auto grid w-full max-w-6xl gap-16 px-6 py-16">
      <section className="grid gap-6">
        <Heading level={1}>Tecton</Heading>
        <div className="max-w-2xl">
          <Text variant="large" color="secondary" display="block">
            A React design system published as one package: {}
            {componentRegistry.length} components, a dark-first theme, one
            stylesheet and no build step. Everything on this site is printed
            from that package — every example below is the running code.
          </Text>
        </div>

        <div className="flex flex-wrap gap-3">
          <Link
            href="/docs/getting-started"
            className="rounded-md px-4 py-2 text-sm font-semibold no-underline"
            style={{
              background: 'var(--color-text-accent)',
              color: 'var(--color-background-body)',
            }}
          >
            Get started
          </Link>
          <Link
            href="/docs/components"
            className="rounded-md border border-fd-border px-4 py-2 text-sm font-semibold text-fd-foreground no-underline transition-colors hover:bg-fd-accent"
          >
            Browse components
          </Link>
        </div>

        <div className="grid max-w-3xl grid-cols-2 gap-3 sm:grid-cols-4">
          <Stat value={componentRegistry.length} label="Components" />
          <Stat value={exampleRegistry.length} label="Live examples" />
          <Stat value={foundationData.iconNames.length} label="Icons" />
          <Stat value={guideRegistry.length} label="Guides" />
        </div>
      </section>

      <section className="grid gap-6 lg:grid-cols-2">
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
