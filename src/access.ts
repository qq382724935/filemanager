import { InitialStateType } from './app';

/*
 * @Author: 刘利军
 * @Date: 2023-12-23 02:14:03
 * @LastEditors: 刘利军
 * @LastEditTime: 2023-12-26 22:42:41
 * @Description:
 * @PageName:
 */
export default (initialState: InitialStateType) => {
  let canAdmin = false;
  if (initialState.currentUser?.roleCodeList) {
    canAdmin = initialState.currentUser?.roleCodeList.indexOf('admin') > -1;
  }
  return {
    canAdmin,
  };
};
