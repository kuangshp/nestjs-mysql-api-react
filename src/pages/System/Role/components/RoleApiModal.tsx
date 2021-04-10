import React, { PropsWithChildren, useEffect, useState } from 'react';
import { Modal, Checkbox, Row, Col, Form } from 'antd';
import { useRequest } from 'ahooks';
import { useSelector } from 'dva';
import RoleAccessService from 'src/services/system/role-access';
import { RoleMenuApiReqDto } from './../types/role.menu.api.req.dto';
import { RoleState } from 'src/models/system/role';
import { RoleApiResDto } from '../types/role.api.res.dto';
import { RoleMenuAuthResDto } from '../types/role.menu.auth.res.dto';

type Props = PropsWithChildren<{
  isRoleApiVisible: boolean;
  setIsRoleApiVisible: (isShow: boolean) => void;
}>;

// 包装提交数据
const dispatchApiToRoleHandler = async (roleId: number, postData: RoleMenuApiReqDto) => {
  const result = await RoleAccessService.dispatchMenuApiToRole(roleId, postData);
  if (!result) return;
  return new Promise(resolve => {
    resolve(true);
  });
};

const RoleApiModal = (props: Props) => {
  const { isRoleApiVisible, setIsRoleApiVisible } = props;
  // 全部的接口ID
  const [allApiList, setAllApiList] = useState<RoleApiResDto[]>([]);
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

  // 串行获取数据
  const getData = async (roleId: number) => {
    const [allApiList, authApiList] = await Promise.all([
      RoleAccessService.allApiList(),
      RoleAccessService.authApiListByRoleId(roleId),
    ]);
    setAllApiList(allApiList);
    const ids = authApiList.map((item: RoleMenuAuthResDto) => item.accessId);
    form.setFieldsValue({ accessApi: ids });
  };

  useEffect(() => {
    if (roleRowData && Object.keys(roleRowData).length) {
      getData(roleRowData.id);
    }
  }, [roleRowData]);

  // 提交
  const handleOk = () => {
    if (loading) return;
    form.validateFields(['accessApi']).then(values => {
      const { accessApi } = values;
      run(roleRowData.id, {
        accessList: accessApi,
        type: 3,
      });
    });
  };
  // 取消
  const handleCancel = () => {
    form.resetFields();
    setIsRoleApiVisible(false);
  };

  return (
    <Modal
      title="给角色分配接口"
      visible={isRoleApiVisible}
      onOk={handleOk}
      onCancel={handleCancel}
    >
      <Form form={form}>
        <Form.Item name="accessApi">
          <Checkbox.Group style={{ width: '100%', paddingTop: 10 }}>
            <Row>
              {allApiList.map((item: RoleApiResDto) => {
                return (
                  <Col span={12} key={item.id}>
                    <Checkbox value={item.id} style={{ lineHeight: '32px' }}>
                      {item.apiName}
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

export default RoleApiModal;
