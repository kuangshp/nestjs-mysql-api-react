import React, { PropsWithChildren, useEffect, useState } from 'react';
import { Modal, Form, Input, Select } from 'antd';
import { AccountResDto } from '../types/account.list.res.dto';
const { Option } = Select;

const layout = {
  labelCol: { span: 4 },
  wrapperCol: { span: 20 },
};

type Props = PropsWithChildren<{
  isModifyVisible: boolean;
  setIsModifyVisible: (isShow: boolean) => void;
  rowData?: AccountResDto;
}>;

const AccountModal = (props: Props) => {
  const { isModifyVisible, setIsModifyVisible, rowData } = props;
  const [title, setTitle] = useState<string>('新增账号');
  const [form] = Form.useForm();

  useEffect(() => {
    if (rowData) {
      const { username, mobile, email, status, platform } = rowData;
      console.log(rowData);
      form.setFieldsValue({
        username,
        mobile,
        email,
        status: String(status),
        platform: String(platform),
      });
      setTitle('编辑账号');
    } else {
      setTitle('新增账号');
      form.resetFields();
    }
  }, [rowData]);

  // 提交
  const handleModifyOk = () => {
    console.log('编辑', form);
    setIsModifyVisible(false);
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
          <Form.Item name="username" label="用户名" rules={[{ required: true }]}>
            <Input placeholder="请输入用户名" />
          </Form.Item>
          <Form.Item name="mobile" label="手机号码">
            <Input placeholder="请输入手机号码" />
          </Form.Item>
          <Form.Item name="email" label="邮箱">
            <Input placeholder="请输入邮箱" />
          </Form.Item>
          <Form.Item name="status" label="状态">
            <Select placeholder="请选择状态" allowClear>
              <Option value="1">正常</Option>
              <Option value="0">禁用</Option>
            </Select>
          </Form.Item>
          <Form.Item name="platform" label="平台" rules={[{ required: true }]}>
            <Select placeholder="请选择平台" allowClear>
              <Option value="1">正常</Option>
              <Option value="0">禁用</Option>
            </Select>
          </Form.Item>
        </Form>
      </Modal>
    </>
  );
};

export default AccountModal;
