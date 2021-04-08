import React, { PropsWithChildren, useEffect, useState } from 'react';
import { Modal, Form, Input, Select } from 'antd';
import { useRequest } from 'ahooks';
import AccessService from 'src/services/system/access';
import { AccessReqDto } from '../types/access.req.dto';
import { AccessTypeEnum } from 'src/enums';
import { useSelector } from 'dva';
import { AccessState } from 'src/models/system/access';

const { Option } = Select;

const layout = {
  labelCol: { span: 6 },
  wrapperCol: { span: 18 },
};

type Props = PropsWithChildren<{
  isAccessModalVisible: boolean;
  setIsAccessModalVisible: (flag: boolean) => void;
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

const modifyAccessHandler = async (id: number, params: AccessReqDto) => {
  const result = await AccessService.modifyAccessById(id, params);
  if (!result) return;
  return new Promise(resolve => {
    resolve(true);
  });
};

const AccessModuleModal = (props: Props) => {
  const { isAccessModalVisible, setIsAccessModalVisible, loadData } = props;
  const [title, setTitle] = useState<string>('新增模块');
  const { accessRowData } = useSelector((state: any): AccessState => state.present.access);
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

  const { run: run1, loading: loading1 } = useRequest(modifyAccessHandler, {
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

  useEffect(() => {
    if (accessRowData && Object.keys(accessRowData).length) {
      const { moduleName, icon, sort, status, description } = accessRowData;
      form.setFieldsValue({
        moduleName,
        icon,
        sort,
        description,
        status: String(status),
      });
      setTitle('编辑模块');
    } else {
      setTitle('新增模块');
      form.resetFields();
    }
  }, [accessRowData]);
  // 提交
  const handleModifyOk = () => {
    // 提交数据中不重复提交
    if (loading || loading1) return;
    form
      .validateFields(['moduleName', 'url', 'icon', 'sort', 'status', 'description'])
      .then(values => {
        const { moduleName, url, icon, sort, status, description } = values;
        // 根据当前是否有id区分是新增还是编辑
        const rowId = accessRowData && Object.keys(accessRowData).length ? accessRowData.id : null;
        if (rowId) {
          run1(rowId, {
            type: AccessTypeEnum.MODULE,
            moduleName,
            url,
            icon,
            sort,
            status,
            description,
          });
        } else {
          // 提交数据
          run({ type: AccessTypeEnum.MODULE, moduleName, url, icon, sort, status, description });
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
          <Form.Item
            name="url"
            label="模块url地址"
            rules={[
              {
                required: true,
                message: '请输入模块url地址',
              },
            ]}
          >
            <Input placeholder="请输入模块url地址" />
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
          <Form.Item name="description" label="描述">
            <Input.TextArea />
          </Form.Item>
        </Form>
      </Modal>
    </>
  );
};

export default AccessModuleModal;
