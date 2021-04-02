import React from 'react';
import AccountService from 'src/services/account';
import styles from './index.module.less';
import { Table, Form, Input, Button, Space } from 'antd';
import { useAntdTable } from 'ahooks';
import { PaginatedParams } from 'ahooks/lib/useAntdTable';
import { DEFAULT_PAGE_SIZE } from 'src/constants';
import { AccountResDto } from './types/account.list.res.dto';
import { formatDate } from 'src/utils';

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

// 组件
const AccountList = () => {
  const [form] = Form.useForm();
  const { tableProps, params, search } = useAntdTable(getTableData, {
    defaultPageSize: DEFAULT_PAGE_SIZE, // 默认请求页数
    form,
    cacheKey: 'tableProps',
  });
  const { filters = {} } = params[0] || ({} as any);
  const { type, changeType, submit, reset } = search || {};

  // 编辑行
  const modifyRow = (rowData: AccountResDto) => {
    console.log(rowData);
  };
  const resetPasswordRow = (rowData: AccountResDto) => {
    console.log(rowData);
  };
  const deleteRow = (rowData: AccountResDto) => {
    console.log(rowData);
  };
  const columns = [
    {
      title: '用户名',
      dataIndex: 'username',
      align: 'right' as const,
      width: 100,
    },
    {
      title: '手机号码',
      dataIndex: 'mobile',
      align: 'center' as const,
      width: 150,
    },
    {
      title: '邮箱',
      dataIndex: 'email',
      align: 'right' as const,
      width: 150,
    },
    {
      title: '状态',
      dataIndex: 'status',
      align: 'center' as const,
      filters: [
        { text: '正常', value: '0' },
        { text: '禁止', value: '1' },
      ],
      filteredValue: filters.status,
      width: 100,
    },
    {
      title: '平台',
      dataIndex: 'platform',
      align: 'right' as const,
      width: 100,
    },
    {
      title: '最后登录IP',
      dataIndex: 'lastLoginIp',
      align: 'right' as const,
      width: 150,
    },
    {
      title: '最后登录地址',
      dataIndex: 'lastLoginAddress',
      align: 'right' as const,
      width: 200,
    },
    {
      title: '最后登录时间',
      dataIndex: 'lastLoginTime',
      align: 'center' as const,
      width: 180,
      render: (_: any, record: AccountResDto) => <div>{formatDate(record.lastLoginTime)}</div>,
    },
    {
      title: '操作',
      key: 'operation',
      align: 'center' as const,
      fixed: 'right' as const,
      width: 250,
      // 当前行的值，当前行数据，行索引
      render: (_: any, record: AccountResDto) => {
        return (
          <div>
            <Button type="primary" onClick={() => modifyRow(record)}>
              编辑
            </Button>
            <Button onClick={() => resetPasswordRow(record)} className={styles.mr}>
              重置密码
            </Button>
            <Button type="primary" danger onClick={() => deleteRow(record)}>
              删除
            </Button>
          </div>
        );
      },
    },
  ];

  // 顶部搜索栏目
  const searchFrom = (
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

  return (
    <div className={styles.account}>
      {searchFrom}
      <Table columns={columns} rowKey="id" {...tableProps} bordered scroll={{ x: 1500 }} />
    </div>
  );
};

export default AccountList;
