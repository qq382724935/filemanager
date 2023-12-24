import { delUser, getUsers } from '@/services/user';
import { User } from '@/types/User';
import { StatusEnum } from '@/utils';
import { QuestionCircleOutlined } from '@ant-design/icons';
import type { ActionType, ProColumns } from '@ant-design/pro-components';
import { ProTable } from '@ant-design/pro-components';
import { Button, Popconfirm, message } from 'antd';
import { useRef, useState } from 'react';
import FileRoleManager from './FileRoleModal';
import UserModal from './UserModal';

export default function UserManager() {
  const actionRef = useRef<ActionType>();
  const [open, setOpen] = useState(false);
  const [user, setUser] = useState<User>();
  const [roleOpen, setRoleOpen] = useState(false);

  const columns: ProColumns<User>[] = [
    {
      dataIndex: 'index',
      valueType: 'indexBorder',
      width: 48,
    },
    {
      title: '用户名',
      dataIndex: 'name',
      copyable: true,
      ellipsis: true,
      tip: '登录用户名',
      hideInSearch: true,
    },
    {
      title: '状态',
      dataIndex: 'status',
      initialValue: 'all',
      hideInSearch: true,
      valueEnum: StatusEnum,
    },
    {
      disable: true,
      title: '创建时间',
      dataIndex: 'createDate',
      valueType: 'dateTime',
      search: false,
      renderFormItem: (_, { defaultRender }) => {
        return defaultRender(_);
      },
    },
    {
      title: '操作',
      valueType: 'option',
      key: 'option',
      render: (text, record, _, action) => [
        <Button
          type="link"
          key="edit"
          onClick={() => {
            setOpen(true);
            setUser(record);
          }}
        >
          修改
        </Button>,
        <Button
          type="link"
          key="set"
          onClick={() => {
            setRoleOpen(true);
            setUser(record);
          }}
        >
          文件权限
        </Button>,
        <Popconfirm
          placement="topLeft"
          key="delete"
          title="确认删除此用户吗?"
          icon={<QuestionCircleOutlined style={{ color: 'red' }} />}
          onConfirm={async () => {
            const res = await delUser(record.id);
            if (res.code === 200 || res.code === 0) {
              action?.reload();
              message.success('删除成功');
            } else {
              message.error(res.msg);
            }
          }}
        >
          <Button type="link" danger>
            删除
          </Button>
        </Popconfirm>,
      ],
    },
  ];
  return (
    <>
      <ProTable<User>
        columns={columns}
        actionRef={actionRef}
        cardBordered
        request={async () => {
          const res = await getUsers();
          return {
            success: true,
            data: res?.data || [],
            total: res.data?.length || 0,
          };
        }}
        rowKey="id"
        search={{
          labelWidth: 'auto',
        }}
        options={{
          setting: {
            listsHeight: 400,
          },
        }}
        pagination={{
          pageSize: 10,
          showSizeChanger: true,
        }}
        dateFormatter="string"
        headerTitle="用户列表"
        toolBarRender={() => [
          <Button key="add" type="primary" onClick={() => setOpen(true)}>
            新建
          </Button>,
        ]}
      />

      <UserModal
        open={open}
        onOpenChange={(visible) => {
          setOpen(visible);
          if (!visible) {
            setUser(undefined);
          }
        }}
        user={user}
        onOk={() => actionRef.current?.reload()}
      />

      <FileRoleManager
        open={roleOpen}
        user={user}
        onCancel={() => {
          setRoleOpen(false);
          setUser(undefined);
        }}
      />
    </>
  );
}
