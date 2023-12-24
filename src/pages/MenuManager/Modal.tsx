/*
 * @Author: 刘利军
 * @Date: 2023-12-21 10:11:42
 * @LastEditors: 刘利军
 * @LastEditTime: 2023-12-23 14:02:15
 * @Description:
 * @PageName:
 */
import { message } from 'antd';
import React from 'react';

import {
  MenuType,
  addMenu,
  getMenus,
  updateMenu,
} from '@/services/menuManaget';
import { MenuTypeEnum } from '@/utils';
import {
  ModalForm,
  ModalFormProps,
  ProFormSelect,
  ProFormText,
} from '@ant-design/pro-components';

interface ModalProps extends ModalFormProps<MenuType> {
  data?: MenuType;
  onOk?: () => void;
  child?: boolean;
}

const MenuModal: React.FC<ModalProps> = ({
  data,
  child = false,
  onOk = () => {},
  ...props
}) => {
  return (
    <ModalForm<MenuType>
      title={data ? '编辑' : '新建'}
      autoFocusFirstInput
      modalProps={{
        destroyOnClose: true,
      }}
      submitTimeout={2000}
      initialValues={
        child ? { pid: data?.id } : { ...data, type: data?.type.toString() }
      }
      onFinish={async (values) => {
        let res: API.Result;
        // 编辑
        if (data && !child) {
          res = await updateMenu({ ...data, ...values });
        } else {
          res = await addMenu(values);
        }
        if (res.code === 200 || res.code === 0) {
          onOk();
        } else {
          message.error(res.msg);
        }
        return true;
      }}
      {...props}
    >
      <ProFormText
        width="md"
        name="name"
        label="菜单名称"
        rules={[{ required: true, message: '菜单名称不能为空' }]}
      />

      <ProFormText
        width="md"
        name="path"
        label="路径"
        rules={[{ required: true, message: '路径不能为空' }]}
      />

      <ProFormSelect
        name="pid"
        width="md"
        label="上级菜单"
        disabled={child}
        rules={[{ required: true, message: '上级菜单不能为空' }]}
        request={async () => {
          const res = await getMenus({
            page: 1,
            size: 99999,
          });
          return [
            {
              label: '无',
              value: '0',
            },
            ...res.data.list.map((item) => ({
              label: item.name,
              value: item.id,
            })),
          ];
        }}
      />

      <ProFormSelect
        name="type"
        width="md"
        label="菜单类型"
        rules={[{ required: true, message: '菜单类型不能为空' }]}
        valueEnum={MenuTypeEnum}
      />

      <ProFormText
        name="code"
        width="md"
        label="权限码"
        rules={[{ required: true, message: '权限码不能为空' }]}
      />

      {/* <ProFormSegmented
        rules={[{ required: true, message: '状态不能为空' }]}
        name="status"
        label="状态"
        request={async () => [
          { label: '启用', value: Status.ACTIVE },
          { label: '禁用', value: Status.DISABLE },
        ]}
      /> */}
    </ModalForm>
  );
};

export default MenuModal;
