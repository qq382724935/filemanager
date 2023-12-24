import { MenuType, delMenu, getMenus } from '@/services/menuManaget';
import { MenuTypeEnum } from '@/utils';
import { QuestionCircleOutlined } from '@ant-design/icons';
import type { ActionType, ProColumns } from '@ant-design/pro-components';
import { ProTable } from '@ant-design/pro-components';
import { Button, Divider, Popconfirm, message } from 'antd';
import { FC, useRef, useState } from 'react';
import MenuModal from './Modal';

const MenuManager: FC = () => {
  const actionRef = useRef<ActionType>();

  const [open, setOpen] = useState(false);
  const [child, setChild] = useState(false);
  const [data, setData] = useState<MenuType>();
  const columns: ProColumns<MenuType>[] = [
    {
      dataIndex: 'index',
      valueType: 'indexBorder',
      width: 48,
    },
    {
      title: '菜单名称',
      dataIndex: 'name',
    },
    {
      title: '上级菜单',
      dataIndex: 'pid',
      valueType: 'select',
      request: async () => {
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
      },
    },
    {
      title: '菜单类型',
      dataIndex: 'type',
      valueEnum: MenuTypeEnum,
    },
    {
      title: '权限码',
      dataIndex: 'code',
      hideInSearch: true,
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
        <a
          key="add"
          onClick={() => {
            setOpen(true);
            setData(record);
            setChild(true);
          }}
        >
          添加子菜单
        </a>,
        <Divider key="d2" type="vertical" />,
        <Popconfirm
          placement="topLeft"
          key="delete"
          title="确认删除此角色吗?"
          icon={<QuestionCircleOutlined style={{ color: 'red' }} />}
          onConfirm={async () => {
            const res = await delMenu(record.id);
            if (res.code === 200 || res.code === 0) {
              action?.reload();
            } else {
              message.error(res.msg);
            }
          }}
        >
          <a style={{ color: 'red' }}>删除</a>
        </Popconfirm>,
      ],
    },
  ];
  return (
    <>
      <ProTable<MenuType>
        columns={columns}
        actionRef={actionRef}
        cardBordered
        request={async (params) => {
          const res = await getMenus(params);
          return {
            data: res.data.list || [],
            success: true,
            total: res.data.totalElement,
          };
        }}
        editable={{
          type: 'multiple',
        }}
        rowKey="id"
        search={{ labelWidth: 'auto' }}
        options={{ setting: { listsHeight: 400 } }}
        pagination={{
          pageSize: 10,
          showSizeChanger: true,
        }}
        dateFormatter="string"
        headerTitle="菜单列表"
        toolBarRender={() => [
          <Button key="add" type="primary" onClick={() => setOpen(true)}>
            新建
          </Button>,
        ]}
      />
      <MenuModal
        key="useModal"
        open={open}
        child={child}
        onOpenChange={(visible) => {
          if (!visible) {
            setOpen(visible);
            setData(undefined);
            setChild(false);
          }
        }}
        data={data}
        onOk={() => actionRef.current?.reload()}
      />
    </>
  );
};

export default MenuManager;
