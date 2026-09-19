import '@testing-library/jest-dom/vitest';
import {afterEach} from 'vitest';
import {cleanup} from '@testing-library/react';

// Vitest runs without globals here, so Testing Library's automatic cleanup
// never registers itself — unmount between tests explicitly.
afterEach(cleanup);
