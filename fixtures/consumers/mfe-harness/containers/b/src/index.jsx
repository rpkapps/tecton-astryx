import {createContainerApi} from '../../shared/entry.jsx';

export const api = createContainerApi({id: 'b', version: '0.2.0'});
export const mount = api.mount;
export const unmount = api.unmount;
export default api;
