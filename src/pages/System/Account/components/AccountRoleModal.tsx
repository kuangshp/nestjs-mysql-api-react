import React, { PropsWithChildren, useEffect, useMemo, useState } from 'react';
import { Modal, Checkbox, Row, Col } from 'antd';
import { AccountResDto } from '../types/account.res.dto';
import AccountRoleService from 'src/services/system/account-role';
import { useSelections } from 'ahooks';
import { AccountRoleDto, AccountRoleResDto } from '../types/account.role.res.dto';

type Props = PropsWithChildren<{
  isRoleModifyVisible: boolean;
  setIsRoleModifyVisible: (isShow: boolean) => void;
  loadData: () => void;
  rowData: AccountResDto;
}>;

const AccountRoleModal = (props: Props) => {
  const { isRoleModifyVisible, setIsRoleModifyVisible, rowData } = props;
  // 全部的角色ID
  const [roleIdList, setRoleIdList] = useState<number[]>([]);
  const [roleMap, setRoleMap] = useState<Record<string, any>>();
  // 已经授权的角色ID
  const [authRoleList, setAuthRoleList] = useState<number[]>([]);
  // 全部的角色ID包括未授权的(给第三方组件用的)
  const roleList = useMemo(() => {
    return roleIdList;
  }, [roleIdList, authRoleList]);

  const { selected, allSelected, isSelected, toggle, toggleAll, partiallySelected } = useSelections(
    roleList,
    authRoleList
  );
  // const {
  //   selected,
  //   allSelected,
  //   isSelected,
  //   toggle,
  //   toggleAll,
  //   partiallySelected,
  // } = useSelections(roleList, [1]);

  // 将数组转换为对象
  const roleListToMap = (accountRoleList: AccountRoleDto[]): Record<number, string> => {
    return accountRoleList.reduce((pre, cur) => {
      return { ...pre, [cur['id']]: cur['name'] };
    }, {});
  };
  // 获取全部的角色
  const getRoleList = async () => {
    const result = await AccountRoleService.accountRoleList();
    if (!result) return;
    const roleIdList = result.map((item: AccountRoleDto) => item.id);
    console.log(roleIdList, '11');
    setRoleMap(roleListToMap(result));
    setRoleIdList(roleIdList);
    console.log(roleIdList, '22');
  };

  // 获取已经授权的角色ID
  const accountHasRoleList = async () => {
    const result = await AccountRoleService.accountRoleByAccountId(rowData.id);
    if (!result) return;
    const ids: number[] = result.map((item: AccountRoleResDto) => item.roleId);
    console.log(ids, 'aaa');
    setAuthRoleList(ids);
    console.log(authRoleList, '==已经授权的=>');
  };

  useEffect(() => {
    accountHasRoleList();
    getRoleList();
  }, [rowData]);

  const handleModifyOk = () => {
    console.log(selected, '===>');
    setIsRoleModifyVisible(false);
  };
  const handleModifyCancel = () => {
    setIsRoleModifyVisible(false);
  };
  return (
    <Modal
      title="分配角色"
      visible={isRoleModifyVisible}
      onOk={handleModifyOk}
      onCancel={handleModifyCancel}
    >
      <div style={{ borderBottom: '1px solid #E9E9E9', padding: '0 0 10px' }}>
        <Checkbox checked={allSelected} onClick={toggleAll} indeterminate={partiallySelected}>
          全选
        </Checkbox>
      </div>
      <Row style={{ padding: '10px 0' }}>
        {roleList.map((o: number) => (
          <Col span={12} key={o}>
            <Checkbox checked={isSelected(o)} onClick={() => toggle(o)}>
              {roleMap && roleMap[o]}
            </Checkbox>
          </Col>
        ))}
      </Row>
    </Modal>
  );
};

export default AccountRoleModal;
