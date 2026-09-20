import {useState} from 'react';
import {Button} from '../../Button/Button.js';
import {Lightbox} from '../Lightbox.js';

export function LightboxVideo() {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <>
      <Button label="Play video" onClick={() => setIsOpen(true)} />
      <Lightbox
        isOpen={isOpen}
        onOpenChange={setIsOpen}
        media={{
          src: '/template-assets/Nature-1.mp4',
          alt: 'Flower blooming in time-lapse',
          type: 'video',
          caption: 'A flower blooming in time-lapse',
        }}
      />
    </>
  );
}
