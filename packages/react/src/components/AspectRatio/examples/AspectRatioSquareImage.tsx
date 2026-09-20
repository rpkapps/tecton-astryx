import {AspectRatio} from '../AspectRatio.js';
import {Center} from '../../Center/Center.js';

export function AspectRatioSquareImage() {
  return (
    <Center width={300}>
      <AspectRatio ratio={1} fit="cover">
        <img src="/template-assets/light-home-square-1.png" alt="1:1 square" />
      </AspectRatio>
    </Center>
  );
}
