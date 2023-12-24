import { TreeMenuType, getTreeMenus } from '@/services/menuManaget';
import { bindPermission } from '@/services/roleManager';
import { Modal, ModalProps, Tree, message } from 'antd';
import type { TreeProps } from 'antd/es/tree';
import { useEffect, useState } from 'react';
const MenuAuth: React.FC<
  ModalProps & { roleId: string; permissionIdList: React.Key[] }
> = ({ roleId, permissionIdList, onOk = () => {}, ...props }) => {
  const [treeData, setTreeData] = useState<TreeMenuType[]>([]);

  const [checkedKeys, setCheckedKeys] = useState<React.Key[]>([]);

  useEffect(() => {
    (async () => {
      const res = await getTreeMenus();
      setTreeData(res?.data || []);
    })();
  }, []);

  useEffect(() => {
    setCheckedKeys(permissionIdList);
    return () => {};
  }, [roleId]);

  const onCheck: TreeProps['onCheck'] = (checkedKeysValue: any) => {
    setCheckedKeys(checkedKeysValue?.checked || []);
  };

  return (
    <Modal
      width={800}
      title="绑定菜单"
      destroyOnClose={true}
      forceRender={false}
      onOk={async (e) => {
        const res = await bindPermission(roleId, checkedKeys);
        if (res.code === 0) {
          onOk(e);
        } else {
          message.error(res.msg);
        }
      }}
      {...props}
    >
      <div style={{ height: 400, overflowY: 'scroll' }}>
        <Tree
          defaultExpandAll
          treeData={treeData}
          multiple={true}
          checkable
          checkStrictly
          fieldNames={{ title: 'name', key: 'id' }}
          onCheck={onCheck}
          checkedKeys={checkedKeys}
        />
      </div>
    </Modal>
  );
};

export default MenuAuth;
