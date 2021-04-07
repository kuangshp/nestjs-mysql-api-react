import React, { PropsWithChildren, useEffect, useState } from 'react';
import { Modal, Checkbox, Row, Col, Form, message } from 'antd';
import AccountRoleService from 'src/services/system/account-role';
import { AccountRoleDto, AccountRoleResDto } from '../types/account.role.res.dto';
import { DispatchAccountRoleDto } from '../types/dispatch.account.role.dto';
import { useRequest } from 'ahooks';
import { useSelector } from 'dva';
import { AccountState } from 'src/models/system/account';

type Props = PropsWithChildren<{
  isRoleModifyVisible: boolean;
  setIsRoleModifyVisible: (isShow: boolean) => void;
  loadData: () => void;
}>;

// 包装给账号分配角色
const dispatchAccountRoleHandler = async (postData: DispatchAccountRoleDto) => {
  const result = await AccountRoleService.dispatchAccountRole(postData);
  if (!result) return;
  return new Promise(resolve => {
    resolve(true);
  });
};

const AccountRoleModal = (props: Props) => {
  const { isRoleModifyVisible, setIsRoleModifyVisible, loadData } = props;
  // 全部的角色ID
  const [allRoleList, setAllRoleIdList] = useState<AccountRoleDto[]>([]);
  const { accountRowData } = useSelector((state: any): AccountState => state.present.account);
  const [form] = Form.useForm();

  const { run, loading } = useRequest(dispatchAccountRoleHandler, {
    manual: true,
    onSuccess: result => {
      if (result) {
        setIsRoleModifyVisible(false);
        // 告知父组件更新数据
        loadData();
        form.resetFields();
      }
    },
  });

  // 获取全部的角色(包括未授权的)
  const getRoleList = async () => {
    const result = await AccountRoleService.accountRoleList();
    if (!result) return;
    setAllRoleIdList(result);
  };

  // 获取已经授权的角色ID
  const accountHasRoleList = async () => {
    const result = await AccountRoleService.accountRoleByAccountId(accountRowData.id);
    if (!result) return;
    const ids: number[] = result.map((item: AccountRoleResDto) => item.roleId);
    // 给表单赋值(已经授权的)
    form.setFieldsValue({
      roles: ids,
    });
  };

  useEffect(() => {
    if (accountRowData && Object.keys(accountRowData).length) {
      accountHasRoleList();
      getRoleList();
    }
  }, [accountRowData]);

  // 提交
  const handleOk = () => {
    if (loading) return;
    form.validateFields(['roles']).then(values => {
      const { roles } = values;
      if (!roles.length) {
        message.error('必须选中一个角色');
        return;
      }
      run({
        accountId: accountRowData.id,
        roleList: roles,
      });
    });
  };
  // 取消
  const handleCancel = () => {
    form.resetFields();
    setIsRoleModifyVisible(false);
  };

  return (
    <Modal title="分配角色" visible={isRoleModifyVisible} onOk={handleOk} onCancel={handleCancel}>
      <Form form={form}>
        <Form.Item name="roles">
          <Checkbox.Group style={{ width: '100%', paddingTop: 10 }}>
            <Row>
              {allRoleList.map((item: AccountRoleDto) => {
                return (
                  <Col span={12} key={item.id}>
                    <Checkbox value={item.id} style={{ lineHeight: '32px' }}>
                      {item.name}
                    </Checkbox>
                  </Col>
                );
              })}
            </Row>
          </Checkbox.Group>
        </Form.Item>
      </Form>
    </Modal>
  );
};

export default AccountRoleModal;
