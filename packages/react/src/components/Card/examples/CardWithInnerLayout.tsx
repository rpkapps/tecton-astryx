import {Button} from '../../Button/Button.js';
import {Card} from '../Card.js';
import {HStack} from '../../HStack/HStack.js';
import {Heading} from '../../Heading/Heading.js';
import {Layout} from '../../Layout/Layout.js';
import {LayoutContent} from '../../LayoutContent/LayoutContent.js';
import {LayoutFooter} from '../../LayoutFooter/LayoutFooter.js';
import {LayoutHeader} from '../../LayoutHeader/LayoutHeader.js';
import {Text} from '../../Text/Text.js';

export function CardWithInnerLayout() {
  return (
    <Card width={380}>
      <Layout
        header={
          <LayoutHeader hasDivider>
            <Heading level={3}>Edit Profile</Heading>
          </LayoutHeader>
        }
        content={
          <LayoutContent>
            <Text variant="medium" color="secondary">
              Update your display name, bio, and profile photo. Changes are
              saved immediately.
            </Text>
          </LayoutContent>
        }
        footer={
          <LayoutFooter hasDivider>
            <HStack gap={2}>
              <Button label="Cancel" variant="tertiary" />
              <Button label="Save changes" variant="primary" />
            </HStack>
          </LayoutFooter>
        }
      />
    </Card>
  );
}
