import {useState} from 'react';
import {BottomSheet} from '../BottomSheet.js';
import {Button} from '../../Button/Button.js';
import {Checkbox} from '../../Checkbox/Checkbox.js';
import {Divider} from '../../Divider/Divider.js';
import {Heading} from '../../Heading/Heading.js';
import {Section} from '../../Section/Section.js';
import {VStack} from '../../VStack/VStack.js';

export function BottomSheetShowcase() {
  const [isOpen, setIsOpen] = useState(false);
  const [inStock, setInStock] = useState(false);
  const [onSale, setOnSale] = useState(false);
  const [freeShipping, setFreeShipping] = useState(false);

  return (
    <>
      <Button label="Open sheet" onClick={() => setIsOpen(true)} />
      <BottomSheet isOpen={isOpen} onOpenChange={setIsOpen} label="Filters">
        <Section padding={4}>
          <VStack gap={4}>
            <Heading level={3}>Filters</Heading>
            <Divider />
            <VStack gap={2}>
              <Checkbox
                label="In stock"
                value={inStock}
                onChange={setInStock}
              />
              <Checkbox label="On sale" value={onSale} onChange={setOnSale} />
              <Checkbox
                label="Free shipping"
                value={freeShipping}
                onChange={setFreeShipping}
              />
            </VStack>
            <Button label="Apply" onClick={() => setIsOpen(false)} />
          </VStack>
        </Section>
      </BottomSheet>
    </>
  );
}
