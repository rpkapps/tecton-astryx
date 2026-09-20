import {Alert} from '../Alert.js';

export function AlertFloating() {
  return (
    <Alert
      status="info"
      title="You have unsaved changes"
      description="A raised banner reads as an overlay floating above the page."
    />
  );
}
