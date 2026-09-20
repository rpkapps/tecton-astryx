import {Button} from '../../Button/Button.js';
import {Step} from '../Step.js';
import {Stepper} from '../../Stepper/Stepper.js';
import {TextField} from '../../TextField/TextField.js';

export function StepContent() {
  // Anything passed as children renders below the description, indented to line
  // up with the label rather than the indicator. In a full flow you would gate
  // this on the step being active; here it is a single Step so the slot is
  // always shown.
  return (
    <div style={{width: 400}}>
      <Stepper activeStep={1} orientation="vertical">
        <Step
          step={1}
          label="Billing address"
          description="Used for invoices and tax calculation"
        >
          <div style={{display: 'flex', flexDirection: 'column', gap: 12}}>
            <TextField label="Street" placeholder="1 Hacker Way" value="" />
            <TextField label="City" placeholder="Menlo Park" value="" />
            <div>
              <Button label="Save address" variant="primary" />
            </div>
          </div>
        </Step>
      </Stepper>
    </div>
  );
}
