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
  isAccessMenusVisible: boolean;
  setIsAccessMenusVisible: (flag: boolean) => void;
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

const AccessMenuModal = (props: Props) => {
  const { isAccessMenusVisible, setIsAccessMenusVisible, loadData, isNew } = props;
  const { accessRowData } = useSelector((state: any): AccessState => state.present.access);
  const [title, setTitle] = useState<string>('新增菜单');
  const [form] = Form.useForm();
  const { run, loading } = useRequest(createAccessHandler, {
    manual: true,
    onSuccess: result => {
      if (result) {
        setIsAccessMenusVisible(false);
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
        setIsAccessMenusVisible(false);
        // 告知父组件更新数据
        loadData();
        form.resetFields();
      }
    },
  });

  useEffect(() => {
    if (accessRowData && Object.keys(accessRowData).length) {
      if (!isNew) {
        const { actionName, url, icon, sort, status, description } = accessRowData;
        form.setFieldsValue({
          actionName,
          url,
          icon,
          sort,
          description,
          status: String(status),
        });
        setTitle('编辑菜单');
      } else {
        const { moduleName } = accessRowData;
        form.setFieldsValue({
          moduleName,
        });
        setTitle('新增菜单');
      }
    }
  }, [accessRowData]);
  // 提交
  const handleModifyOk = () => {
    // 提交数据中不重复提交
    if (loading || loading1) return;
    form
      .validateFields(['actionName', 'url', 'icon', 'sort', 'status', 'description'])
      .then(values => {
        const { actionName, url, icon, sort, status, description } = values;
        // 如果是新增的就取当前id,否则就是parentId
        const parentId = isNew ? accessRowData!.id : accessRowData!.parentId;
        // 编辑提交
        if (!isNew) {
          run1(Number(accessRowData!.id), {
            type: AccessTypeEnum.MENUS,
            actionName,
            url,
            icon,
            sort,
            status,
            description,
          });
        } else {
          // 提交新增数据
          run({
            type: AccessTypeEnum.MENUS,
            parentId,
            actionName,
            url,
            icon,
            sort,
            status,
            description,
          });
        }
      });
  };

  // 取消
  const handleModifyCancel = () => {
    setIsAccessMenusVisible(false);
    form.resetFields();
  };

  return (
    <>
      <Modal
        title={title}
        visible={isAccessMenusVisible}
        onOk={handleModifyOk}
        onCancel={handleModifyCancel}
      >
        <Form form={form} {...layout}>
          {isNew && (
            <Form.Item name="moduleName" label="模块名称">
              <Input placeholder="请输入模块名称" disabled />
            </Form.Item>
          )}
          <Form.Item
            name="actionName"
            label="菜单名称"
            rules={[
              {
                required: true,
                message: '请输入菜单名称',
              },
            ]}
          >
            <Input placeholder="请输入菜单名称" />
          </Form.Item>
          <Form.Item
            name="url"
            label="菜单url地址"
            rules={[
              {
                required: true,
                message: '请输入菜单url地址',
              },
            ]}
          >
            <Input placeholder="请输入菜单url地址" />
          </Form.Item>
          <Form.Item name="icon" label="菜单图标">
            <Input placeholder="请输入菜单图标" />
          </Form.Item>
          <Form.Item name="status" label="状态">
            <Select placeholder="请选择状态" allowClear>
              <Option value="1">正常</Option>
              <Option value="0">禁用</Option>
            </Select>
          </Form.Item>
          <Form.Item name="sort" label="菜单排序">
            <Input placeholder="请输入菜单排序" />
          </Form.Item>
          <Form.Item name="description" label="描述">
            <Input.TextArea />
          </Form.Item>
        </Form>
      </Modal>
    </>
  );
};

export default AccessMenuModal;
