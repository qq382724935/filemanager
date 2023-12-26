/*
 * @Author: 刘利军
 * @Date: 2020-09-04 09:25:11
 * @LastEditors: 刘利军
 * @LastEditTime: 2023-12-26 22:51:40
 * @Description:
 */

export default [
  {
    path: '/',
    redirect: '/home',
  },
  {
    path: '/login',
    layout: false,
    component: './Login',
    name: '登录页',
  },
  {
    path: '/home',
    name: '主页',
    component: './Home',
  },
  {
    path: '/file',
    hideInMenu: true,
    access: 'canFile',
    routes: [
      {
        path: '/file/:id',
        component: './FileManager',
        access: 'canFileId',
      },
    ],
  },
  {
    path: '/role',
    name: '角色管理',
    component: './RoleManager',
    hideInMenu: true,
    access: 'canAdmin',
  },
  {
    path: '/menu',
    name: '菜单管理',
    component: './MenuManager',
    hideInMenu: true,
    access: 'canAdmin',
  },
  {
    path: '/user',
    name: '用户管理',
    component: './UserManager',
    hideInMenu: true,
    access: 'canAdmin',
  },
  {
    path: '/*',
    component: './404',
  },
];
