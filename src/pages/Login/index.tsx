import React, { useMemo } from 'react';
import { Form, Input, Button, message } from 'antd';
import styles from './index.module.less';
import { FormError } from 'src/typings';
import { storage } from 'src/utils';
import { connect, useDispatch } from 'dva';

const Login = () => {
  const dispatch = useDispatch();
  useMemo(() => {
    storage.clear();
  }, []);
  // 成功的提交
  const onFinish = (values: any) => {
    console.log('Success:', values, typeof values);
    dispatch({ type: 'login/loginApi', payload: values });
  };
  // 失败的提示
  const onFinishFailed = (errorInfo: FormError) => {
    const { errorFields } = errorInfo;
    // 取出第一个的错误提示出来
    message.warning(errorFields[0].errors[0]);
  };
  return (
    <div className={styles.login}>
      <div className={styles.login_panel}>
        <div className={styles.title}>后台管理系统平台</div>
        <Form name="basic" layout="vertical" onFinish={onFinish} onFinishFailed={onFinishFailed}>
          <Form.Item
            label="用户名"
            name="username"
            rules={[{ required: true, message: '请输入用户名!' }]}
          >
            <Input />
          </Form.Item>

          <Form.Item
            label="密码"
            name="password"
            rules={[{ required: true, message: '请输入密码!' }]}
          >
            <Input.Password />
          </Form.Item>

          <Form.Item>
            <Button type="primary" htmlType="submit" className={styles.login_btn}>
              登录
            </Button>
          </Form.Item>
          <div className={styles.tools}>账号和密码:admin/123456</div>
        </Form>
      </div>
    </div>
  );
};

export default connect()(Login);
