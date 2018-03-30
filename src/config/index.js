import env from './env';
import menus from './menus';

/**
 * 环境
 */
export {env};
/**
 * 项目名称
 * @type {string}
 */
export const name = '违法拍照管理台';
/**
 * 请求基础url
 * @type {string}
 */
export const baseURL = env !== 'production' ? '' : '';
/**
 * 菜单
 */
export {menus};