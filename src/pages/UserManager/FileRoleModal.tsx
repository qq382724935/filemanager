/*
 * @Author: 刘利军
 * @Date: 2023-12-24 19:46:44
 * @LastEditors: 刘利军
 * @LastEditTime: 2023-12-24 23:08:18
 * @Description:
 * @PageName:
 */

import {
  FileItemType,
  getFileNoRoleMenu,
  getFileRoleMenu,
} from '@/services/fileManager';
import { Status } from '@/types';
import { LeftOutlined } from '@ant-design/icons';
import {
  DrawerForm,
  ProFormSegmented,
  ProList,
} from '@ant-design/pro-components';
import { Breadcrumb, Button, Modal, ModalProps, message } from 'antd';
import { ItemType } from 'antd/es/breadcrumb/Breadcrumb';
import { useEffect, useState } from 'react';
import { ModelProps } from './UserModal';

const FileRoleManager: React.FC<ModelProps & ModalProps> = ({
  user,
  onCancel,
  open,
}) => {
  const [loading, setLoading] = useState(false);
  const [breadcrumbList, setBreadcrumbList] = useState<ItemType[]>([]);

  const [fileData, setFileData] = useState<FileItemType[]>([]);
  const [roleId, setRoleId] = useState('');
  // 页面切换回复到所有状态
  const clearState = () => {
    setBreadcrumbList([]);
  };
  const getFilesData = async (id: string = '') => {
    setLoading(true);
    let res: API.Result & { data: FileItemType[] };
    if (id) {
      res = await getFileNoRoleMenu(id);
    } else {
      // 无id获取一级菜单
      res = await getFileRoleMenu();
    }
    if (res.code !== 0) {
      message.error(res.msg);
    }
    setFileData(res?.data || []);
    setLoading(false);
  };

  const defaultBreadcrumbItems = [
    {
      title: (
        <>
          <LeftOutlined />
          <span>返回上一级</span>
        </>
      ),
      key: 'back',
      onClick: () => {
        if (breadcrumbList.length > 1) {
          breadcrumbList.pop();
          const id: any = breadcrumbList[breadcrumbList.length - 1].key;
          setBreadcrumbList(breadcrumbList);
          getFilesData(id);
        } else {
          clearState();
          getFilesData();
        }
      },
    },
    {
      key: 'allFile',
      title: '全部文件',
      onClick: () => {
        clearState();
        getFilesData();
      },
    },
  ];

  useEffect(() => {
    getFilesData();
  }, []);

  return (
    <Modal
      title="设置用户文件权限"
      destroyOnClose={true}
      open={open}
      width={800}
      footer={false}
      onCancel={onCancel}
      styles={{ body: { height: 360, overflowY: 'scroll' } }}
    >
      <ProList<FileItemType>
        loading={loading}
        dataSource={fileData}
        rowKey="id"
        headerTitle={
          <Breadcrumb
            items={[
              ...(breadcrumbList.length > 0 ? defaultBreadcrumbItems : []),
              ...breadcrumbList,
            ]}
          />
        }
        pagination={false}
        showActions="hover"
        metas={{
          title: {
            dataIndex: 'fileName',
            render(dom, row) {
              return (
                <span
                  onClick={async () => {
                    setBreadcrumbList([
                      ...breadcrumbList,
                      { key: row.id, title: row.fileName },
                    ]);
                    await getFilesData(row.id);
                  }}
                >
                  {dom}
                </span>
              );
            },
          },
          content: { dataIndex: 'uploadDate', editable: false },
          avatar: { dataIndex: 'icon', valueType: 'avatar', editable: false },
          actions: {
            render: (_, row) => {
              return [
                <Button
                  key="setRole"
                  type="primary"
                  size="small"
                  onClick={() => setRoleId(row.id)}
                >
                  设置权限
                </Button>,
              ];
            },
          },
        }}
      />

      <DrawerForm
        title="设置文件权限"
        open={!!roleId}
        onOpenChange={(vis) => {
          if (!vis) {
            setRoleId('');
          }
        }}
        onFinish={async () => {
          return true;
        }}
      >
        <ProFormSegmented
          rules={[{ required: true, message: '不能为空' }]}
          name="UPDATE"
          label="是否可编辑"
          request={async () => [
            { label: '启用', value: Status.ACTIVE },
            { label: '禁用', value: Status.DISABLE },
          ]}
        />
        <ProFormSegmented
          rules={[{ required: true, message: '不能为空' }]}
          name="UPLOAD"
          label="是否可上传"
          request={async () => [
            { label: '启用', value: Status.ACTIVE },
            { label: '禁用', value: Status.DISABLE },
          ]}
        />
        <ProFormSegmented
          rules={[{ required: true, message: '不能为空' }]}
          name="CREATE"
          label="是否可创建"
          request={async () => [
            { label: '启用', value: Status.ACTIVE },
            { label: '禁用', value: Status.DISABLE },
          ]}
        />
        <ProFormSegmented
          rules={[{ required: true, message: '不能为空' }]}
          name="DOWNLOAD"
          label="是否可下载"
          request={async () => [
            { label: '启用', value: Status.ACTIVE },
            { label: '禁用', value: Status.DISABLE },
          ]}
        />
        <ProFormSegmented
          rules={[{ required: true, message: '不能为空' }]}
          name="DELETE"
          label="是否可下载"
          request={async () => [
            { label: '启用', value: Status.ACTIVE },
            { label: '禁用', value: Status.DISABLE },
          ]}
        />
      </DrawerForm>
    </Modal>
  );
};

export default FileRoleManager;
