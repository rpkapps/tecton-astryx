import {Button} from '../../Button/Button.js';
import {Card} from '../../Card/Card.js';
import {HStack} from '../../HStack/HStack.js';
import {Heading} from '../../Heading/Heading.js';
import {Layout} from '../Layout.js';
import {LayoutContent} from '../../LayoutContent/LayoutContent.js';
import {LayoutFooter} from '../../LayoutFooter/LayoutFooter.js';
import {LayoutHeader} from '../../LayoutHeader/LayoutHeader.js';
import {Section} from '../../Section/Section.js';
import {Text} from '../../Text/Text.js';

export function LayoutFullBleedContent() {
  return (
    <Card width="100%">
      <Layout
        header={
          <LayoutHeader hasDivider>
            <Heading level={4}>Full Bleed Example</Heading>
          </LayoutHeader>
        }
        content={
          <LayoutContent padding={0}>
            <Section variant="muted">
              <Text variant="medium">
                Section automatically escapes the parent container padding to
                fill edge-to-edge. Useful for wash backgrounds, tables, or
                images that need to span the full width.
              </Text>
            </Section>
          </LayoutContent>
        }
        footer={
          <LayoutFooter hasDivider>
            <HStack gap={2}>
              <Button label="Close" variant="secondary" />
            </HStack>
          </LayoutFooter>
        }
      />
    </Card>
  );
}
