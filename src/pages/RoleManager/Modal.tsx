/*
 * @Author: 刘利军
 * @Date: 2023-12-23 02:21:42
 * @LastEditors: 刘利军
 * @LastEditTime: 2023-12-23 11:31:48
 * @Description:
 * @PageName:
 */
import { addRole, updateRole } from '@/services/roleManager';
import { RoleDataType, Status } from '@/types';
import {
  ModalForm,
  ModalFormProps,
  ProFormSegmented,
  ProFormText,
} from '@ant-design/pro-components';
import { Form, message } from 'antd';
import React, { useEffect } from 'react';

interface ModelProps {
  data?: RoleDataType;
  onOk?: () => void;
}

const RoleModal: React.FC<ModelProps & ModalFormProps<RoleDataType>> = ({
  data: user,
  onOk = () => {},
  ...props
}) => {
  const [form] = Form.useForm();
  useEffect(() => {
    form.setFieldsValue(user);
    return () => {
      form.setFieldsValue(undefined);
    };
  }, [user]);

  return (
    <ModalForm<RoleDataType>
      title={user ? '修改' : '新建'}
      form={form}
      initialValues={{ status: Status.ACTIVE }}
      modalProps={{
        destroyOnClose: true,
      }}
      submitTimeout={2000}
      onFinish={async (values) => {
        console.log('values', values);
        let res: API.Result;
        if (user) {
          res = await updateRole({ ...user, ...values });
        } else {
          res = await addRole(values);
        }
        if (res.code === 0 || res.code === 200) {
          onOk();
          message.success('提交成功');
        } else {
          message.error(res.msg);
        }
        return true;
      }}
      {...props}
    >
      <ProFormText
        width="md"
        name="roleName"
        label="角色名称"
        rules={[{ required: true, message: '角色名称不能为空' }]}
      />
      <ProFormText
        width="md"
        name="roleCode"
        label="角色编码"
        rules={[{ required: true, message: '角色编码不能为空' }]}
      />

      <ProFormSegmented
        rules={[{ required: true, message: '状态不能为空' }]}
        name="status"
        label="状态"
        request={async () => [
          { label: '启用', value: Status.ACTIVE },
          { label: '禁用', value: Status.DISABLE },
        ]}
      />
    </ModalForm>
  );
};

export default RoleModal;
