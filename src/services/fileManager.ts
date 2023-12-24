/*
 * @Author: 刘利军
 * @Date: 2023-12-24 10:49:05
 * @LastEditors: 刘利军
 * @LastEditTime: 2023-12-24 22:19:27
 * @Description:
 * @PageName:
 */
import { API_PROXY, Other_base } from '@/utils';
import { request } from '@umijs/max';
import { UploadFile } from 'antd';
import { RcFile } from 'antd/es/upload';

export interface FileItemType {
  id: string;
  fileName: string;
  filePath: string;
  fileSize: number;
  uploadDate: string;
  userId: string;
  userName: string;
  extName: string;
  type: number;
  pid: string;
  createDate: string;
  icon: string;
  buttonList: Array<string> | null;
}

export async function getFiles(id: string) {
  return request<API.Result & { data: FileItemType[] }>(
    `${API_PROXY}/file/find/file/list/by/directory/${id}`,
    { method: 'GET' },
  );
}

export async function addFile(data: {
  pid: string;
  extName: string;
  name: string;
  icon: string;
}) {
  return request<API.Result>(`${API_PROXY}/file/create/directory`, {
    method: 'POST',
    data,
  });
}

// 修改
export async function updateFile(data: { pid: string; fileName: string }) {
  return request<API.Result>(`${API_PROXY}/file/update/directory/name`, {
    method: 'POST',
    data,
  });
}

// 修改
export async function uploadFile(fileList: UploadFile[], id: string) {
  const formData = new FormData();
  fileList.forEach((file) => {
    formData.append('file', file as RcFile);
  });
  formData.append('id', id);
  formData.append('icon', Other_base);

  return request<API.Result>(`${API_PROXY}/file/upload/file`, {
    method: 'POST',

    // headers: {
    //   "Accept":
    //   'Content-Type': 'form-data',
    // },
    data: formData,
  });
}

export async function delFile(id: string) {
  return request<API.Result>(`${API_PROXY}/file/delete/${id}`, {
    method: 'DELETE',
  });
}

// 获取文件夹菜单集合
export async function getFileRoleMenu() {
  return request<API.Result & { data: FileItemType[] }>(
    `${API_PROXY}/file/find/menu/permission/list`,
    { method: 'GET' },
  );
}

// 获取一级目录下的子目录，不做权限控制
export async function getFileNoRoleMenu(id: string) {
  return request<API.Result & { data: FileItemType[] }>(
    `${API_PROXY}/file/find/file/list/no/permisson/by/directory/${id}`,
    { method: 'GET' },
  );
}

// 给文件做绑定权限
export async function addUserFile(id: string) {
  return request<API.Result & { data: FileItemType[] }>(
    `${API_PROXY}/file/bind/user/file`,
    { method: 'GET' },
  );
}
