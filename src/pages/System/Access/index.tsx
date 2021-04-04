import React, { useState, useEffect } from 'react';
import { Table, Badge, Dropdown, Space, Button } from 'antd';
import { DownOutlined } from '@ant-design/icons';
import AccessService from 'src/services/system/access';
import { PaginatedParams } from 'ahooks/lib/useAntdTable';

function NestedTable() {
  const [tableData, setTableData] = useState([]);
  const [moduleTableData, setModuleTableData] = useState([]);
  const [menusTableData, setMenusTableData] = useState([]);
  const [defaultExpandedRowKeys, setDefaultExpandedRowKeys] = useState([]);
  const [moduleTableTotal, setModuleTableTotal] = useState<number>(0);

  // 包装获取数据的方法
  const getTableData = async (queryOptions?: any): Promise<any> => {
    const { data, total } = await AccessService.accessListByParentId(queryOptions);
    console.log(data, total);
    setModuleTableData(data);
    setModuleTableTotal(total);
  };

  // 获取模块数据
  useEffect(() => {
    getTableData();
  }, []);

  const fetData = async (parentId: number) => {
    const { data, total } = await AccessService.accessListByParentId({ parentId });
    console.log(data, total, '子菜单');
    setMenusTableData(data);
    return { data, total };
  };

  const onExpandHandler = (expanded, record) => {
    console.log(expanded, record, '点开的');
    const temp: any = [];
    if (expanded) {
      fetData(record.id);
      temp.push(record.id);
    }
    setDefaultExpandedRowKeys(temp);
  };

  // 菜单表格
  const expandedRowRender = (record, index, expanded) => {
    console.log(record, index, expanded, '===?', menusTableData);
    // fetData(record!.id);
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
      dataSource={moduleTableData}
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
