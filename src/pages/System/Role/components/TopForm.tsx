import React, { PropsWithChildren, useState } from 'react';
import { Form, Input, Button, Select } from 'antd';
import RoleModal from './RoleModal';

const { Option } = Select;

type Props = PropsWithChildren<{
  form: any;
  submit: () => void;
  reset: () => void;
}>;

const TopForm = (props: Props) => {
  const { form, submit, reset } = props;
  const [isModifyVisible, setIsModifyVisible] = useState<boolean>(false);

  return (
    <div className="top">
      <Form form={form} className="form">
        <Form.Item name="name">
          <Input placeholder="请输入用户名" style={{ width: 140, marginRight: 16 }} />
        </Form.Item>
        <Form.Item name="status">
          <Select placeholder="请选择状态" allowClear style={{ width: 140, marginRight: 16 }}>
            <Option value="1">正常</Option>
            <Option value="0">禁用</Option>
          </Select>
        </Form.Item>
        <Button type="primary" onClick={submit}>
          搜索
        </Button>
        <Button onClick={reset} style={{ marginLeft: 8 }}>
          重置
        </Button>
      </Form>
      <Button type="primary" onClick={() => setIsModifyVisible(true)}>
        新增角色
      </Button>
      {/* 新增角色弹框 */}
      <RoleModal
        isModifyVisible={isModifyVisible}
        setIsModifyVisible={setIsModifyVisible}
        loadData={reset}
      />
    </div>
  );
};

export default TopForm;
