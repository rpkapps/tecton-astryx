import {Progress} from '../Progress.js';

export function ProgressWithValueLabel() {
  return <Progress value={75} label="Storage used" hasValueLabel />;
}
