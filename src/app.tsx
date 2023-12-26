/*
 * @Author: 刘利军
 * @Date: 2023-12-23 02:14:03
 * @LastEditors: 刘利军
 * @LastEditTime: 2023-12-26 23:06:25
 * @Description:
 * @PageName:
 */
// 运行时配置

import { AvatarDropdown, AvatarName } from '@/components';
import { getRoleMenus } from '@/services/menuManaget';
import { getMyProfile } from '@/services/user';
import { loginPath } from '@/utils';
import type { Settings as LayoutSettings } from '@ant-design/pro-components';
import { IRoute, RunTimeLayoutConfig, history } from '@umijs/max';
import defaultSettings from '../config/defaultSettings';
import { errorConfig } from './requestErrorConfig';

export type InitialStateType = {
  settings?: Partial<LayoutSettings>;
  currentUser?: API.CurrentUser;
  fetchUserInfo?: () => Promise<API.CurrentUser | undefined>;
  menuData?: IRoute[];
  fetchMenuData?: () => Promise<IRoute[] | undefined>;
  location: { hash: string; key: string; pathname: string; search: string };
};

export async function getInitialState(): Promise<InitialStateType> {
  const fetchUserInfo = async () => {
    try {
      const res = await getMyProfile();
      return res.data;
    } catch (error) {
      history.push(loginPath);
    }
    return undefined;
  };

  const fetchMenuData = async () => {
    try {
      const menus = await getRoleMenus();
      return menus;
    } catch (error) {
      history.push('/user/login');
    }
    return undefined;
  };

  // 如果不是登录页面，执行
  const { location } = history;
  if (location.pathname !== loginPath) {
    const currentUser = await fetchUserInfo();
    const menuData = await fetchMenuData();

    return {
      fetchUserInfo,
      currentUser,
      fetchMenuData,
      menuData,
      location,
      settings: defaultSettings as Partial<LayoutSettings>,
    };
  }

  return {
    location,
    settings: defaultSettings as Partial<LayoutSettings>,
    fetchUserInfo,
    fetchMenuData,
  };
}

export const layout: RunTimeLayoutConfig = ({ initialState }) => {
  return {
    logo: 'https://img.alicdn.com/tfs/TB1YHEpwUT1gK0jSZFhXXaAtVXa-28-27.svg',
    avatarProps: {
      src: 'https://gw.alipayobjects.com/zos/antfincdn/XAosXuNZyF/BiazfanxmamNRoxxVxka.png',
      title: <AvatarName />,
      render: (_, avatarChildren) => {
        return <AvatarDropdown>{avatarChildren}</AvatarDropdown>;
      },
    },
    menu: {
      locale: false,
    },
    menuDataRender: (menuData) => {
      let mData = [...menuData];
      if (initialState?.menuData && initialState?.menuData.length > 0) {
        mData = [...menuData, ...initialState?.menuData];
      }
      return mData;
    },
    onPageChange: () => {
      const { location } = history;
      // 如果没有登录，重定向到 login
      if (!initialState?.currentUser && location.pathname !== loginPath) {
        history.push(loginPath);
      }
    },
    ...initialState?.settings,
  };
};

export const request = {
  ...errorConfig,
};
