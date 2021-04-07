import React, { PropsWithChildren, useEffect, useState } from 'react';
import { Modal, Tree } from 'antd';
import { useSelector } from 'dva';
import { RoleState } from 'src/models/system/role';
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
const dispatchMenuApiToRoleHandler = async (roleId: number, postData: RoleMenuApiReqDto) => {
  const result = await RoleAccessService.dispatchMenuApiToRole(roleId, postData);
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

  const { run, loading } = useRequest(dispatchMenuApiToRoleHandler, {
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
    run(roleRowData.id, {
      type: 2,
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
    return Array.from(new Set(resultList.concat(checkedKeys))).filter(item =>
      Boolean(Number(item))
    );
  };
  // 反填删除顶级节点(因为就算是该下面的全部选中了，顶级会自动选中)
  const fullCheckNodeId = (
    allMenus: RoleMenusResDto[],
    fetchCheckedList: RoleMenuAuthResDto[]
  ): string[] => {
    const checkedList = fetchCheckedList.map((item: RoleMenuAuthResDto) => item.accessId);
    for (const item of allMenus) {
      if (item.parentId === 0) {
        // 判断是否顶层菜单
        const isTop = allMenus.find(it => it.parentId == item.id);
        // 当前包括在此项中且父节点是0的时候且没有子节点的时候删除
        if (isTop) {
          if (checkedList.includes(item.id) && !item.parentId) {
            const index = checkedList.findIndex((it: number) => it == item.id);
            checkedList.splice(index, 1);
          }
        }
      }
    }
    return checkedList.map(item => String(item));
  };

  // 串行获取数据
  const getData = async (roleId: number) => {
    const [allMenus, authMenus] = await Promise.all([
      RoleAccessService.allMenusList(),
      RoleAccessService.authMenusListByRoleId(roleId),
    ]);
    setAllMenus(allMenus);
    setMenusTree(getTreeList(allMenus));
    if (authMenus && authMenus.length) {
      // 手动修复删除不是全部选中父节点
      console.log(fullCheckNodeId(allMenus, authMenus), '删除后');
      setAuthChecked(fullCheckNodeId(allMenus, authMenus));
    } else {
      setAuthChecked([]);
    }
  };

  useEffect(() => {
    setAuthChecked([]);
    if (roleRowData && Object.keys(roleRowData).length) {
      getData(roleRowData.id);
    }
  }, [roleRowData]);

  // 点击切换选中的
  const onCheck = (checkedKeys: any) => {
    console.log(checkedKeys, '??');
    setCheckIdList(checkedKeys);
    setAuthChecked(checkedKeys);
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
        key="key"
        checkedKeys={authChecked} // 默认选中的
        onCheck={onCheck}
        treeData={menusTree}
        selectable={false}
      />
    </Modal>
  );
};

export default RoleMenuModal;
