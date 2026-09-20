/**
 * Container a's bundle entry.
 *
 * The version it reports is read out of the package manifest it actually
 * resolved, so the page cannot claim a version it did not install.
 */
import manifest from '@tecton/react/package.json';
import {createContainerApi} from '../../shared/entry.jsx';

export const api = createContainerApi({id: 'a', version: manifest.version});
export const mount = api.mount;
export const unmount = api.unmount;
export default api;
