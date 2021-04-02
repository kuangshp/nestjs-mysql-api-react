import React, { PropsWithChildren } from 'react';
import { Form, Input, Button } from 'antd';
import styles from './index.module.less';

type Props = PropsWithChildren<{
  type: string;
  form: any;
  submit: () => void;
  reset: () => void;
  changeType: () => void;
}>;

const TopForm = (props: Props) => {
  const { type, form, submit, reset, changeType } = props;
  return (
    <div className={styles.top}>
      <Form form={form} className={styles.form}>
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
          </>
        )}
        <Button type="primary" onClick={submit}>
          搜索
        </Button>
        <Button onClick={reset} style={{ marginLeft: 8 }}>
          重置
        </Button>
        <Button type="link" onClick={changeType}>
          {type === 'simple' ? '展开' : '收缩'}
        </Button>
      </Form>
      <Button type="primary">新增账号</Button>
    </div>
  );
};

export default TopForm;
