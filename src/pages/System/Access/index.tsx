import { useAntdTable } from 'ahooks';
import { PaginatedParams } from 'ahooks/lib/useAntdTable';
import { Button, Form, Input, Table } from 'antd';
import React, { useState } from 'react';
import { ObjectType } from 'src/typings';

interface Item {
  name: {
    last: string;
  };
  email: string;
  phone: string;
  gender: 'male' | 'female';
}

interface Result {
  total: number;
  list: Item[];
}

const getTableData = (
  { current, pageSize }: PaginatedParams[0],
  formData: ObjectType
): Promise<Result> => {
  console.log(formData, '表单搜索');
  let query = `page=${current}&size=${pageSize}`;
  Object.entries(formData).forEach(([key, value]) => {
    if (value) {
      query += `&${key}=${value}`;
    }
  });

  return fetch(`https://randomuser.me/api?results=55&${query}`)
    .then(res => res.json())
    .then(res => ({
      total: res.info.results,
      list: res.results,
    }));
};

const AppList = () => {
  const [form] = Form.useForm();
  const { tableProps, params, search } = useAntdTable(getTableData, {
    defaultPageSize: 5,
    form,
    cacheKey: 'tableProps',
  });
  console.log(params, '===');
  const { sorter = {}, filters = {} } = params[0] || ({} as any);
  const { type, changeType, submit, reset } = search || {};

  const columns = [
    {
      title: 'name',
      dataIndex: 'name.last',
    },
    {
      title: 'email',
      dataIndex: 'email',
    },
    {
      title: 'phone',
      dataIndex: 'phone',
      sorter: true,
      sortOrder: sorter.field === 'phone' && sorter.order,
    },
    {
      title: 'gender',
      dataIndex: 'gender',
      filters: [
        { text: 'male', value: 'male' },
        { text: 'female', value: 'female' },
      ],
      filteredValue: filters.gender,
    },
  ];

  const searchFrom = (
    <div style={{ marginBottom: 16 }}>
      <Form form={form} style={{ display: 'flex', justifyContent: 'flex-end' }}>
        <Form.Item name="name">
          <Input placeholder="请输入名字" style={{ width: 140, marginRight: 16 }} />
        </Form.Item>
        {/* 判断是否要展开更多的搜索 */}
        {type === 'advance' && (
          <>
            <Form.Item name="email">
              <Input placeholder="请输入邮箱地址" style={{ width: 140, marginRight: 16 }} />
            </Form.Item>
            <Form.Item name="phone">
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
      <Table columns={columns} rowKey="email" {...tableProps} />
    </div>
  );
};

const Access = () => {
  return <AppList />;
};

export default Access;
