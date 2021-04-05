import React, { PropsWithChildren, useEffect, useState } from 'react';
import { Modal, Tree } from 'antd';
import { useSelector } from 'dva';
import { RoleState } from 'src/models/role';
import RoleAccessService from 'src/services/system/role-access';
import { getTreeList } from 'src/utils';

type Props = PropsWithChildren<{
  isRoleMenuVisible: boolean;
  setIsRoleMenuVisible: (flag: boolean) => void;
}>;

const RoleMenuModal = (props: Props) => {
  const { isRoleMenuVisible, setIsRoleMenuVisible } = props;
  const { roleRowData } = useSelector((state: any): RoleState => state.present.role);
  const [allMenus, setAllMenus] = useState([]);
  const [menusTree, setMenusTree] = useState([]);
  const handleOk = () => {
    console.log('提交');
  };
  const handleCancel = () => {
    console.log('取消');
    setIsRoleMenuVisible(false);
  };

  // 请求授权数据
  const getAuthRoleMenusList = async (roleId: number) => {
    const result = await RoleAccessService.authMenusListByRoleId(roleId);
    console.log(result, '请求结婚');
  };

  // 获取全部数据
  const getAllMenusList = async () => {
    const result = await RoleAccessService.allMenusList();
    setMenusTree(getTreeList(result));
  };

  useEffect(() => {
    if (roleRowData && Object.keys(roleRowData).length) {
      // getAuthRoleMenusList(roleRowData.id);
      getAllMenusList();
    }
  }, [roleRowData]);

  const onCheck = (checkedKeys: any) => {
    console.log('onCheck', checkedKeys);
  };

  return (
    <Modal
      title="给角色分配菜单"
      visible={isRoleMenuVisible}
      onOk={handleOk}
      onCancel={handleCancel}
    >
      <Tree
        checkable
        // defaultCheckedKeys={['0-0-0', '0-0-1']} // 默认选中的
        onCheck={onCheck}
        treeData={menusTree}
      />
    </Modal>
  );
};

export default RoleMenuModal;
