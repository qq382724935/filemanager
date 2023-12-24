/*
 * @Author: 刘利军
 * @Date: 2023-12-23 14:34:32
 * @LastEditors: 刘利军
 * @LastEditTime: 2023-12-23 15:45:27
 * @Description:
 * @PageName:
 */

import { bindUser } from '@/services/roleManager';
import { getUsers } from '@/services/user';
import { User } from '@/types';
import { StatusEnum } from '@/utils';
import { ProTable } from '@ant-design/pro-components';
import { Modal, ModalProps, Table, message } from 'antd';
import { useEffect, useState } from 'react';

const AccountAuth: React.FC<
  ModalProps & { roleId: string; userIdList: string[] }
> = ({ roleId, userIdList, onOk = () => {}, ...props }) => {
  const [dataSource, setDataSource] = useState<User[]>([]);
  const [selectedRows, setSelectedRows] = useState<React.Key[]>([]);

  const getUserData = async () => {
    const res = await getUsers();
    setDataSource(res.data);
  };
  useEffect(() => {
    getUserData();
    return () => {};
  }, []);
  useEffect(() => {
    setSelectedRows(userIdList);
    return () => {};
  }, [roleId]);

  const onSelectedRowKeysChange = (selectedRowKeys: any) => {
    setSelectedRows(selectedRowKeys);
  };

  return (
    <Modal
      width={800}
      destroyOnClose={true}
      title="绑定账号"
      onOk={async (e) => {
        const res = await bindUser(roleId, selectedRows);
        if (res.code === 0) {
          onOk(e);
        } else {
          message.error(res.msg);
        }
      }}
      {...props}
    >
      <ProTable
        dataSource={dataSource}
        rowSelection={{
          selections: [Table.SELECTION_ALL, Table.SELECTION_INVERT],
          onChange: (selectedRowKeys) =>
            onSelectedRowKeysChange(selectedRowKeys),
          selectedRowKeys: selectedRows,
        }}
        search={false}
        toolBarRender={false}
        rowKey="id"
        pagination={false}
        scroll={{ y: 240 }}
        columns={[
          {
            title: '用户名称',
            dataIndex: 'name',
          },
          {
            title: '用户id',
            dataIndex: 'id',
          },
          {
            title: '状态',
            dataIndex: 'status',
            valueEnum: StatusEnum,
          },
        ]}
      />
    </Modal>
  );
};

export default AccountAuth;
