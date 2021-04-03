import React, { PropsWithChildren } from 'react';
import { Modal, Form, Input } from 'antd';
import { useRequest } from 'ahooks';
import AccountService from 'src/services/system/account';
import { ModifyPasswordDto } from 'src/pages/System/Account/types/modify.password.dto';

const layout = {
  labelCol: { span: 6 },
  wrapperCol: { span: 18 },
};

type Props = PropsWithChildren<{
  isModifyVisible: boolean;
  setIsModifyVisible: (isShow: boolean) => void;
}>;

// 包装数据
const modifyPasswordHandler = async (params: ModifyPasswordDto): Promise<boolean | null> => {
  const result = await AccountService.modifyPassword(params);
  if (!result) return null;
  return new Promise(resolve => {
    resolve(true);
  });
};

const ModifyPasswordModal = (props: Props) => {
  const { isModifyVisible, setIsModifyVisible } = props;
  const [form] = Form.useForm();
  const { run } = useRequest(modifyPasswordHandler, {
    manual: true,
    onSuccess: result => {
      if (result) {
        setIsModifyVisible(false);
        form.resetFields();
      }
    },
  });

  // 提交修改密码
  const handleModifyOk = () => {
    form.validateFields(['password', 'newPassword', 'repPassword']).then(values => {
      run({
        password: values.password,
        newPassword: values.newPassword,
        repPassword: values.repPassword,
      });
    });
  };

  const handleModifyCancel = () => {
    setIsModifyVisible(false);
    form.resetFields();
  };

  return (
    <Modal
      title="修改密码"
      visible={isModifyVisible}
      onOk={handleModifyOk}
      onCancel={handleModifyCancel}
    >
      <Form form={form} {...layout}>
        <Form.Item
          name="password"
          label="旧密码"
          rules={[
            {
              required: true,
              message: '请输入旧密码',
            },
          ]}
        >
          <Input.Password placeholder="请输入旧密码" />
        </Form.Item>
        <Form.Item
          name="newPassword"
          label="新密码"
          rules={[
            {
              required: true,
              message: '请输入新密码',
            },
          ]}
        >
          <Input.Password placeholder="请输入新密码" />
        </Form.Item>
        <Form.Item
          name="repPassword"
          label="重复新密码"
          rules={[
            {
              required: true,
              message: '请再次输入新密码',
            },
          ]}
        >
          <Input.Password placeholder="请再次输入新密码" />
        </Form.Item>
      </Form>
    </Modal>
  );
};

export default ModifyPasswordModal;
