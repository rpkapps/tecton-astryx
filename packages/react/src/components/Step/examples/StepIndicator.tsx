import {Icon} from '../../Icon/Icon.js';
import {Progress} from '../../Progress/Progress.js';
import {Step} from '../Step.js';
import {Stepper} from '../../Stepper/Stepper.js';
import {Text} from '../../Text/Text.js';

export function StepIndicator() {
  // The first four steps are all completed — same progress, so the indicator
  // prop is the only difference between them. `auto` is the one that reacts to
  // progress: a numbered badge until the step is reached, then a check. The
  // last step is in progress instead, because the node it passes to `indicator`
  // is a spinner and a spinner only makes sense on work that is running.
  return (
    <div style={{display: 'flex', flexWrap: 'wrap', gap: 24}}>
      <div style={{width: 190}}>
        <Text variant="smallStrong">auto (default)</Text>
        <Stepper activeStep={1} orientation="vertical">
          <Step step={0} label="Verify email" />
        </Stepper>
      </div>
      <div style={{width: 190}}>
        <Text variant="smallStrong">number</Text>
        <Stepper activeStep={1} orientation="vertical">
          <Step step={0} label="Verify email" indicator="number" />
        </Stepper>
      </div>
      <div style={{width: 190}}>
        <Text variant="smallStrong">Custom node</Text>
        <Stepper activeStep={1} orientation="vertical">
          <Step
            step={0}
            label="Verify email"
            indicator={<Icon name="diamond-mark" size={16} />}
          />
        </Stepper>
      </div>
      <div style={{width: 190}}>
        <Text variant="smallStrong">none</Text>
        <Stepper activeStep={1} orientation="vertical">
          <Step step={0} label="Verify email" indicator="none" />
        </Stepper>
      </div>
      <div style={{width: 190}}>
        <Text variant="smallStrong">Spinner (in progress)</Text>
        <Stepper activeStep={0} orientation="vertical">
          <Step
            step={0}
            label="Verify email"
            // `inherit` picks up the indicator's own tint, so the spinner is
            // colored by the step's progress and status like any other glyph.
            indicator={<Progress size="md" shade="inherit" />}
          />
        </Stepper>
      </div>
    </div>
  );
}
