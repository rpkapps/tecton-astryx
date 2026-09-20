import {Step} from '../Step.js';
import {Stepper} from '../../Stepper/Stepper.js';
import {Text} from '../../Text/Text.js';

export function StepStates() {
  // A Step holds no state of its own — it compares its `step` index against the
  // Stepper's `activeStep`. Each state below is therefore one Step in its own
  // Stepper, with activeStep placed on one side of it or the other.
  return (
    <div style={{display: 'flex', flexWrap: 'wrap', gap: 32}}>
      <div style={{width: 220}}>
        <Text variant="smallStrong">Completed</Text>
        <Stepper activeStep={1} orientation="vertical">
          <Step step={0} label="Verify email" />
        </Stepper>
      </div>
      <div style={{width: 220}}>
        <Text variant="smallStrong">Current</Text>
        <Stepper activeStep={0} orientation="vertical">
          <Step step={0} label="Verify email" />
        </Stepper>
      </div>
      <div style={{width: 220}}>
        <Text variant="smallStrong">Upcoming</Text>
        <Stepper activeStep={0} orientation="vertical">
          <Step step={1} label="Add a payment method" />
        </Stepper>
      </div>
      <div style={{width: 220}}>
        <Text variant="smallStrong">Disabled</Text>
        <Stepper activeStep={0} orientation="vertical" onStepClick={() => {}}>
          <Step step={1} label="Add a payment method" isDisabled />
        </Stepper>
      </div>
      <div style={{width: 220}}>
        <Text variant="smallStrong">Completed, with a status</Text>
        <Stepper activeStep={1} orientation="vertical">
          <Step step={0} label="Verify email" status="warning" />
        </Stepper>
      </div>
    </div>
  );
}
