/*
 * @Author: 刘利军
 * @Date: 2023-12-23 10:51:46
 * @LastEditors: 刘利军
 * @LastEditTime: 2023-12-24 21:21:33
 * @Description:
 * @PageName:
 */
import { API_PROXY } from '@/utils';
import { ParamsType } from '@ant-design/pro-components';
import { IRoute, request } from '@umijs/max';

export interface MenuType {
  id: string;
  path: string;
  name: string;
  component: string;
  redirect: string;
  title: string;
  code: string;
  icon: string;
  pid: string;
  type: string;
}

export interface TreeMenuType extends MenuType {
  children: TreeMenuType[];
}

export async function getMenus({ pageSize, current, ...params }: ParamsType) {
  return await request<API.ResultArray<MenuType>>(
    `${API_PROXY}/permission/find/list`,
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

export async function getTreeMenus(level?: number) {
  return await request<API.Result & { data: TreeMenuType[] }>(
    `${API_PROXY}/permission/find/tree/list`,
    {
      method: 'GET',
      params: { level },
    },
  );
}

export async function addMenu(data: MenuType) {
  return request<API.ResultArray<MenuType>>(`${API_PROXY}/permission/create`, {
    method: 'POST',
    data,
  });
}

export async function updateMenu(data: MenuType) {
  return request<API.ResultArray<MenuType>>(`${API_PROXY}/permission/update`, {
    method: 'POST',
    data,
  });
}

export async function delMenu(id: string) {
  return request<API.Result>(`${API_PROXY}/permission/delete/${id}`, {
    method: 'DELETE',
  });
}

// 递归修改成IRoute格式参数名字
const paramsName = (iRoute: TreeMenuType): IRoute => {
  const defaulte = {
    name: iRoute.name,
    path:
      iRoute.type.toString() === '2'
        ? `${iRoute.path}/${iRoute.id}`
        : iRoute.path,
    key: iRoute.id,
    routes: iRoute.children,
    absPath: '',
    id: iRoute.id,
  };

  if (iRoute.children && iRoute.children.length > 0) {
    const routes = iRoute.children.map((item) => {
      return paramsName(item);
    });
    return { ...defaulte, routes };
  }
  return defaulte;
};

export async function getRoleMenus() {
  return request<API.Result & { data: any[] }>(
    `${API_PROXY}/permission/find/tree/list/by/user`,
    { method: 'GET' },
  )
    .then((res) => {
      if (res.data.length > 0) {
        const menu: IRoute[] = res?.data.map((item) => paramsName(item));
        return menu;
      }
      return [];
    })
    .catch(() => []);
}
