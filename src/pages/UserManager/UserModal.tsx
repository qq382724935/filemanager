/*
 * @Author: 刘利军
 * @Date: 2023-12-23 02:21:42
 * @LastEditors: 刘利军
 * @LastEditTime: 2023-12-24 22:39:44
 * @Description:
 * @PageName:
 */
import { Form, message } from 'antd';
import React, { useEffect } from 'react';

import { addUser, updateUser } from '@/services/user';
import { Status, User } from '@/types';
import {
  ModalForm,
  ModalFormProps,
  ProFormSegmented,
  ProFormText,
} from '@ant-design/pro-components';

export interface ModelProps {
  user?: User;
  onOk?: () => void;
}

const UserModal: React.FC<ModelProps & ModalFormProps<User>> = ({
  user,
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
    <ModalForm<User>
      title={user ? '修改' : '新建'}
      form={form}
      initialValues={{ status: Status.ACTIVE }}
      modalProps={{
        destroyOnClose: true,
      }}
      submitTimeout={2000}
      onFinish={async (values) => {
        let res: API.ResultObject<User>;
        if (user) {
          res = await updateUser(user.id, values);
        } else {
          res = await addUser(values);
        }
        if (res.code !== 0 && res.code !== 200) {
          message.error(res.msg);
          return false;
        }
        onOk();
        return true;
      }}
      {...props}
    >
      <ProFormText
        width="md"
        name="name"
        label="用户名"
        rules={[{ required: true, message: '用户名不能为空' }]}
      />
      <ProFormText.Password
        width="md"
        name="password"
        label="密码"
        rules={[{ required: true, message: '密码不能为空' }]}
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

export default UserModal;
