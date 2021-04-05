import React, { PropsWithChildren, useEffect, useState } from 'react';
import { Modal, Tree } from 'antd';
import { useSelector } from 'dva';
import { RoleState } from 'src/models/role';
import RoleAccessService from 'src/services/system/role-access';
import { getTreeList } from 'src/utils';
import { RoleMenusResDto } from './../types/role.menus.res.dto';
import { RoleMenuApiReqDto } from './../types/role.menu.api.req.dto';
import { useRequest } from 'ahooks';
import { RoleMenuAuthResDto } from '../types/role.menu.auth.res.dto';

type Props = PropsWithChildren<{
  isRoleMenuVisible: boolean;
  setIsRoleMenuVisible: (flag: boolean) => void;
}>;

// 包装提交数据
const dispatchMenuToRoleHandler = async (postData: RoleMenuApiReqDto) => {
  const result = await RoleAccessService.dispatchMenuToRole(postData);
  if (!result) return;
  return new Promise(resolve => {
    resolve(true);
  });
};
const RoleMenuModal = (props: Props) => {
  const { isRoleMenuVisible, setIsRoleMenuVisible } = props;
  const { roleRowData } = useSelector((state: any): RoleState => state.present.role);
  const [allMenus, setAllMenus] = useState<RoleMenusResDto[]>([]);
  const [menusTree, setMenusTree] = useState([]);
  const [checkIdList, setCheckIdList] = useState<string[]>([]);
  const [authChecked, setAuthChecked] = useState<string[]>([]);

  const { run, loading } = useRequest(dispatchMenuToRoleHandler, {
    manual: true,
    onSuccess: result => {
      if (result) {
        setIsRoleMenuVisible(false);
      }
    },
  });
  // 提交数据
  const handleOk = () => {
    if (loading) return;
    const postAccessIdList = checkedParentId();
    run({
      type: 2,
      roleId: roleRowData.id,
      accessList: postAccessIdList,
    });
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
  // 反填删除顶级节点(因为就算是该下面的全部选中了，顶级会自动选中)
  const fullCheckNodeId = (fetchCheckedList: RoleMenuAuthResDto[]): string[] => {
    const checkedList = fetchCheckedList.map((item: RoleMenuAuthResDto) => item.accessId);
    for (const item of allMenus) {
      // 当前包括在此项中且父节点是null的时候，删除
      if (checkedList.includes(item.id) && !item.parentId) {
        const index = checkedList.findIndex((it: number) => it == item.id);
        checkedList.splice(index, 1);
      }
    }
    return checkedList.map(item => String(item));
  };

  // 请求授权数据
  const getAuthRoleMenusList = async (roleId: number) => {
    const result: RoleMenuAuthResDto[] = await RoleAccessService.authMenusListByRoleId(roleId);
    console.log(result, '删除前');
    if (result && result.length) {
      // 手动修复删除不是全部选中父节点
      console.log(fullCheckNodeId(result), '删除后');
      setAuthChecked(fullCheckNodeId(result));
    } else {
      setAuthChecked([]);
    }
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
    setCheckIdList(checkedKeys);
  };

  return (
    <Modal
      title="给角色分配菜单"
      visible={isRoleMenuVisible}
      onOk={handleOk}
      onCancel={handleCancel}
    >
      {authChecked}
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
