import React, { useState, useEffect } from 'react';
import { Table, Badge, Dropdown, Space, Button } from 'antd';
import { DownOutlined } from '@ant-design/icons';
import AccessService from 'src/services/system/access';
import useAntdTable, { PaginatedParams } from 'ahooks/lib/useAntdTable';
import { DEFAULT_PAGE_SIZE } from 'src/constants';

// 统一获取数据方法
const getTableData = async (queryOptions?: any) => {
  const { data, total } = await AccessService.accessListByParentId(queryOptions);
  return { data, total };
};
// 获取模块数据
const getModuleData = async ({ current, pageSize }: PaginatedParams[0]): Promise<any> => {
  const { data, total } = await getTableData({
    pageNumber: current,
    pageSize,
  });
  return {
    total: total,
    list: data,
  };
};
function NestedTable() {
  const [menusTableData, setMenusTableData] = useState([]);
  const [defaultExpandedRowKeys, setDefaultExpandedRowKeys] = useState([]);

  // 获取模块数据
  const { tableProps: moduleTableData } = useAntdTable(getModuleData, {
    defaultPageSize: DEFAULT_PAGE_SIZE, // 默认请求页数
    cacheKey: 'tableProps',
  });

  const fetData = async (parentId: number) => {
    const { data, total } = await getTableData({ parentId });
    setMenusTableData(data);
    return { data, total };
  };

  const onExpandHandler = (expanded: boolean, record: any) => {
    const temp: any = [];
    if (expanded) {
      fetData(record.id);
      temp.push(record.id);
    }
    setDefaultExpandedRowKeys(temp);
  };

  // 菜单表格
  const expandedRowRender = () => {
    const columns = [
      { title: '菜单', dataIndex: 'actionName' },
      { title: 'url地址', dataIndex: 'url' },
      { title: '图标', dataIndex: 'icon' },
      { title: '排序', dataIndex: 'sort' },
      {
        title: '操作',
        render: () => (
          <Space size="middle">
            <Button type="primary">编辑</Button>
            <Button type="primary" danger>
              删除
            </Button>
          </Space>
        ),
      },
    ];

    return <Table columns={columns} dataSource={menusTableData} pagination={false} rowKey="id" />;
  };
  // 模块表格
  const columns = [
    { title: '模块名称', dataIndex: 'moduleName', key: 'moduleName' },
    { title: '图标', dataIndex: 'icon', key: 'icon' },
    { title: '排序', dataIndex: 'sort', key: 'sort' },
    { title: '状态', dataIndex: 'type', key: 'type' },
    { title: '描素', dataIndex: 'description', key: 'description' },
    {
      title: '操作',
      render: () => (
        <Space size="middle">
          <Button type="primary">编辑</Button>
          <Button type="primary">新增菜单</Button>
          <Button type="primary" danger>
            删除
          </Button>
        </Space>
      ),
    },
  ];

  return (
    <Table
      className="components-table-demo-nested"
      rowKey="id"
      columns={columns}
      expandable={{ expandedRowRender }}
      expandedRowKeys={defaultExpandedRowKeys}
      {...moduleTableData}
      onExpand={onExpandHandler}
    />
  );
}

const Access = () => {
  return (
    <div>
      <NestedTable />
    </div>
  );
};

export default Access;
