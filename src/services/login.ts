/*
 * @Author: 刘利军
 * @Date: 2020-10-23 16:53:40
 * @LastEditors: 刘利军
 * @LastEditTime: 2023-12-24 19:37:21
 * @Description:
 */
import { API_PROXY } from '@/utils';
import { request } from 'umi';

type LoginData = {
  data: any;
};
export async function login(params: API.LoginParamsType) {
  return request<API.Result & LoginData>(`${API_PROXY}/a/v1/pub/login`, {
    method: 'POST',
    data: params,
  });
}

export async function unLogin() {
  return request<API.Result>(`${API_PROXY}/a/v1/pri/logout`, {
    method: 'DELETE',
  });
}
