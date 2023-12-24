/*
 * @Author: 刘利军
 * @Date: 2023-12-23 10:51:46
 * @LastEditors: 刘利军
 * @LastEditTime: 2023-12-24 19:38:36
 * @Description:
 * @PageName:
 */
import { RoleDataType, RoleType } from '@/types';
import { API_PROXY } from '@/utils';
import { ParamsType } from '@ant-design/pro-components';
import { request } from '@umijs/max';
import React from 'react';

export async function getRoles({ pageSize, current, ...params }: ParamsType) {
  return await request<API.ResultArray<RoleDataType>>(
    `${API_PROXY}/role/find/list`,
    {
      method: 'GET',
      params: {
        page: current,
        size: pageSize,
        ...params,
      },
    },
  );
}

export async function addRole(data: RoleType) {
  return request<API.ResultArray<RoleDataType>>(`${API_PROXY}/role/create`, {
    method: 'POST',
    data,
  });
}

export async function updateRole(data: RoleDataType) {
  return request<API.ResultArray<RoleDataType>>(`${API_PROXY}/role/update`, {
    method: 'POST',
    data,
  });
}

export async function delRole(id: string) {
  return request<API.Result>(`${API_PROXY}/role/delete/${id}`, {
    method: 'DELETE',
  });
}

export async function bindUser(roleId: string, userIdList: React.Key[]) {
  return request<API.Result>(`${API_PROXY}/role/bind/user`, {
    method: 'POST',
    data: { roleId, userIdList },
  });
}

export async function bindPermission(
  roleId: string,
  permissionIdList: React.Key[],
) {
  return request<API.Result>(`${API_PROXY}/role/bind/permission`, {
    method: 'POST',
    data: { roleId, permissionIdList },
  });
}
