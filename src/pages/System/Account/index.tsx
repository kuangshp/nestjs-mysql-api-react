import React, { useEffect, useState } from 'react';
import { connect } from 'dva';
import AccountService from 'src/services/account';
import styles from './index.module.less';
import { Table } from 'antd';
import { TablePaginationConfig } from 'antd/lib/table';
import { useRequest } from 'ahooks';

const Account = () => {
  const [dataSource, setDataSource] = useState([]);
  useEffect(() => {
    initAccountList();
  }, []);

  const initAccountList = async () => {
    const { code, message, result } = await AccountService.accountList();
    if (Object.is(code, 0)) {
      const { data, total } = result;
      setDataSource(data);
    } else {
      console.error('获取用户列表数据错误', message);
    }
  };

  const columns = [
    {
      title: '用户名',
      dataIndex: 'username',
      key: 'username',
    },
    {
      title: '手机号码',
      dataIndex: 'mobile',
      key: 'mobile',
    },
    {
      title: '邮箱',
      dataIndex: 'email',
      key: 'email',
    },
    {
      title: '状态',
      dataIndex: 'status',
      key: 'status',
    },
    {
      title: '平台',
      dataIndex: 'platform',
      key: 'platform',
    },
    {
      title: '最后登录IP',
      dataIndex: 'lastLoginIp',
      key: 'lastLoginIp',
    },
    {
      title: '最后登录地址',
      dataIndex: 'lastLoginAddress',
      key: 'lastLoginAddress',
    },
    {
      title: '最后登录时间',
      dataIndex: 'lastLoginTime',
      key: 'lastLoginTime',
    },
  ];

  const pageHandler = (pageNumber: TablePaginationConfig) => {
    console.log(pageNumber);
  };

  return (
    <div className={styles.account}>
      <Table bordered dataSource={dataSource} columns={columns} onChange={pageHandler} />
    </div>
  );
};

export default connect()(Account);
