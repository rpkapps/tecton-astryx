'use client';

/**
 * Code the page builds at runtime.
 *
 * Every code sample the generator knows about at build time is a fenced block
 * in the MDX, so fumadocs highlights it with Shiki and gives it a copy button.
 * Two samples are not known then — the `defineTheme` snippet a theming table
 * derives, and the JSX the playground writes as knobs are turned — so they get
 * this instead: the same surface and the same copy button, drawn from Tecton.
 */

import {useState} from 'react';
import {HStack, VStack} from '@tecton/react/Layout';
import {Button} from '@tecton/react/Button';
import {Card} from '@tecton/react/Card';
import {Text} from '@tecton/react/Text';

export function CodeBlock({code, label}: {code: string; label?: string}) {
  const [copied, setCopied] = useState(false);

  const copy = async () => {
    try {
      await navigator.clipboard.writeText(code);
      setCopied(true);
      window.setTimeout(() => setCopied(false), 1500);
    } catch {
      // A browser that refuses the clipboard leaves the text selectable.
    }
  };

  return (
    <Card variant="muted" padding={0}>
      <VStack gap={0}>
        <HStack
          gap={2}
          vAlign="center"
          hAlign="between"
          style={{
            paddingInline: 'var(--spacing-3)',
            paddingBlock: 'var(--spacing-2)',
          }}
        >
          <Text type="supporting" color="secondary">
            {label ?? 'Code'}
          </Text>
          <Button
            label={copied ? 'Copied' : 'Copy'}
            variant="ghost"
            size="sm"
            onClick={copy}
          />
        </HStack>
        <pre
          style={{
            margin: 0,
            overflowX: 'auto',
            padding: 'var(--spacing-3)',
            fontFamily: 'var(--font-mono)',
            fontSize: '0.8125rem',
            lineHeight: 1.6,
            color: 'var(--color-text-primary)',
          }}
        >
          <code>{code}</code>
        </pre>
      </VStack>
    </Card>
  );
}
