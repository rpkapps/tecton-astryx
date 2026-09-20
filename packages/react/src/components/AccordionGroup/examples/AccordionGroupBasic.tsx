import {Accordion} from '../../Accordion/Accordion.js';
import {AccordionGroup} from '../AccordionGroup.js';

export function AccordionGroupBasic() {
  return (
    <AccordionGroup type="single" defaultValue="geology" hasDividers>
      <Accordion value="geology" title="Geology">
        Horizons, faults and the velocity model.
      </Accordion>
      <Accordion value="drilling" title="Drilling">
        Trajectory, casing and the bit programme.
      </Accordion>
      <Accordion value="economics" title="Economics">
        Capital expenditure, net present value and the breakeven price.
      </Accordion>
    </AccordionGroup>
  );
}
