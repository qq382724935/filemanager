import {
  FileItemType,
  addFile,
  chunkUploadFile,
  delFile,
  getFiles,
  updateFile,
} from '@/services/fileManager';
import { API_PROXY, File_Base, isImage, isVideo } from '@/utils';
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
  Image,
  Modal,
  Popconfirm,
  Upload,
  UploadFile,
  UploadProps,
  message,
  notification,
} from 'antd';
import { ItemType } from 'antd/es/breadcrumb/Breadcrumb';
import { RcFile } from 'antd/es/upload';
import { useEffect, useRef, useState } from 'react';

const { Dragger } = Upload;

let addKey = '';
let menuRoleList: FileItemType[] = [];

export type BreadcrumbListItm = ItemType & { buttonList: Array<string> | null };
const FileManagerChild = () => {
  const [loading, setLoading] = useState(false);
  const [breadcrumbList, setBreadcrumbList] = useState<BreadcrumbListItm[]>([]);
  const actionRef = useRef<ActionType>();

  const [fileData, setFileData] = useState<FileItemType[]>([]);
  const [pId, setPId] = useState('');
  const match = useMatch('/file/:id');
  // 页面切换回复到所有状态
  const clearState = () => {
    actionRef.current?.cancelEditable(addKey);
    setBreadcrumbList([]);
  };
  const getFilesData = async (id: string) => {
    setLoading(true);
    try {
      const res = await getFiles(id);
      menuRoleList = res?.data.filter((item) => item.type === 999);
      const fileDataList = res?.data.filter((item) => item.type !== 999);
      setFileData(fileDataList);
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
  const [errorFileList, setErrorFileList] = useState<UploadFile[]>([]);
  const [openModal, setOpenModal] = useState(false);

  const uploadProps: UploadProps = {
    multiple: true,
    onRemove: (file) => {
      const index = fileList.indexOf(file);
      const newFileList = fileList.slice();
      newFileList.splice(index, 1);
      setFileList(newFileList);
    },
    beforeUpload: async (file) => {
      setFileList((val) => [...val, file]);
      return false;
    },
    fileList,
  };

  const uploadModalCancel = () => {
    setOpenModal(false);
    setFileList([]);
  };
  const [confirmLoading, setConfirmLoading] = useState(false);

  // toolBarRender区域渲染条件
  const isShowTooalBar = (key: string) => {
    if (breadcrumbList && breadcrumbList.length > 0) {
      const list = breadcrumbList[breadcrumbList.length - 1]?.buttonList || [];
      return list.indexOf(key) > -1;
    }
    if (menuRoleList.length > 0) {
      return (menuRoleList[0].buttonList || [])?.indexOf(key) > -1;
    }
    return false;
  };

  const [previewUrl, setPreviewUrl] = useState('');
  const [videoUrl, setVideoUrl] = useState('');

  const [api, contextHolder] = notification.useNotification();
  return (
    <>
      {contextHolder}
      <ProList<FileItemType>
        loading={loading}
        dataSource={fileData}
        actionRef={actionRef}
        pagination={false}
        toolBarRender={() => {
          return [
            <div key="tool">
              {isShowTooalBar('CREATE') && (
                <Button
                  key="addFile"
                  type="primary"
                  icon={<PlusCircleFilled />}
                  onClick={() => {
                    addKey = `add-${new Date()}`;
                    actionRef.current?.addEditRecord(
                      {
                        id: addKey,
                        type: 1,
                        fileName: '',
                        uploadDate: '',
                        icon: File_Base,
                        extName: '.temp',
                      },
                      {
                        position: 'top',
                      },
                    );
                  }}
                >
                  新建文件夹
                </Button>
              )}
              {isShowTooalBar('UPLOAD') && (
                <Button
                  style={{ marginLeft: 24 }}
                  key="upload"
                  icon={<UploadOutlined />}
                  onClick={() => {
                    actionRef.current?.cancelEditable(addKey);
                    setOpenModal(true);
                  }}
                >
                  上传
                </Button>
              )}
            </div>,
          ];
        }}
        rowKey="id"
        headerTitle={
          breadcrumbList.length > 0 ? (
            <Breadcrumb
              items={[...defaultBreadcrumbItems, ...breadcrumbList]}
            />
          ) : (
            <span>全部文件</span>
          )
        }
        editable={{
          onSave: async (key, record) => {
            let res: API.Result;
            if (record.id.startsWith('add')) {
              res = await addFile({
                name: record.fileName,
                pid: pId,
                extName: record.extName,
                icon: File_Base,
                type: record.type,
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
                    if (row.type === 2) {
                      if (isVideo(row.extName)) {
                        setVideoUrl(`${API_PROXY}/file/download/${row.id}`);
                      } else if (isImage(row.extName)) {
                        setPreviewUrl(`${API_PROXY}/file/download/${row.id}`);
                      } else {
                        window.open(
                          `${API_PROXY}/file/download/${row.id}`,
                          '_blank',
                        );
                      }
                      return true;
                    }
                    setPId(row.id);
                    setBreadcrumbList([
                      ...breadcrumbList,
                      {
                        key: row.id,
                        title: row.fileName,
                        buttonList: row.buttonList,
                      },
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
                <div
                  key="action"
                  style={{
                    width: 130,
                    display: 'flex',
                    justifyContent: 'flex-start',
                  }}
                >
                  {isRole('UPDATE') && (
                    <>
                      <a
                        key="edit"
                        onClick={() => action?.startEditable(row.id)}
                      >
                        编辑
                      </a>
                      <Divider type="vertical" key="d1" />
                    </>
                  )}

                  {isRole('DOWNLOAD') && (
                    <>
                      <a
                        key="link"
                        target="_blank"
                        rel="noreferrer"
                        download={true}
                        href={`${API_PROXY}/file/download/${row.id}`}
                      >
                        下载
                      </a>
                      <Divider type="vertical" key="d2" />
                    </>
                  )}

                  {isRole('DELETE') && (
                    <>
                      <Popconfirm
                        placement="topLeft"
                        key="delete"
                        title="确认删除此吗,删除后内容不可恢复?"
                        icon={
                          <QuestionCircleOutlined style={{ color: 'red' }} />
                        }
                        onConfirm={async () => {
                          const res = await delFile(row.id);
                          if (res.code !== 0) {
                            message.error(res.msg);
                          }
                          await getFilesData(pId);
                        }}
                      >
                        <a>删除</a>
                      </Popconfirm>
                    </>
                  )}
                </div>,
              ];
            },
          },
        }}
      />

      <Modal
        open={openModal}
        title="文件上传"
        width={800}
        confirmLoading={confirmLoading}
        onCancel={() => {
          uploadModalCancel();
        }}
        onOk={async () => {
          setConfirmLoading(true);
          let errorList = [];
          for (let index = 0; index < fileList.length; index++) {
            const element = fileList[index] as RcFile;
            const res = await chunkUploadFile(
              {
                md5: 'md5',
                total: 0,
                index: 0,
                file: element,
                name: element.name,
              },
              pId,
            );
            if (res.code !== 0) {
              errorList.push(element);
            }
          }
          if (errorList.length > 0) {
            api.error({
              message: '上传失败提示',
              description: (
                <div>
                  <p>以下文件上传失败,请重新上传</p>
                  {errorList.map((item, index) => {
                    return <p key={index}>{item.name}</p>;
                  })}
                </div>
              ),
            });
          }

          setFileList([]);
          errorList = [];
          setOpenModal(false);
          await getFilesData(pId);
          setConfirmLoading(false);
        }}
      >
        <div>
          <Dragger {...uploadProps}>
            <p className="ant-upload-drag-icon">
              <InboxOutlined />
            </p>
            <p className="ant-upload-text">单击或拖动文件到此区域进行上传</p>
            <p className="ant-upload-hint">
              支持批量上传,严禁上传被禁止的文件.
            </p>
          </Dragger>
        </div>
      </Modal>

      <Image
        width={200}
        style={{ display: 'none' }}
        src="https://zos.alipayobjects.com/rmsportal/jkjgkEfvpUPVyRjUImniVslZfWPnJuuZ.png?x-oss-process=image/blur,r_50,s_50/quality,q_1/resize,m_mfit,h_200,w_200"
        preview={{
          visible: !!previewUrl,
          src: previewUrl,
          onVisibleChange: (value) => {
            if (!value) {
              setPreviewUrl('');
            }
          },
        }}
      />
      <Modal
        width={800}
        footer={false}
        onCancel={() => setVideoUrl('')}
        title="视频预览"
        open={!!videoUrl}
      >
        <video width="100%" height="100%" controls>
          <source src={videoUrl} type="video/mp4" />
          您的浏览器不支持视频标记。
        </video>
      </Modal>
    </>
  );
};

export default FileManagerChild;
