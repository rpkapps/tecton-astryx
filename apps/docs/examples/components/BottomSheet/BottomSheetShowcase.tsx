'use client';

import {useState} from 'react';
import {BottomSheet} from '@tecton/react/BottomSheet';
import {Button} from '@tecton/react/Button';
import {CheckboxInput} from '@tecton/react/CheckboxInput';
import {Divider} from '@tecton/react/Divider';
import {Heading} from '@tecton/react/Heading';
import {Section} from '@tecton/react/Section';
import {VStack} from '@tecton/react/Stack';

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
              <CheckboxInput
                label="In stock"
                value={inStock}
                onChange={setInStock}
              />
              <CheckboxInput
                label="On sale"
                value={onSale}
                onChange={setOnSale}
              />
              <CheckboxInput
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
