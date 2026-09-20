import {Button} from '../../Button/Button.js';
import {Card} from '../../Card/Card.js';
import {HStack} from '../../HStack/HStack.js';
import {Heading} from '../../Heading/Heading.js';
import {Layout} from '../Layout.js';
import {LayoutContent} from '../../LayoutContent/LayoutContent.js';
import {LayoutFooter} from '../../LayoutFooter/LayoutFooter.js';
import {LayoutHeader} from '../../LayoutHeader/LayoutHeader.js';
import {Text} from '../../Text/Text.js';
import {VStack} from '../../VStack/VStack.js';

export function LayoutBasicCardLayout() {
  return (
    <Card width="100%">
      <Layout
        header={
          <LayoutHeader hasDivider>
            <Heading level={4}>Card Title</Heading>
          </LayoutHeader>
        }
        content={
          <LayoutContent>
            <VStack gap={3}>
              <Text variant="medium">
                This is a basic card layout with a header, scrollable content
                area, and footer. The layout automatically handles padding and
                spacing between sections.
              </Text>
              <Text variant="medium">
                When content exceeds the available height, the content area
                scrolls independently while the header and footer stay fixed in
                place.
              </Text>
              <Text variant="medium">
                This pattern works well for modal dialogs, detail panels, and
                any card where the amount of content is unpredictable.
              </Text>
              <Text variant="medium">
                The dividers between header, content, and footer provide clear
                visual boundaries between the fixed and scrollable regions.
              </Text>
            </VStack>
          </LayoutContent>
        }
        footer={
          <LayoutFooter hasDivider>
            <HStack gap={2}>
              <Button label="Cancel" variant="secondary" label="Cancel" />
              <Button label="Save" variant="primary" label="Save" />
            </HStack>
          </LayoutFooter>
        }
      />
    </Card>
  );
}
