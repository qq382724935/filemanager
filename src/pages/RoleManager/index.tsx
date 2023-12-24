import AccountAuth from '@/components/AccountAuth';
import MenuAuth from '@/components/MenuAuth';
import { delRole, getRoles } from '@/services/roleManager';
import { RoleDataType } from '@/types';
import { QuestionCircleOutlined } from '@ant-design/icons';
import type { ActionType, ProColumns } from '@ant-design/pro-components';
import { ProTable } from '@ant-design/pro-components';
import { Button, Divider, Popconfirm, message } from 'antd';
import { FC, useRef, useState } from 'react';
import RoleModal from './Modal';

const RoleManager: FC = () => {
  const actionRef = useRef<ActionType>();
  const [open, setOpen] = useState(false);
  const [accountOpen, setAccountOpen] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const [data, setData] = useState<RoleDataType>();
  const columns: ProColumns<RoleDataType>[] = [
    {
      dataIndex: 'index',
      valueType: 'indexBorder',
      width: 48,
    },
    {
      title: '角色名称',
      dataIndex: 'roleName',
    },
    {
      title: '角色编码',
      dataIndex: 'roleCode',
    },
    {
      disable: true,
      title: '创建时间',
      dataIndex: 'createDate',
      search: false,
    },
    {
      title: '操作',
      valueType: 'option',
      key: 'option',
      render: (text, record, _, action) => [
        <a
          key="edit"
          onClick={() => {
            setOpen(true);
            setData(record);
          }}
        >
          编辑
        </a>,
        <Divider key="d1" type="vertical" />,
        <Popconfirm
          placement="topLeft"
          key="delete"
          title="确认删除此角色吗?"
          icon={<QuestionCircleOutlined style={{ color: 'red' }} />}
          onConfirm={async () => {
            const res = await delRole(record.id);
            if (res.code === 200 || res.code === 0) {
              action?.reload();
              message.success('删除成功');
            } else {
              message.error(res.msg);
            }
          }}
        >
          <a>删除</a>
        </Popconfirm>,
        <Divider key="d2" type="vertical" />,
        <a
          key="account"
          onClick={() => {
            setData(record);
            setAccountOpen(true);
          }}
        >
          绑定账号
        </a>,
        <Divider key="d3" type="vertical" />,
        <a
          key="menu"
          onClick={() => {
            setData(record);
            setMenuOpen(true);
          }}
        >
          绑定菜单
        </a>,
      ],
    },
  ];

  const menuCancel = () => {
    setData(undefined);
    setMenuOpen(false);
  };
  const accountCancel = () => {
    setData(undefined);
    setAccountOpen(false);
  };
  return (
    <>
      <ProTable<RoleDataType>
        columns={columns}
        actionRef={actionRef}
        cardBordered
        request={async (params) => {
          const result = await getRoles(params);
          return {
            data: result?.data.list || [],
            success: true,
            total: result?.data?.totalElement || 0,
          };
        }}
        rowKey="id"
        search={{ labelWidth: 'auto' }}
        options={{ setting: { listsHeight: 400 } }}
        dateFormatter="string"
        headerTitle="角色列表"
        toolBarRender={() => [
          <Button key="add" type="primary" onClick={() => setOpen(true)}>
            新建
          </Button>,
        ]}
      />
      <RoleModal
        open={open}
        onOpenChange={(visible) => {
          setOpen(visible);
          if (!visible) {
            setData(undefined);
          }
        }}
        data={data}
        onOk={() => actionRef.current?.reload()}
      />
      <MenuAuth
        open={menuOpen}
        roleId={data?.id || ''}
        permissionIdList={data?.permissionIdList || []}
        onCancel={menuCancel}
        onOk={() => {
          menuCancel();
          actionRef.current?.reload();
        }}
      />
      <AccountAuth
        roleId={data?.id || ''}
        userIdList={data?.userIdList || []}
        open={accountOpen}
        onCancel={accountCancel}
        onOk={() => {
          accountCancel();
          actionRef.current?.reload();
        }}
      />
    </>
  );
};

export default RoleManager;
