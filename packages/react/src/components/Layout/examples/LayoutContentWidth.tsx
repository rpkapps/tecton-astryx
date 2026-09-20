import {Button} from '../../Button/Button.js';
import {HStack} from '../../HStack/HStack.js';
import {Heading} from '../../Heading/Heading.js';
import {Layout} from '../Layout.js';
import {LayoutContent} from '../../LayoutContent/LayoutContent.js';
import {LayoutFooter} from '../../LayoutFooter/LayoutFooter.js';
import {LayoutHeader} from '../../LayoutHeader/LayoutHeader.js';
import {Text} from '../../Text/Text.js';
import {VStack} from '../../VStack/VStack.js';

export function LayoutContentWidth() {
  return (
    <Layout
      height="fill"
      contentWidth={360}
      header={
        <LayoutHeader hasDivider>
          <Heading level={4}>Centered Form</Heading>
        </LayoutHeader>
      }
      content={
        <LayoutContent>
          <VStack gap={3}>
            <Text variant="medium">
              The contentWidth prop constrains content to a maximum width and
              centers it within the layout. Dividers remain full-bleed while
              content stays narrow and readable.
            </Text>
            <Text variant="medium" color="secondary">
              Common widths: 640 for forms, 960 for content pages.
            </Text>
          </VStack>
        </LayoutContent>
      }
      footer={
        <LayoutFooter hasDivider>
          <HStack gap={2}>
            <Button label="Cancel" variant="secondary" label="Cancel" />
            <Button label="Submit" variant="primary" label="Submit" />
          </HStack>
        </LayoutFooter>
      }
    />
  );
}
