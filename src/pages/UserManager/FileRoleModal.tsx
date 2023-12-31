/*
 * @Author: 刘利军
 * @Date: 2023-12-24 19:46:44
 * @LastEditors: 刘利军
 * @LastEditTime: 2023-12-26 22:46:48
 * @Description:
 * @PageName:
 */

import {
  FileItemType,
  getFileNoRoleMenu,
  getFileRoleMenu,
} from '@/services/fileManager';
import {
  UserFileRoleListItem,
  addUserBindFileRole,
  getUserFileRoleList,
} from '@/services/user';
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
  { label: '是', value: Status.ACTIVE },
  { label: '否', value: Status.DISABLE },
];
let userFileRoleList: UserFileRoleListItem[] = [];
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
  const initUserFileRoleList = async () => {
    const res = await getUserFileRoleList(userId);
    if (res.code === 0) {
      userFileRoleList = res.data.filter((item) => item);
    }
  };
  const init = async () => {
    await getFilesData();
    await initUserFileRoleList();
  };

  useEffect(() => {
    if (userId) {
      init();
    }
  }, [userId]);

  const formRef = useRef<ProFormInstance>();
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

      <DrawerForm<{
        SHOW: string;
        UPDATE: string;
        UPLOAD: string;
        CREATE: string;
        DOWNLOAD: string;
        DELETE: string;
      }>
        title="设置文件权限"
        open={!!bindRoleId}
        formRef={formRef}
        onOpenChange={(vis) => {
          if (!vis) {
            setBindRoleId('');
          } else {
            const isData = userFileRoleList.some((item) => {
              if (item.fileId === bindRoleId) {
                const initValue = (key: string) => {
                  return item.buttonList.indexOf(key) > -1
                    ? Status.ACTIVE
                    : Status.DISABLE;
                };
                formRef.current?.setFieldsValue({
                  SHOW: item.status ? Status.ACTIVE : Status.DISABLE,
                  UPDATE: initValue('UPDATE'),
                  UPLOAD: initValue('UPLOAD'),
                  CREATE: initValue('CREATE'),
                  DOWNLOAD: initValue('DOWNLOAD'),
                  DELETE: initValue('DELETE'),
                });
                return true;
              }
              return false;
            });
            if (!isData) {
              formRef.current?.setFieldsValue({
                SHOW: Status.DISABLE,
                UPDATE: Status.DISABLE,
                UPLOAD: Status.DISABLE,
                CREATE: Status.DISABLE,
                DOWNLOAD: Status.DISABLE,
                DELETE: Status.DISABLE,
              });
            }
          }
        }}
        onFinish={async (values) => {
          const buttonList = Object.fromEntries(
            Object.entries(values).filter((item) => item[1] === Status.ACTIVE),
          );
          let keyList = Object.keys(buttonList);
          let fileList: UserFileRoleListItem[] = [
            {
              fileId: bindRoleId,
              status: keyList.indexOf('SHOW') > -1,
              buttonList: keyList.filter((item) => item !== 'SHOW'),
            },
          ];
          const res = await addUserBindFileRole(userId, fileList);
          if (res.code !== 0) {
            message.error(res.msg);
            return false;
          }
          await initUserFileRoleList();
          setBindRoleId('');
          message.success('设置成功');
          return true;
        }}
      >
        <ProFormSegmented
          rules={[{ required: true, message: '不能为空' }]}
          name="SHOW"
          label="是否可查看"
          request={async () => BindShow}
        />
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
          label="是否可删除"
          request={async () => BindShow}
        />
      </DrawerForm>
    </Modal>
  );
};

export default FileRoleManager;
