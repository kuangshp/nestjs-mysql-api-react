import React, { PropsWithChildren, useEffect, useState } from 'react';
import { Modal, Checkbox, Row, Col, Form, message } from 'antd';
import { useRequest } from 'ahooks';
import { useSelector } from 'dva';
import RoleAccessService from 'src/services/system/role-access';
import { RoleMenuApiReqDto } from './../types/role.menu.api.req.dto';
import { RoleState } from 'src/models/role';

type Props = PropsWithChildren<{
  isRoleApiVisible: boolean;
  setIsRoleApiVisible: (isShow: boolean) => void;
}>;

// 包装提交数据
const dispatchApiToRoleHandler = async (postData: RoleMenuApiReqDto) => {
  const result = await RoleAccessService.dispatchMenuToRole(postData);
  if (!result) return;
  return new Promise(resolve => {
    resolve(true);
  });
};

const RoleApiModal = (props: Props) => {
  const { isRoleApiVisible, setIsRoleApiVisible } = props;
  // 全部的接口ID
  // const [allRoleList, setAllRoleIdList] = useState<AccountRoleDto[]>([]);
  // const { accountRowData } = useSelector((state: any): AccountState => state.present.account);
  const { roleRowData } = useSelector((state: any): RoleState => state.present.role);
  const [form] = Form.useForm();

  const { run, loading } = useRequest(dispatchApiToRoleHandler, {
    manual: true,
    onSuccess: result => {
      if (result) {
        setIsRoleApiVisible(false);
        form.resetFields();
      }
    },
  });

  // 获取全部的接口(包括未授权的)
  const getRoleList = async () => {
    // const result = await AccountRoleService.accountRoleList();
    // if (!result) return;
    // setAllRoleIdList(result);
  };

  // 获取已经授权的接口ID
  const accountHasRoleList = async () => {
    // const result = await AccountRoleService.accountRoleByAccountId(accountRowData.id);
    // if (!result) return;
    // const ids: number[] = result.map((item: AccountRoleResDto) => item.roleId);
    // // 给表单赋值(已经授权的)
    // form.setFieldsValue({
    //   roles: ids,
    // });
  };

  useEffect(() => {
    if (roleRowData && Object.keys(roleRowData).length) {
      accountHasRoleList();
      getRoleList();
    }
  }, [roleRowData]);

  // 提交
  const handleOk = () => {
    if (loading) return;
    form.validateFields(['roles']).then(values => {
      const { roles } = values;
      if (!roles.length) {
        message.error('必须选中一个接口');
        return;
      }
      // run({
      //   accountId: accountRowData.id,
      //   roleList: roles,
      // });
    });
  };
  // 取消
  const handleCancel = () => {
    form.resetFields();
    setIsRoleApiVisible(false);
  };

  return (
    <Modal title="分配接口" visible={isRoleApiVisible} onOk={handleOk} onCancel={handleCancel}>
      <Form form={form}>
        <Form.Item name="roles">
          <Checkbox.Group style={{ width: '100%', paddingTop: 10 }}>
            <Row>
              {/* {allRoleList.map((item: AccountRoleDto) => {
                return (
                  <Col span={12} key={item.id}>
                    <Checkbox value={item.id} style={{ lineHeight: '32px' }}>
                      {item.name}
                    </Checkbox>
                  </Col>
                );
              })} */}
            </Row>
          </Checkbox.Group>
        </Form.Item>
      </Form>
    </Modal>
  );
};

export default RoleApiModal;
