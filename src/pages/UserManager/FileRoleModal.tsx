/*
 * @Author: 刘利军
 * @Date: 2023-12-24 19:46:44
 * @LastEditors: 刘利军
 * @LastEditTime: 2023-12-25 13:08:21
 * @Description:
 * @PageName:
 */

import {
  FileItemType,
  getFileNoRoleMenu,
  getFileRoleMenu,
} from '@/services/fileManager';
import { getUserFileRoleList } from '@/services/user';
import { Status } from '@/types';
import { LeftOutlined } from '@ant-design/icons';
import {
  DrawerForm,
  ProFormInstance,
  ProFormSegmented,
  ProList,
} from '@ant-design/pro-components';
import { Breadcrumb, Button, Modal, ModalProps, message } from 'antd';
import { ItemType } from 'antd/es/breadcrumb/Breadcrumb';
import { useEffect, useRef, useState } from 'react';

const BindShow = [
  { label: '显示', value: Status.ACTIVE },
  { label: '不显示', value: Status.DISABLE },
];
const FileRoleManager: React.FC<{ userId: string } & ModalProps> = ({
  userId,
  onCancel,
  open,
}) => {
  const [loading, setLoading] = useState(false);
  const [breadcrumbList, setBreadcrumbList] = useState<ItemType[]>([]);

  const [fileData, setFileData] = useState<FileItemType[]>([]);
  const [bindRoleId, setBindRoleId] = useState('');
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

  const formRef = useRef<ProFormInstance>();
  const [drawerLoading, setDrawerLoading] = useState(false);

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
                  onClick={() => setBindRoleId(row.id)}
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
        open={!!bindRoleId}
        loading={drawerLoading}
        formRef={formRef}
        onOpenChange={(vis) => {
          if (!vis) {
            setBindRoleId('');
          } else {
            setDrawerLoading(true);
            const res = getUserFileRoleList({ userId, fileId: bindRoleId });
            setDrawerLoading(true);
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
          request={async () => BindShow}
        />
        <ProFormSegmented
          rules={[{ required: true, message: '不能为空' }]}
          name="UPLOAD"
          label="是否可上传"
          request={async () => BindShow}
        />
        <ProFormSegmented
          rules={[{ required: true, message: '不能为空' }]}
          name="CREATE"
          label="是否可创建"
          request={async () => BindShow}
        />
        <ProFormSegmented
          rules={[{ required: true, message: '不能为空' }]}
          name="DOWNLOAD"
          label="是否可下载"
          request={async () => BindShow}
        />
        <ProFormSegmented
          rules={[{ required: true, message: '不能为空' }]}
          name="DELETE"
          label="是否可下载"
          request={async () => BindShow}
        />
      </DrawerForm>
    </Modal>
  );
};

export default FileRoleManager;
