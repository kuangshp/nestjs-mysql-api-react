import React, { PropsWithChildren, useEffect, useState } from 'react';
import { Modal, Tree } from 'antd';
import { useSelector } from 'dva';
import { RoleState } from 'src/models/role';
import RoleAccessService from 'src/services/system/role-access';
import { getTreeList } from 'src/utils';
import { RoleMenusResDto } from './../types/role.menus.res.dto';

type Props = PropsWithChildren<{
  isRoleMenuVisible: boolean;
  setIsRoleMenuVisible: (flag: boolean) => void;
}>;

const RoleMenuModal = (props: Props) => {
  const { isRoleMenuVisible, setIsRoleMenuVisible } = props;
  const { roleRowData } = useSelector((state: any): RoleState => state.present.role);
  const [allMenus, setAllMenus] = useState<RoleMenusResDto[]>([]);
  const [menusTree, setMenusTree] = useState([]);
  const [checkIdList, setCheckIdList] = useState<string[]>([]);
  const [authChecked, setAuthChecked] = useState<string[]>([]);

  // 提交数据
  const handleOk = () => {
    const postAccessIdList = checkedParentId();
    console.log('提交', postAccessIdList);
  };

  // 取消提交
  const handleCancel = () => {
    console.log('取消');
    setIsRoleMenuVisible(false);
  };

  // 处理提交数据的时候没选中父节点
  const checkedParentId = () => {
    const resultList: string[] = [];
    const checkedKeys = checkIdList.concat(authChecked);
    for (const item of allMenus) {
      if (checkedKeys.includes(item.key)) {
        resultList.push(String(item.parentId));
      }
    }
    return Array.from(new Set(resultList.concat(checkedKeys))).filter(item => {
      return Boolean(item);
    });
  };
  // 请求授权数据
  const getAuthRoleMenusList = async (roleId: number) => {
    const result = await RoleAccessService.authMenusListByRoleId(roleId);
    setAuthChecked(['2']);
    console.log(result, '请求结婚');
  };

  // 获取全部数据
  const getAllMenusList = async () => {
    const result = await RoleAccessService.allMenusList();
    setAllMenus(result);
    setMenusTree(getTreeList(result));
  };

  useEffect(() => {
    if (roleRowData && Object.keys(roleRowData).length) {
      getAuthRoleMenusList(roleRowData.id);
      getAllMenusList();
    }
  }, [roleRowData]);

  // 点击切换选中的
  const onCheck = (checkedKeys: any) => {
    console.log('onCheck', checkedKeys);
    setCheckIdList(checkedKeys);
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
        defaultCheckedKeys={authChecked} // 默认选中的
        onCheck={onCheck}
        treeData={menusTree}
        selectable={false}
      />
    </Modal>
  );
};

export default RoleMenuModal;
