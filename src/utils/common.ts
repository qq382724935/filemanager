import { Status } from '@/types';
import { ProSchemaValueEnumObj } from '@ant-design/pro-components';

export const MenuTypeEnum: ProSchemaValueEnumObj = {
  1: { text: '菜单', status: '1' },
  2: { text: '特殊菜单', status: '2' },
  3: { text: '按钮', status: '3' },
};

export const StatusEnum: ProSchemaValueEnumObj = {
  [Status.ACTIVE]: { text: '启用', status: Status.ACTIVE },
  [Status.DISABLE]: { text: '禁用', status: Status.DISABLE },
};

export const loginPath = '/login';

export const API_PROXY = '/api';
