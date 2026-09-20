import {Carousel} from '../../Carousel/Carousel.js';
import {ChatComposer} from '../../ChatComposer/ChatComposer.js';
import {ChatComposerDrawer} from '../ChatComposerDrawer.js';
import {Chip} from '../../Chip/Chip.js';
import {Stack} from '../../Stack/Stack.js';
import {Thumbnail} from '../../Thumbnail/Thumbnail.js';

const IMAGE_ATTACHMENTS = [
  {
    id: '1',
    src: '/template-assets/illustrative-vertical-1.png',
    alt: 'River through a valley',
    label: 'valley.jpg',
  },
  {
    id: '2',
    src: '/template-assets/illustrative-vertical-2.png',
    alt: 'Foggy mountain peak',
    label: 'mountain.jpg',
  },
  {
    id: '3',
    src: '/template-assets/illustrative-vertical-3.png',
    alt: 'Golden retriever puppy',
    label: 'puppy.jpg',
  },
  {
    id: '4',
    src: '/template-assets/illustrative-vertical-4.png',
    alt: 'Bridge at sunset',
    label: 'bridge.jpg',
  },
  {
    id: '5',
    src: '/template-assets/illustrative-vertical-5.png',
    alt: 'Lakeside at dusk',
    label: 'lakeside.jpg',
  },
];

export function ChatComposerDrawerAttachments() {
  return (
    <Stack direction="vertical" gap={4} width={450} maxWidth="100%">
      <ChatComposer
        onSubmit={() => {}}
        drawer={
          <ChatComposerDrawer>
            <Stack direction="vertical" gap={2} width="100%">
              <Carousel gap={1}>
                {IMAGE_ATTACHMENTS.map(img => (
                  <Thumbnail
                    key={img.id}
                    src={img.src}
                    alt={img.alt}
                    label={img.label}
                    onRemove={() => {}}
                  />
                ))}
              </Carousel>
              <Stack direction="horizontal" gap={1} wrap="wrap">
                <Chip label="quarterly-report.pdf" onRemove={() => {}} />
                <Chip label="budget-forecast.xlsx" onRemove={() => {}} />
              </Stack>
            </Stack>
          </ChatComposerDrawer>
        }
      />
    </Stack>
  );
}
