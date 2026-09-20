import {AspectRatio} from '../AspectRatio.js';
import {Center} from '../../Center/Center.js';

export function AspectRatioWidescreen() {
  return (
    <Center width={600}>
      <AspectRatio ratio={16 / 9} fit="cover">
        <img
          src="/template-assets/light-scene-horizontal-1.png"
          alt="16:9 widescreen"
        />
      </AspectRatio>
    </Center>
  );
}
