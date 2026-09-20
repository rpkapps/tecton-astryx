/**
 * Prose out of a doc object.
 *
 * Prop descriptions, dos and don'ts and theming notes are authored as Markdown
 * — inline code in backticks, links as `[label](/docs/theming)` — and they end
 * up inside table cells, where MDX never reaches. Tecton's own `Markdown`
 * renders them, so a code span in a props table looks like a code span
 * everywhere else on the site.
 *
 * Ported from the upstream docsite's `src/components/MarkdownText.tsx`.
 */

import type {ComponentProps, ReactNode} from 'react';
import {Markdown} from '@tecton/react/Markdown';
import type {MarkdownComponents} from '@tecton/react/Markdown';
import {VStack} from '@tecton/react/Layout';
import {Link} from '@tecton/react/Link';
import {Text} from '@tecton/react/Text';

type TextProps = ComponentProps<typeof Text>;

function MarkdownLink({href, children}: {href: string; children: ReactNode}) {
  const isExternal = /^https?:\/\//.test(href);
  return (
    <Link
      href={href}
      type="inherit"
      hasUnderline
      target={isExternal ? '_blank' : undefined}
      rel={isExternal ? 'noreferrer' : undefined}
    >
      {children}
    </Link>
  );
}

const MARKDOWN_COMPONENTS: Partial<MarkdownComponents> = {link: MarkdownLink};

interface MarkdownTextProps {
  children: string;
  type?: TextProps['type'];
  color?: TextProps['color'];
  weight?: TextProps['weight'];
}

/** A doc's Markdown, as one paragraph per blank-line-separated block. */
export function MarkdownText({
  children,
  type = 'body',
  color,
  weight,
}: MarkdownTextProps) {
  const paragraphs = splitParagraphs(children);
  if (paragraphs.length === 0) return null;

  if (paragraphs.length === 1) {
    return (
      <Text as="p" type={type} color={color} weight={weight} display="block">
        <Markdown display="inline" components={MARKDOWN_COMPONENTS}>
          {paragraphs[0]}
        </Markdown>
      </Text>
    );
  }

  return (
    <VStack gap={2}>
      {paragraphs.map((paragraph, index) => (
        <Text
          key={index}
          as="p"
          type={type}
          color={color}
          weight={weight}
          display="block"
        >
          <Markdown display="inline" components={MARKDOWN_COMPONENTS}>
            {paragraph}
          </Markdown>
        </Text>
      ))}
    </VStack>
  );
}

function splitParagraphs(markdown: string): string[] {
  return markdown
    .trim()
    .split(/\n{2,}/)
    .map(block => block.replace(/\s*\n\s*/g, ' ').trim())
    .filter(Boolean);
}
