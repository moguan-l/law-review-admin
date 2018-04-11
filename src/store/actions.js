import auth from '../assets/js/auth';
import * as setting from '../service/setting';
import {menus} from '../config';

export const getMenus = ({commit}) => {
    commit('MENUS', menus)
};
export const getResources = ({commit}) => {
    setting.getResources({type: 2, uid: auth.get().userId})
        .then(res => {
            if (res.ret) {
                commit('RESOURCES', res.data)
            }
        })
};