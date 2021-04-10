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
  isAccessApiVisible: boolean;
  setIsAccessApiVisible: (flag: boolean) => void;
  isNew?: boolean;
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

const AccessApiModal = (props: Props) => {
  const { isAccessApiVisible, setIsAccessApiVisible, loadData, isNew } = props;
  const { accessRowData } = useSelector((state: any): AccessState => state.present.access);
  const [title, setTitle] = useState<string>('新增API');
  const [form] = Form.useForm();

  const { run, loading } = useRequest(createAccessHandler, {
    manual: true,
    onSuccess: result => {
      if (result) {
        setIsAccessApiVisible(false);
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
        setIsAccessApiVisible(false);
        // 告知父组件更新数据
        loadData();
        form.resetFields();
      }
    },
  });

  useEffect(() => {
    if (accessRowData && Object.keys(accessRowData).length) {
      if (!isNew) {
        const { actionName, url, icon, sort, status, description, method, apiName } = accessRowData;
        form.setFieldsValue({
          actionName,
          url,
          icon,
          sort,
          description,
          method,
          apiName,
          status: String(status),
        });
        setTitle('编辑API');
      } else {
        const { actionName } = accessRowData;
        form.setFieldsValue({
          actionName,
        });
        setTitle('新增API');
      }
    }
  }, [accessRowData]);
  // 提交
  const handleModifyOk = () => {
    // 提交数据中不重复提交
    if (loading || loading1) return;
    form
      .validateFields(['actionName', 'url', 'method', 'sort', 'status', 'description', 'apiName'])
      .then(values => {
        const { url, method, sort, status, description, apiName } = values;
        const parentId = isNew ? accessRowData!.id : accessRowData!.parentId;
        // 编辑提交
        if (!isNew) {
          run1(Number(accessRowData!.id), {
            type: AccessTypeEnum.API,
            url,
            method,
            sort,
            status,
            description,
            apiName,
          });
        } else {
          // 提交新增数据
          run({
            type: AccessTypeEnum.API,
            parentId,
            url,
            method,
            sort,
            status,
            description,
            apiName,
          });
        }
      });
  };

  // 取消
  const handleModifyCancel = () => {
    setIsAccessApiVisible(false);
    form.resetFields();
  };

  return (
    <>
      <Modal
        title={title}
        visible={isAccessApiVisible}
        onOk={handleModifyOk}
        onCancel={handleModifyCancel}
      >
        <Form form={form} {...layout}>
          <Form.Item name="actionName" label="菜单名称">
            <Input placeholder="请输入菜单名称" disabled />
          </Form.Item>
          <Form.Item
            name="apiName"
            label="接口名称"
            rules={[
              {
                required: true,
                message: '请输入接口名称',
              },
            ]}
          >
            <Input placeholder="请输入接口名称" />
          </Form.Item>
          <Form.Item
            name="url"
            label="url地址"
            rules={[
              {
                required: true,
                message: '请输入url地址',
              },
            ]}
          >
            <Input placeholder="请输入url地址" />
          </Form.Item>
          <Form.Item
            name="method"
            label="请求方式"
            rules={[
              {
                required: true,
                message: '请选择请求方式',
              },
            ]}
          >
            <Select placeholder="请选择请求方式" allowClear>
              <Option value="GET">GET</Option>
              <Option value="POST">POST</Option>
              <Option value="PATCH">PATCH</Option>
              <Option value="DELETE">DELETE</Option>
            </Select>
          </Form.Item>
          <Form.Item name="sort" label="接口排序">
            <Input placeholder="请输入接口排序" />
          </Form.Item>
          <Form.Item name="description" label="描述">
            <Input.TextArea />
          </Form.Item>
        </Form>
      </Modal>
    </>
  );
};

export default AccessApiModal;
