import {useState} from 'react';
import {Icon} from '../../Icon/Icon.js';
import {Step} from '../../Step/Step.js';
import {Stepper} from '../Stepper.js';
import {Text} from '../../Text/Text.js';

export function StepperIndicatorModes() {
  const [active, setActive] = useState(2);
  return (
    <div style={{display: 'flex', gap: 48, flexWrap: 'wrap'}}>
      <div style={{maxWidth: 220}}>
        <Text variant="smallStrong">None</Text>
        <Stepper
          activeStep={active}
          orientation="vertical"
          onStepClick={setActive}
        >
          <Step step={0} label="Account" indicator="none" />
          <Step step={1} label="Profile" indicator="none" />
          <Step step={2} label="Settings" indicator="none" />
          <Step step={3} label="Review" indicator="none" />
        </Stepper>
      </div>
      <div style={{maxWidth: 220}}>
        <Text variant="smallStrong">Auto</Text>
        <Stepper
          activeStep={active}
          orientation="vertical"
          onStepClick={setActive}
        >
          <Step step={0} label="Account" />
          <Step step={1} label="Profile" />
          <Step step={2} label="Settings" />
          <Step step={3} label="Review" />
        </Stepper>
      </div>
      <div style={{maxWidth: 220}}>
        <Text variant="smallStrong">Number</Text>
        <Stepper
          activeStep={active}
          orientation="vertical"
          onStepClick={setActive}
        >
          <Step step={0} label="Account" indicator="number" />
          <Step step={1} label="Profile" indicator="number" />
          <Step step={2} label="Settings" indicator="number" />
          <Step step={3} label="Review" indicator="number" />
        </Stepper>
      </div>
      <div style={{maxWidth: 220}}>
        <Text variant="smallStrong">Custom icon</Text>
        <Stepper
          activeStep={active}
          orientation="vertical"
          onStepClick={setActive}
        >
          <Step
            step={0}
            label="Account"
            indicator={<Icon name="info" size={16} />}
          />
          <Step
            step={1}
            label="Profile"
            indicator={<Icon name="search" size={16} />}
          />
          <Step
            step={2}
            label="Settings"
            indicator={<Icon name="diamond-mark" size={16} />}
          />
          <Step
            step={3}
            label="Review"
            indicator={<Icon name="check" size={16} />}
          />
        </Stepper>
      </div>
    </div>
  );
}
