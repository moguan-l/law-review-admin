import {name} from '../../config';

export const title = (title = name) => {
    window.document.title = title;
};