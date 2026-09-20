import {createContainerApi} from '../../shared/entry.jsx';

export const api = createContainerApi({id: 'a', version: '0.1.0'});
export const mount = api.mount;
export const unmount = api.unmount;
export default api;
