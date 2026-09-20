import {CodeBlock} from '../CodeBlock.js';

const code = `{
  "name": "@tecton/react",
  "version": "0.0.5",
  "dependencies": {
    "@tecton/react": "^0.1.0",
    "react": "^19.0.0"
  },
  "scripts": {
    "build": "tsup",
    "test": "vitest"
  }
}`;

export function CodeBlockJSONConfig() {
  return (
    <CodeBlock
      code={code}
      language="json"
      title="package.json"
      hasLineNumbers
    />
  );
}
