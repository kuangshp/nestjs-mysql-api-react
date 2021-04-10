import React, { PropsWithChildren, useEffect, useState } from 'react';
import { Modal, Form, Input, Select } from 'antd';
import { useRequest } from 'ahooks';

import RoleService from 'src/services/system/role';
import { useSelector } from 'dva';
import { RoleState } from 'src/models/system/role';

const { Option } = Select;

const layout = {
  labelCol: { span: 6 },
  wrapperCol: { span: 18 },
};

type Props = PropsWithChildren<{
  isModifyVisible: boolean;
  setIsModifyVisible: (isShow: boolean) => void;
  loadData: () => void;
}>;

// 包装提交数据
const createRoleHandler = async (postData: any) => {
  const result = await RoleService.createRole(postData);
  if (!result) return;
  return new Promise(resolve => {
    resolve(true);
  });
};

const modifyRoleHandler = async (id: number, params: any) => {
  const result = await RoleService.modifyRoleById(id, params);
  if (!result) return;
  return new Promise(resolve => {
    resolve(true);
  });
};

const RoleModal = (props: Props) => {
  const { isModifyVisible, setIsModifyVisible, loadData } = props;
  const [title, setTitle] = useState<string>('新增角色');
  const { roleRowData } = useSelector((state: any): RoleState => state.present.role);
  const [form] = Form.useForm();

  const { run, loading } = useRequest(createRoleHandler, {
    manual: true,
    onSuccess: result => {
      if (result) {
        setIsModifyVisible(false);
        // 告知父组件更新数据
        loadData();
        form.resetFields();
      }
    },
  });

  const { run: run1, loading: loading1 } = useRequest(modifyRoleHandler, {
    manual: true,
    onSuccess: result => {
      if (result) {
        setIsModifyVisible(false);
        // 告知父组件更新数据
        loadData();
        form.resetFields();
      }
    },
  });

  useEffect(() => {
    if (roleRowData && Object.keys(roleRowData).length) {
      const { name, description, status, isDefault } = roleRowData;
      form.setFieldsValue({
        name,
        description,
        status: String(status),
        isDefault: String(isDefault),
      });
      setTitle('编辑角色');
    } else {
      setTitle('新增角色');
      form.resetFields();
    }
  }, [roleRowData]);

  // 提交
  const handleModifyOk = () => {
    // 提交数据中不重复提交
    if (loading || loading1) return;
    form.validateFields(['name', 'description', 'isDefault', 'status']).then(values => {
      // 根据当前是否有id区分是新增还是编辑
      const rowId = roleRowData?.id;
      if (rowId) {
        run1(rowId, values);
      } else {
        // 提交数据
        run(values);
      }
    });
  };

  // 取消
  const handleModifyCancel = () => {
    setIsModifyVisible(false);
    form.resetFields();
  };

  return (
    <>
      <Modal
        title={title}
        visible={isModifyVisible}
        onOk={handleModifyOk}
        onCancel={handleModifyCancel}
      >
        <Form form={form} {...layout}>
          <Form.Item
            name="name"
            label="角色名称"
            rules={[
              {
                required: true,
                message: '请输入角色名称',
              },
            ]}
          >
            <Input placeholder="请输入角色名称" />
          </Form.Item>
          <Form.Item name="status" label="状态">
            <Select placeholder="请选择状态" allowClear>
              <Option value="1">正常</Option>
              <Option value="0">禁用</Option>
            </Select>
          </Form.Item>
          <Form.Item name="isDefault" label="是否默认角色">
            <Select placeholder="请选择角色类型" allowClear>
              <Option value="0">正常</Option>
              <Option value="1">默认</Option>
            </Select>
          </Form.Item>
          <Form.Item name="description" label="描述">
            <Input.TextArea />
          </Form.Item>
        </Form>
      </Modal>
    </>
  );
};

export default RoleModal;
