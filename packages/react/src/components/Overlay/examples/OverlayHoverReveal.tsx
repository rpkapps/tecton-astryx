import type {CSSProperties} from 'react';
import {AspectRatio} from '../../AspectRatio/AspectRatio.js';
import {Button} from '../../Button/Button.js';
import {Overlay} from '../Overlay.js';

const frame: CSSProperties = {
  width: 420,
  maxWidth: '100%',
  borderRadius: 12,
  overflow: 'clip',
};

const image: CSSProperties = {
  width: '100%',
  height: '100%',
  objectFit: 'cover',
};

export function OverlayHoverReveal() {
  return (
    <Overlay
      showOn="hover"
      align="center"
      content={<Button label="Quick view" variant="secondary" size="sm" />}
    >
      <AspectRatio ratio={16 / 9} style={frame}>
        <img
          src="/template-assets/light-working-horizontal-1.png"
          alt="Workspace preview"
          style={image}
        />
      </AspectRatio>
    </Overlay>
  );
}
