/*
 * @Author: 刘利军
 * @Date: 2023-12-23 02:14:03
 * @LastEditors: 刘利军
 * @LastEditTime: 2023-12-27 22:15:28
 * @Description:
 * @PageName:
 */

import { InitialStateType } from './app';

export default (initialState: InitialStateType) => {
  let canAdmin = false;
  if (initialState.currentUser?.roleCodeList) {
    canAdmin = initialState.currentUser?.roleCodeList.indexOf('admin') > -1;
  }
  // let canFile = false;
  // let canFileId = false;
  // if (initialState.menuData && initialState.menuData.length > 0) {
  //   canFile = initialState.menuData.some((item) => {
  //     if (item.path === '/file') {
  //       if (item.routes && item.routes.length > 0) {
  //         canFileId = item.routes.some(
  //           (route: IRoute) => route.path === initialState.location.pathname,
  //         );
  //       }
  //       return true;
  //     }
  //     return false;
  //   });
  // }
  // console.log('canFile', canFile);
  // console.log('canFileId', canFileId);
  return {
    canAdmin,
    // canFile,
    // canFileId,
  };
};
