import React, { useState, useEffect, PropsWithChildren } from 'react';
import { Table, Badge, Dropdown, Space, Button } from 'antd';
import { DownOutlined } from '@ant-design/icons';
import AccessService from 'src/services/system/access';
import useAntdTable, { PaginatedParams } from 'ahooks/lib/useAntdTable';
import { DEFAULT_PAGE_SIZE } from 'src/constants';
import NewBtn from './components/NewBtn';
import MenusTable from './components/MenusTable';
import AccessModuleModal from './components/AccessModuleModal';

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

const Access = () => {
  const [menusTableData, setMenusTableData] = useState([]);
  // 展开模块的
  const [expandedModuleRowKeys, setExpandedModuleRowKeys] = useState([]);
  const [isAccessModalVisible, setIsAccessModalVisible] = useState<boolean>(false);
  const [rowData, setRowData] = useState();
  // 获取模块数据
  const { tableProps: moduleTableData, search } = useAntdTable(getModuleData, {
    defaultPageSize: DEFAULT_PAGE_SIZE, // 默认请求页数
    cacheKey: 'tableProps',
  });
  const { reset } = search || {};
  // 展开模块获取菜单
  const onExpandHandler = async (expanded: boolean, record: any) => {
    const temp: any = [];
    if (expanded) {
      const { data, total } = await getTableData({ parentId: record!.id });
      setMenusTableData(data);
      console.log(total);
      temp.push(record.id);
    }
    setExpandedModuleRowKeys(temp);
  };

  // 编辑行
  const modifyModuleHandler = (record: any) => {
    setRowData(record);
    setIsAccessModalVisible(true);
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
      render: (_: any, record: any) => (
        <Space size="middle">
          <Button type="primary" onClick={() => modifyModuleHandler(record)}>
            编辑
          </Button>
          <Button type="primary">新增菜单</Button>
          <Button type="primary" danger>
            删除
          </Button>
        </Space>
      ),
    },
  ];
  return (
    <div>
      <NewBtn loadData={reset} />
      <Table
        className="access"
        rowKey="id"
        bordered
        columns={columns}
        expandable={{
          expandedRowRender: _ => <MenusTable menusTableData={menusTableData} loadData={reset} />,
        }}
        expandedRowKeys={expandedModuleRowKeys}
        {...moduleTableData}
        onExpand={onExpandHandler}
      />
      <AccessModuleModal
        loadData={reset}
        rowData={rowData}
        isAccessModalVisible={isAccessModalVisible}
        setIsAccessModalVisible={setIsAccessModalVisible}
      />
    </div>
  );
};

export default Access;
