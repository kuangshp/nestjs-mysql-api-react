import React, { PropsWithChildren, useEffect, useState } from 'react';
import { Modal, Form, Input, Select } from 'antd';
import { useRequest } from 'ahooks';

const { Option } = Select;

const layout = {
  labelCol: { span: 4 },
  wrapperCol: { span: 20 },
};

type Props = PropsWithChildren<{
  isAccessModalVisible: boolean;
  setIsAccessModalVisible: (flag: boolean) => void;
  rowData?: any;
  loadData: () => void;
}>;

const AccessModal = (props: Props) => {
  const { isAccessModalVisible, setIsAccessModalVisible, rowData, loadData } = props;
  const [rowId, setRowId] = useState<number | null>();
  const [title, setTitle] = useState<string>('新增账号');
  const [form] = Form.useForm();

  // const { run, loading } = useRequest(createAccountHandler, {
  //   manual: true,
  //   onSuccess: result => {
  //     if (result) {
  //       setIsModifyVisible(false);
  //       // 告知父组件更新数据
  //       loadData();
  //       form.resetFields();
  //     }
  //   },
  // });

  // useEffect(() => {
  //   if (rowData) {
  //     const { username, mobile, email, status, platform } = rowData;
  //     form.setFieldsValue({
  //       username,
  //       mobile,
  //       email,
  //       status: String(status),
  //       platform: String(platform),
  //     });
  //     setTitle('编辑账号');
  //     setRowId(rowData.id);
  //   } else {
  //     setTitle('新增账号');
  //     form.resetFields();
  //     setRowId(null);
  //   }
  // }, [rowData]);
  // 提交
  const handleModifyOk = () => {
    // // 提交数据中不重复提交
    // if (loading || loading1) return;
    // form.validateFields(['username', 'mobile', 'email', 'status', 'platform']).then(values => {
    //   const { username, mobile, email, status, platform } = values;
    //   // 根据当前是否有id区分是新增还是编辑
    //   if (rowId) {
    //     run1(rowId, { username, mobile, email, status, platform });
    //   } else {
    //     // 提交数据
    //     run({ username, mobile, email, status, platform });
    //   }
    // });
  };

  // 取消
  const handleModifyCancel = () => {
    setIsAccessModalVisible(false);
    form.resetFields();
  };

  return (
    <>
      <Modal
        title={title}
        visible={isAccessModalVisible}
        onOk={handleModifyOk}
        onCancel={handleModifyCancel}
      >
        <Form form={form} {...layout}>
          <Form.Item
            name="username"
            label="用户名"
            rules={[
              {
                required: true,
                message: '请输入用户名',
              },
            ]}
          >
            <Input placeholder="请输入用户名" />
          </Form.Item>
        </Form>
      </Modal>
    </>
  );
};

export default AccessModal;
