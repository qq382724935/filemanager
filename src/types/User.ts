/*
 * @Author: 刘利军
 * @Date: 2023-12-23 01:13:49
 * @LastEditors: 刘利军
 * @LastEditTime: 2023-12-23 01:13:52
 * @Description:
 * @PageName:
 */

export enum Status {
  ACTIVE = 'ACTIVE',
  DISABLE = 'DISABLE',
}

export interface User {
  id: string;
  name: string;
  password: string;
  createDate: number;
  updateDate: number;
  status: Status;
}
