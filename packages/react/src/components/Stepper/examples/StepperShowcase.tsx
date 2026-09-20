import {useState} from 'react';
import {Step} from '../../Step/Step.js';
import {Stepper} from '../Stepper.js';

export function StepperShowcase() {
  const [active, setActive] = useState(2);
  return (
    <div style={{width: '100%', maxWidth: 640}}>
      <Stepper
        activeStep={active}
        orientation="horizontal"
        onStepClick={setActive}
      >
        <Step step={0} label="Cart" />
        <Step step={1} label="Shipping" />
        <Step step={2} label="Payment" />
        <Step step={3} label="Review" />
        <Step step={4} label="Confirm" />
      </Stepper>
    </div>
  );
}
