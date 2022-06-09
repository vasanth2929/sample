import { get, post } from '../service';

export function getAllMediaFiles() {
    return get('files/videoguide/getall');
}
