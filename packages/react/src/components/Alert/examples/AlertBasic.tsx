import {Alert} from '../Alert.js';

export function AlertBasic() {
  return (
    <Alert
      status="warning"
      title="The velocity model is out of date"
      description="It was built before the last two wells were tied in. Rebuild it before depth-converting."
    />
  );
}
