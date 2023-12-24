/*
 * @Author: 刘利军
 * @Date: 2021-04-03 17:09:45
 * @LastEditors: 刘利军
 * @LastEditTime: 2023-12-24 19:38:54
 * @Description:
 * @PageName:
 */
import { User } from '@/types';
import { API_PROXY } from '@/utils';
import { request } from 'umi';

export async function getMyProfile() {
  return request<API.Result & { data: API.CurrentUser }>(
    `${API_PROXY}/a/v1/pri/profile`,
    {
      method: 'GET',
    },
  );
}

export async function getUsers() {
  return request<API.Result & { data: User[] }>(`${API_PROXY}/a/v1/pri/user`, {
    method: 'GET',
  });
}

export async function addUser(data: User) {
  return request<API.ResultObject<User>>(`${API_PROXY}/a/v1/pri/user`, {
    method: 'POST',
    data,
  });
}

export async function updateUser(id: string, data: User) {
  return request<API.ResultObject<User>>(`${API_PROXY}/a/v1/pri/user/${id}`, {
    method: 'PATCH',
    data,
  });
}

export async function delUser(id: string) {
  return request<API.Result>(`${API_PROXY}/a/v1/pri/user/${id}`, {
    method: 'DELETE',
  });
}
