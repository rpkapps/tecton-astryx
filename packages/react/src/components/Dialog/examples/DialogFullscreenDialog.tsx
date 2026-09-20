import {useState} from 'react';
import {Button} from '../../Button/Button.js';
import {Card} from '../../Card/Card.js';
import {Dialog} from '../Dialog.js';
import {DialogHeader} from '../../DialogHeader/DialogHeader.js';
import {HStack} from '../../HStack/HStack.js';
import {Layout} from '../../Layout/Layout.js';
import {LayoutContent} from '../../LayoutContent/LayoutContent.js';
import {LayoutFooter} from '../../LayoutFooter/LayoutFooter.js';
import {Text} from '../../Text/Text.js';
import {VStack} from '../../VStack/VStack.js';

const SECTIONS = [
  {
    title: 'Getting started',
    body: 'Create your first project by clicking New Project in the sidebar. Choose a template or start from scratch.',
  },
  {
    title: 'Team members',
    body: 'Invite collaborators from Settings > Team. Each member can have Admin, Editor, or Viewer permissions.',
  },
  {
    title: 'Billing',
    body: 'Free plans include up to 3 projects. Upgrade to Pro for unlimited projects and priority support.',
  },
  {
    title: 'API access',
    body: 'Generate API keys from Settings > Developer. Rate limits are 1,000 requests per minute on free plans.',
  },
  {
    title: 'Data export',
    body: 'Export your data anytime from Settings > Data. Exports are available as CSV or JSON within 24 hours.',
  },
];

export function DialogFullscreenDialog() {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <Card>
      <VStack gap={3}>
        <VStack gap={1}>
          <Text variant="medium" weight="bold">
            Help &amp; Documentation
          </Text>
          <Text variant="small" color="secondary">
            5 articles · Last updated Apr 2026
          </Text>
        </VStack>
        <Button
          label="Open documentation"
          variant="secondary"
          onClick={() => setIsOpen(true)}
        />
      </VStack>
      <Dialog isOpen={isOpen} onOpenChange={setIsOpen} variant="fullscreen">
        <Layout
          header={
            <DialogHeader
              title="Documentation"
              subtitle="Everything you need to get started"
              onOpenChange={setIsOpen}
            />
          }
          content={
            <LayoutContent>
              <VStack gap={4}>
                {SECTIONS.map(({title, body}) => (
                  <VStack key={title} gap={1}>
                    <Text variant="medium" weight="bold">
                      {title}
                    </Text>
                    <Text variant="medium">{body}</Text>
                  </VStack>
                ))}
              </VStack>
            </LayoutContent>
          }
          footer={
            <LayoutFooter>
              <HStack>
                <Button
                  label="Close"
                  variant="primary"
                  onClick={() => setIsOpen(false)}
                />
              </HStack>
            </LayoutFooter>
          }
        />
      </Dialog>
    </Card>
  );
}
