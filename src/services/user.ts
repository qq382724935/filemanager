/*
 * @Author: 刘利军
 * @Date: 2021-04-03 17:09:45
 * @LastEditors: 刘利军
 * @LastEditTime: 2023-12-25 22:37:50
 * @Description:
 * @PageName:
 */
import { User } from '@/types';
import { API_PROXY } from '@/utils';
import { request } from 'umi';
import { FileItemType } from './fileManager';

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

export type UserFileRoleListItem = {
  fileId: string;
  buttonList: string[];
};
// 根据用户id查询文件权限
export async function getUserFileRoleList(id: string) {
  return request<API.Result & { data: UserFileRoleListItem[] }>(
    `${API_PROXY}/file/find/file/permission/list/by/user/${id}`,
    {
      method: 'GET',
    },
  );
}

// 给文件做绑定权限
export async function addUserBindFileRole(
  userId: string,
  filePermissionList: UserFileRoleListItem[],
) {
  return request<API.Result & { data: FileItemType[] }>(
    `${API_PROXY}/file/bind/user/file`,
    {
      method: 'POST',
      data: { userId, filePermissionList },
    },
  );
}
