/*
 * @Author: 刘利军
 * @Date: 2021-01-05 12:02:13
 * @LastEditors: 刘利军
 * @LastEditTime: 2023-12-23 14:21:35
 * @Description:
 * @PageName:
 */
// 唯一KEY
export const KEYS = {
  token: 'token',
};

// sessionStorage封
export const setSession = (key: string, data: any) => {
  sessionStorage.setItem(key, JSON.stringify(data));
};

export const getSession = (key: string): any => {
  return JSON.parse(sessionStorage.getItem(key) || '');
};

export const removeSession = (key: string): any => {
  sessionStorage.removeItem(key);
};
export const formErrorMessage = (msg: string) => Promise.reject(new Error(msg));
