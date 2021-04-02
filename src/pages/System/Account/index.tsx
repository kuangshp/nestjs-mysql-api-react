import React from 'react';
import AccountService from 'src/services/account';
import styles from './index.module.less';
import { Table, Form, Input, Button } from 'antd';
import { useAntdTable } from 'ahooks';
import { PaginatedParams } from 'ahooks/lib/useAntdTable';

// 获取表格数据
const getTableData = async (
  { current, pageSize, filters }: PaginatedParams[0],
  formData: Record<string, any>
): Promise<any> => {
  console.log(formData, '表格传递的数据', filters);
  const { data, total } = await AccountService.accountList({
    pageNumber: current,
    pageSize,
    ...formData,
  });
  return {
    total: total,
    list: data,
  };
};
const AccountList = () => {
  const [form] = Form.useForm();
  const { tableProps, params, search } = useAntdTable(getTableData, {
    defaultPageSize: 5, // 默认请求页数
    form,
    cacheKey: 'tableProps',
  });
  const { filters = {} } = params[0] || ({} as any);
  const { type, changeType, submit, reset } = search || {};

  const columns = [
    {
      title: '用户名',
      dataIndex: 'username',
    },
    {
      title: '手机号码',
      dataIndex: 'mobile',
      sorter: true,
    },
    {
      title: '邮箱',
      dataIndex: 'email',
    },
    {
      title: '状态',
      dataIndex: 'status',
      filters: [
        { text: '正常', value: '0' },
        { text: '禁止', value: '1' },
      ],
      filteredValue: filters.status,
    },
    {
      title: '平台',
      dataIndex: 'platform',
    },
    {
      title: '最后登录IP',
      dataIndex: 'lastLoginIp',
    },
    {
      title: '最后登录地址',
      dataIndex: 'lastLoginAddress',
    },
    {
      title: '最后登录时间',
      dataIndex: 'lastLoginTime',
    },
  ];

  const searchFrom = (
    <div style={{ marginBottom: 16 }}>
      <Form form={form} style={{ display: 'flex', justifyContent: 'flex-end' }}>
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
    </div>
  );

  return (
    <div>
      {searchFrom}
      <Table columns={columns} rowKey="id" {...tableProps} bordered />
    </div>
  );
};

const Account = () => <AccountList />;

export default Account;
