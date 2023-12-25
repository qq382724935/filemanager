import {
  FileItemType,
  addFile,
  delFile,
  getFiles,
  updateFile,
  uploadFile,
} from '@/services/fileManager';
import { File_Base } from '@/utils';
import {
  InboxOutlined,
  LeftOutlined,
  PlusCircleFilled,
  QuestionCircleOutlined,
  UploadOutlined,
} from '@ant-design/icons';
import { ActionType, ProList } from '@ant-design/pro-components';
import { useMatch } from '@umijs/max';
import {
  Breadcrumb,
  Button,
  Divider,
  Modal,
  Popconfirm,
  Upload,
  UploadFile,
  UploadProps,
  message,
} from 'antd';
import { ItemType } from 'antd/es/breadcrumb/Breadcrumb';
import { useEffect, useRef, useState } from 'react';

const { Dragger } = Upload;
const defaultDddFile: any = {
  id: 'add',
  fileName: '',
  uploadDate: '',
  icon: File_Base,
  extName: 'folder',
};

const FileManagerChild = () => {
  const [loading, setLoading] = useState(false);
  const [breadcrumbList, setBreadcrumbList] = useState<ItemType[]>([]);
  const actionRef = useRef<ActionType>();

  const [fileData, setFileData] = useState<FileItemType[]>([]);
  const [pId, setPId] = useState('');
  const match = useMatch('/file/:id');
  // 页面切换回复到所有状态
  const clearState = () => {
    actionRef.current?.cancelEditable('add');
    setBreadcrumbList([]);
  };
  const getFilesData = async (id: string) => {
    setLoading(true);
    try {
      const res = await getFiles(id);
      setFileData(res?.data || []);
    } catch (error) {}
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
        if (breadcrumbList.length === 1 && match?.params.id) {
          clearState();
          setPId(match?.params.id);
          getFilesData(match?.params.id);
        }
        if (breadcrumbList.length > 1) {
          breadcrumbList.pop();
          const id: any = breadcrumbList[breadcrumbList.length - 1].key;
          setPId(id);
          setBreadcrumbList(breadcrumbList);
          getFilesData(id);
        }
      },
    },
    {
      key: 'allFile',
      title: '全部文件',
      onClick: () => {
        clearState();
        getFilesData(match?.params.id || '');
      },
    },
  ];

  useEffect(() => {
    if (match?.params.id) {
      clearState();
      setPId(match?.params.id);
      getFilesData(match?.params.id);
    }
  }, [match?.params.id]);

  const [fileList, setFileList] = useState<UploadFile[]>([]);
  const [openModal, setOpenModal] = useState(false);
  const uploadProps: UploadProps = {
    maxCount: 1,
    multiple: false,
    onRemove: (file) => {
      const index = fileList.indexOf(file);
      const newFileList = fileList.slice();
      newFileList.splice(index, 1);
      setFileList([]);
    },
    beforeUpload: (file) => {
      setFileList([file]);
      return false;
    },
    fileList,
  };

  const uploadModalCancel = () => {
    setOpenModal(false);
    setFileList([]);
  };
  const [confirmLoading, setConfirmLoading] = useState(false);
  return (
    <>
      <ProList<FileItemType>
        loading={loading}
        dataSource={fileData}
        actionRef={actionRef}
        pagination={false}
        toolBarRender={() => {
          return [
            <Button
              key="addFile"
              type="primary"
              icon={<PlusCircleFilled />}
              onClick={() => {
                actionRef.current?.addEditRecord(defaultDddFile, {
                  position: 'top',
                });
              }}
            >
              新建文件夹
            </Button>,
            <Button
              key="upload"
              icon={<UploadOutlined />}
              onClick={() => setOpenModal(true)}
            >
              上传
            </Button>,
          ];
        }}
        rowKey="id"
        headerTitle={
          <Breadcrumb
            items={[
              ...(breadcrumbList.length > 0 ? defaultBreadcrumbItems : []),
              ...breadcrumbList,
            ]}
          />
        }
        editable={{
          onSave: async (key, record) => {
            let res: API.Result;
            if (record.id === 'add') {
              res = await addFile({
                name: record.fileName,
                pid: pId,
                extName: record.extName,
                icon: File_Base,
              });
            } else {
              res = await updateFile({
                id: record.id,
                fileName: record.fileName,
              });
            }

            if (res.code !== 0) {
              message.error(res.msg);
              return false;
            }
            await getFilesData(pId);
            return true;
          },
          actionRender: (row, config, dom) => [dom.save, dom.cancel],
        }}
        showActions="hover"
        metas={{
          title: {
            dataIndex: 'fileName',
            render(dom, row) {
              return (
                <span
                  onClick={async () => {
                    if (row.extName === 'folder') {
                      return true;
                    }
                    setPId(row.id);
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
          content: { dataIndex: 'createDate', editable: false },
          avatar: { dataIndex: 'icon', valueType: 'avatar', editable: false },
          actions: {
            render: (dom, row, index, action) => {
              const isRole = (key: string) => {
                if (row.buttonList && row.buttonList.length > 0) {
                  return row.buttonList.indexOf(key) > -1;
                }
                return false;
              };
              return [
                <a
                  key="edit"
                  onClick={() => action?.startEditable(row.id)}
                  style={{ color: isRole('UPDATE') ? '' : '#fff' }}
                >
                  编辑
                </a>,
                <Divider type="vertical" key="d1" />,
                <a key="link" style={{ color: isRole('UPDATE') ? '' : '#fff' }}>
                  下载
                </a>,
                <Divider type="vertical" key="d2" />,
                <Popconfirm
                  placement="topLeft"
                  key="delete"
                  title="确认删除此角色吗?"
                  icon={<QuestionCircleOutlined style={{ color: 'red' }} />}
                  onConfirm={async () => {
                    const res = await delFile(row.id);
                    if (res.code !== 0) {
                      message.error(res.msg);
                    }
                    await getFilesData(pId);
                  }}
                >
                  <a style={{ color: isRole('UPDATE') ? '' : '#fff' }}>删除</a>
                </Popconfirm>,
              ];
            },
          },
        }}
      />
      <Modal
        open={openModal}
        title="文件上传"
        confirmLoading={confirmLoading}
        onCancel={() => uploadModalCancel()}
        onOk={async () => {
          setConfirmLoading(true);
          const res = await uploadFile(fileList, pId);
          if (res.code === 0) {
            setOpenModal(false);
            await getFilesData(pId);
          }
          setConfirmLoading(false);
        }}
      >
        <Dragger {...uploadProps}>
          <p className="ant-upload-drag-icon">
            <InboxOutlined />
          </p>
          <p className="ant-upload-text">单击或拖动文件到此区域进行上传</p>
          <p className="ant-upload-hint">支持单次上传,严禁上传被禁止的文件.</p>
        </Dragger>
      </Modal>
    </>
  );
};

export default FileManagerChild;
