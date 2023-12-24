import { LockOutlined, MobileOutlined } from '@ant-design/icons';

import { login } from '@/services/login';
import { KEYS, setSession } from '@/utils/util';
import ProForm, { ProFormText } from '@ant-design/pro-form';
import { Link, SelectLang, history, useModel } from '@umijs/max';
import { Alert, Form, message } from 'antd';
import React, { useState } from 'react';

import { flushSync } from 'react-dom';
import proSettings from '../../../config/defaultSettings';
import styles from './index.less';
const LoginMessage: React.FC<{
  content: string;
}> = ({ content }) => (
  <Alert
    style={{
      marginBottom: 24,
    }}
    message={content}
    type="error"
    showIcon
  />
);

const Login: React.FC = () => {
  const [form] = Form.useForm();
  const [submitting, setSubmitting] = useState(false);
  const [userLoginState, setUserLoginState] = useState<API.Result>({});
  const { initialState, setInitialState } = useModel('@@initialState');

  const fetchUserInfo = async () => {
    const userInfo = await initialState?.fetchUserInfo?.();
    const menuData = await initialState?.fetchMenuData?.();
    if (userInfo) {
      flushSync(() => {
        setInitialState((s) => ({
          ...s,
          currentUser: userInfo,
          menuData,
        }));
      });
    }
  };

  const handleSubmit = async (values: API.LoginParamsType) => {
    setSubmitting(true);
    // 登录
    const res = await login({ ...values, status: 'ACTIVE' });
    if (res.code === 0 || res.code === 200) {
      try {
        setSession(KEYS.token, res.data);
        message.success('登录成功');
        await fetchUserInfo();
        const urlParams = new URL(window.location.href).searchParams;
        history.push(urlParams.get('redirect') || '/');
      } catch (error) {
        setUserLoginState(res);
      }
    }
    setUserLoginState(res);
    setSubmitting(false);
  };
  const { code, msg } = userLoginState;

  return (
    <div className={styles.container}>
      <div className={styles.lang}>{SelectLang && <SelectLang />}</div>
      <div className={styles.content}>
        <div className={styles.top}>
          <div className={styles.header}>
            <Link to="/">
              <img alt="logo" className={styles.logo} src={proSettings.logo} />
              <span className={styles.title}>{proSettings.title}</span>
            </Link>
          </div>
          <div className={styles.desc}></div>
        </div>

        <div className={styles.main}>
          <ProForm
            form={form}
            submitter={{
              searchConfig: { submitText: '登录' },
              render: (_, dom) => dom.pop(),
              submitButtonProps: {
                loading: submitting,
                size: 'large',
                style: {
                  width: '100%',
                },
              },
            }}
            onFinish={async (values) => {
              handleSubmit(values as API.LoginParamsType);
            }}
          >
            {code && code !== 200 && code !== 0 && (
              <LoginMessage content={msg || ''} />
            )}

            <ProFormText
              name="name"
              fieldProps={{
                size: 'large',
                prefix: <MobileOutlined className={styles.prefixIcon} />,
              }}
              placeholder="请输入账号"
              rules={[
                {
                  required: true,
                  message: '请输入账号！',
                },
              ]}
            />
            <ProFormText.Password
              name="password"
              fieldProps={{
                size: 'large',
                prefix: <LockOutlined className={styles.prefixIcon} />,
              }}
              placeholder="密码"
              rules={[
                {
                  required: true,
                  message: '请输入密码！',
                },
              ]}
            />
          </ProForm>
        </div>
      </div>
    </div>
  );
};

export default Login;
