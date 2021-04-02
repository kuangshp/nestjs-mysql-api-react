import React, { useState } from 'react';
import AccountService from 'src/services/account';
import styles from './index.module.less';
import { Table, Form, Button, Modal, message } from 'antd';
import { useAntdTable } from 'ahooks';
import { PaginatedParams } from 'ahooks/lib/useAntdTable';
import { DEFAULT_PAGE_SIZE, DEFAULT_PASSWORD } from 'src/constants';
import { AccountResDto } from './types/account.list.res.dto';
import { formatDate } from 'src/utils';
import AccountModal from './components/AccountModal';
import TopForm from './components/TopForm';
import { ExclamationCircleOutlined } from '@ant-design/icons';

const { confirm } = Modal;

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
  // 是否显示修改行弹框
  const [isModifyVisible, setIsModifyVisible] = useState<boolean>(false);
  // 当前点击行数据
  const [rowData, setRowData] = useState<AccountResDto>();
  // 头部搜索表单
  const [searchForm] = Form.useForm();
  const { tableProps, params, search } = useAntdTable(getTableData, {
    defaultPageSize: DEFAULT_PAGE_SIZE, // 默认请求页数
    form: searchForm,
    cacheKey: 'tableProps',
  });
  const { filters = {} } = params[0] || ({} as any);
  const { type, changeType, submit, reset } = search || {};

  // 编辑行
  const modifyRow = (rowData: AccountResDto) => {
    setRowData(rowData);
    setIsModifyVisible(true);
  };
  // 重置密码
  const resetPasswordRow = (rowData: AccountResDto) => {
    setRowData(rowData);
    confirm({
      icon: <ExclamationCircleOutlined />,
      content: <h3>您是否要重置密码为:{DEFAULT_PASSWORD}</h3>,
      async onOk() {
        const result = await AccountService.resetPassword({ id: rowData.id });
        if (result) {
          message.success(result);
          reset();
        }
      },
    });
  };
  // 删除行
  const deleteRow = (rowData: AccountResDto) => {
    setRowData(rowData);
    confirm({
      icon: <ExclamationCircleOutlined />,
      content: <h3>您确定要删除该条数据？</h3>,
      async onOk() {
        const result = await AccountService.deleteAccountById(rowData.id);
        if (result) {
          message.success(result);
          reset();
        }
      },
    });
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

  return (
    <div className={styles.account}>
      {/* 头部搜索 */}
      <TopForm
        form={searchForm}
        type={type}
        submit={submit}
        reset={reset}
        changeType={changeType}
      />
      {/* 编辑数据弹框 */}
      <AccountModal
        isModifyVisible={isModifyVisible}
        setIsModifyVisible={setIsModifyVisible}
        loadData={reset}
        rowData={rowData}
      />
      <Table columns={columns} rowKey="id" {...tableProps} bordered scroll={{ x: 1500 }} />
    </div>
  );
};

export default AccountList;
