import React, { PropsWithChildren, useEffect, useState } from 'react';
import { Modal, Form, Input, Select } from 'antd';
import { useRequest } from 'ahooks';
import AccessService from 'src/services/system/access';
import { AccessReqDto } from '../types/access.req.dto';

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

// 包装提交数据
const createAccessHandler = async (postData: AccessReqDto) => {
  const result = await AccessService.createAccess(postData);
  if (!result) return;
  return new Promise(resolve => {
    resolve(true);
  });
};

const AccessModuleModal = (props: Props) => {
  const { isAccessModalVisible, setIsAccessModalVisible, rowData, loadData } = props;
  const [rowId, setRowId] = useState<number | null>();
  const [title, setTitle] = useState<string>('新增账号');
  const [form] = Form.useForm();

  const { run, loading } = useRequest(createAccessHandler, {
    manual: true,
    onSuccess: result => {
      if (result) {
        setIsAccessModalVisible(false);
        // 告知父组件更新数据
        loadData();
        form.resetFields();
      }
    },
  });

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
    form.validateFields(['username', 'mobile', 'email', 'status', 'platform']).then(values => {
      const { moduleName, icon, sort, status, description } = values;
      // 根据当前是否有id区分是新增还是编辑
      if (rowId) {
        // run1(rowId, { username, mobile, email, status, platform });
      } else {
        // 提交数据
        run({ type: 1, moduleName, icon, sort, status, description });
      }
    });
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
            name="moduleName"
            label="模块名称"
            rules={[
              {
                required: true,
                message: '请输入模块名称',
              },
            ]}
          >
            <Input placeholder="请输入模块名称" />
          </Form.Item>
          <Form.Item name="icon" label="模块图标">
            <Input placeholder="请输入模块图标" />
          </Form.Item>
          <Form.Item name="status" label="状态">
            <Select placeholder="请选择状态" allowClear>
              <Option value="1">正常</Option>
              <Option value="0">禁用</Option>
            </Select>
          </Form.Item>
          <Form.Item name="sort" label="模块排序">
            <Input placeholder="请输入模块排序" />
          </Form.Item>
          <Form.Item name="description" label="描素">
            <Input.TextArea />
          </Form.Item>
        </Form>
      </Modal>
    </>
  );
};

export default AccessModuleModal;
