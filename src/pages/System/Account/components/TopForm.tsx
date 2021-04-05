import React, { PropsWithChildren, useState } from 'react';
import { Form, Input, Button, Select } from 'antd';
import AccountModal from './AccountModal';
import { useDispatch } from 'dva';

const { Option } = Select;

type Props = PropsWithChildren<{
  type: string;
  form: any;
  submit: () => void;
  reset: () => void;
  changeType: () => void;
}>;

const TopForm = (props: Props) => {
  const { type, form, submit, reset, changeType } = props;
  const [isModifyVisible, setIsModifyVisible] = useState<boolean>(false);
  const dispatch = useDispatch();

  const createAccount = () => {
    console.log('aa');
    dispatch({ type: 'account/setRowData', payload: null });
    setIsModifyVisible(true);
  };

  return (
    <div className="top">
      <Form form={form} className="form">
        <Form.Item name="username">
          <Input placeholder="请输入用户名" style={{ width: 140, marginRight: 16 }} />
        </Form.Item>
        {/* 判断是否要展开更多的搜索 */}
        {type === 'advance' && (
          <>
            <Form.Item name="email">
              <Input placeholder="请输入邮箱地址" style={{ width: 140, marginRight: 16 }} />
            </Form.Item>
            <Form.Item name="mobile">
              <Input placeholder="请输入手机号码" style={{ width: 140, marginRight: 16 }} />
            </Form.Item>
            <Form.Item name="status">
              <Select placeholder="请选择状态" allowClear style={{ width: 140, marginRight: 16 }}>
                <Option value="1">正常</Option>
                <Option value="0">禁用</Option>
              </Select>
            </Form.Item>
            <Form.Item name="platform">
              <Select placeholder="请选择平台" allowClear style={{ width: 140, marginRight: 16 }}>
                <Option value="1">运营平台</Option>
                <Option value="2">商家平台</Option>
              </Select>
            </Form.Item>
          </>
        )}
        <Button type="primary" onClick={submit}>
          搜索
        </Button>
        <Button onClick={reset} style={{ marginLeft: 8 }}>
          重置
        </Button>
        <Button type="primary" style={{ marginLeft: 8 }}>
          导出EXCEL
        </Button>
        <Button type="link" onClick={changeType}>
          {type === 'simple' ? '展开' : '收缩'}
        </Button>
      </Form>
      <Button type="primary" onClick={createAccount}>
        新增账号
      </Button>
      <AccountModal
        isModifyVisible={isModifyVisible}
        setIsModifyVisible={setIsModifyVisible}
        loadData={reset}
      />
    </div>
  );
};

export default TopForm;
