/*
 * @Author: 刘利军
 * @Date: 2020-10-23 16:53:40
 * @LastEditors: 刘利军
 * @LastEditTime: 2023-12-23 15:06:17
 * @Description:
 */

declare namespace API {
  export type Token = {
    isLogin: boolean;
    loginDevice: string;
    loginId: string;
    loginType: string;
    sessionTimeout: number;
    tag: string;
    tokenActiveTimeout: number;
    tokenName: string;
    tokenSessionTimeout: number;
    tokenTimeout: number;
    tokenValue: string;
  };
  export type CurrentUser = {
    createDate: number;
    id: string;
    name: string;
    password: string;
    status: string;
    updateDate: number;
  };
  export type Result = {
    msg?: string;
    code?: number;
    pagination?: {
      pageSize?: number;
      current?: number;
      total?: number;
    };
  };

  interface ResultArray<T> extends Result {
    data: {
      list: T[];
      page: number;
      size: number;
      totalElement: number;
      totalPage: number;
    };
  }

  interface ResultObject<T> extends Result {
    data: T;
  }

  export type LoginParamsType = {
    name: string;
    password: string;
    status: string;
  };
}
