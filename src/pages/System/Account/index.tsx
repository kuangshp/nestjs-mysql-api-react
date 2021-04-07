import React, { useState } from 'react';
import { Table, Form, Button, Modal, message, Space } from 'antd';
import { useAntdTable } from 'ahooks';
import { PaginatedParams } from 'ahooks/lib/useAntdTable';
import { ExclamationCircleOutlined } from '@ant-design/icons';

import AccountService from 'src/services/system/account';
import styles from './index.module.less';
import { DEFAULT_PAGE_SIZE, DEFAULT_PASSWORD } from 'src/constants';
import { AccountResDto, AccountTableDto } from './types/account.res.dto';
import { formatDate } from 'src/utils';
import AccountModal from './components/AccountModal';
import AccountRoleModal from './components/AccountRoleModal';
import TopForm from './components/TopForm';
import { PlatformMessage, StatusEnum } from 'src/enums';
import yesImg from 'src/assets/images/yes.gif';
import noImg from 'src/assets/images/no.gif';
import { useDispatch } from 'dva';

const { confirm } = Modal;

// 获取表格数据
const getTableData = async (
  { current, pageSize }: PaginatedParams[0],
  formData: Record<string, any>
): Promise<AccountTableDto> => {
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
  const [isRoleModifyVisible, setIsRoleModifyVisible] = useState<boolean>(false);
  const dispatch = useDispatch();
  // 头部搜索表单
  const [searchForm] = Form.useForm();
  const { tableProps, search } = useAntdTable(getTableData, {
    defaultPageSize: DEFAULT_PAGE_SIZE, // 默认请求页数
    form: searchForm,
    cacheKey: 'tableProps',
  });
  const { type, changeType, submit, reset } = search || {};

  // 编辑行
  const modifyRow = (rowData: AccountResDto) => {
    dispatch({ type: 'account/setRowData', payload: rowData });
    setIsModifyVisible(true);
  };
  // 分配角色
  const dispatchRole = (rowData: AccountResDto) => {
    dispatch({ type: 'account/setRowData', payload: rowData });
    setIsRoleModifyVisible(true);
  };
  // 重置密码
  const resetPasswordRow = (rowData: AccountResDto) => {
    dispatch({ type: 'account/setRowData', payload: rowData });
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
    dispatch({ type: 'account/setRowData', payload: rowData });
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
      width: 100,
      render: (_: any, record: AccountResDto) => {
        if (Object.is(record.status, StatusEnum.NORMAL)) {
          return <img src={yesImg} />;
        } else {
          return <img src={noImg} />;
        }
      },
    },
    {
      title: '平台',
      dataIndex: 'platform',
      align: 'right' as const,
      width: 130,
      render: (_: any, record: AccountResDto) => <div>{PlatformMessage[record.platform]}</div>,
    },
    {
      title: '是否超管',
      dataIndex: 'isSuper',
      align: 'center' as const,
      width: 100,
      render: (_: any, record: AccountResDto) => {
        if (record.isSuper) {
          return '是';
        } else {
          return '否';
        }
      },
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
      width: 200,
      render: (_: any, record: AccountResDto) => <div>{formatDate(record.lastLoginTime)}</div>,
    },
    {
      title: '操作',
      key: 'operation',
      align: 'center' as const,
      fixed: 'right' as const,
      width: 380,
      // 当前行的值，当前行数据，行索引
      render: (_: any, record: AccountResDto) => {
        return (
          <Space size="middle">
            <Button type="primary" onClick={() => modifyRow(record)}>
              编辑
            </Button>
            <Button type="primary" onClick={() => dispatchRole(record)}>
              分配角色
            </Button>
            <Button onClick={() => resetPasswordRow(record)}>重置密码</Button>
            <Button type="primary" danger onClick={() => deleteRow(record)}>
              删除
            </Button>
          </Space>
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
      {isModifyVisible && (
        <AccountModal
          isModifyVisible={isModifyVisible}
          setIsModifyVisible={setIsModifyVisible}
          loadData={reset}
        />
      )}

      {/* 分配角色弹框 */}
      {isRoleModifyVisible && (
        <AccountRoleModal
          isRoleModifyVisible={isRoleModifyVisible}
          setIsRoleModifyVisible={setIsRoleModifyVisible}
          loadData={reset}
        />
      )}
      {/* 表格数据 */}
      <Table columns={columns} rowKey="id" {...tableProps} bordered scroll={{ x: 1500 }} />
    </div>
  );
};

export default AccountList;
