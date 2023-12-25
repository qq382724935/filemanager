/*
 * @Author: 刘利军
 * @Date: 2023-12-21 10:11:42
 * @LastEditors: 刘利军
 * @LastEditTime: 2023-12-25 00:45:27
 * @Description:
 * @PageName:
 */
import { message } from 'antd';
import React, { useRef, useState } from 'react';

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
  ProFormInstance,
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
  const formRef = useRef<ProFormInstance>();
  const [pathDisabled, setPathDisabled] = useState(false);
  return (
    <ModalForm<MenuType>
      title={data ? '编辑' : '新建'}
      autoFocusFirstInput
      modalProps={{
        destroyOnClose: true,
      }}
      formRef={formRef}
      submitTimeout={2000}
      initialValues={
        child ? { pid: data?.id } : { ...data, type: data?.type.toString() }
      }
      onValuesChange={(changedValues) => {
        if (changedValues?.type) {
          if (changedValues?.type.toString() === '2') {
            formRef.current?.setFieldsValue({ path: '/file/child' });
            setPathDisabled(true);
          } else {
            formRef.current?.setFieldsValue({ path: '' });
            setPathDisabled(false);
          }
        }
      }}
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
        name="code"
        width="md"
        label="权限码"
        rules={[{ required: true, message: '权限码不能为空' }]}
      />

      <ProFormSelect
        name="type"
        width="md"
        label="菜单类型"
        rules={[{ required: true, message: '菜单类型不能为空' }]}
        valueEnum={MenuTypeEnum}
      />

      <ProFormText
        width="md"
        name="path"
        disabled={pathDisabled}
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
