import React, { PropsWithChildren, useState } from 'react';
import { Space, Button, Table } from 'antd';
import AccessService from 'src/services/system/access';
import AccessMenuModal from './AccessMenuModal';

import ApiTable from './ApiTable';
import { AccessResDto } from '../types/access.res.dto';

type Props = PropsWithChildren<{
  menusTableData: any;
  loadData: () => void;
}>;

// 统一获取数据方法
const getTableData = async (queryOptions?: any) => {
  const { data, total } = await AccessService.accessListByParentId(queryOptions);
  return { data, total };
};

const MenusTable = (props: Props) => {
  const { menusTableData, loadData } = props;

  const [isAccessMenusVisible, setIsAccessMenusVisible] = useState<boolean>(false);
  // 展开菜单的
  const [expandedMenusRowKeys, setExpandedMenusRowKeys] = useState([]);
  // api接口数据
  const [apiTableData, setApiTableData] = useState([]);
  const [rowData, setRowData] = useState<AccessResDto>();
  // 编辑行
  const modifyMenuHandler = (rowData: any) => {
    setRowData(rowData);
    setIsAccessMenusVisible(true);
  };

  const columns = [
    { title: '菜单', dataIndex: 'actionName' },
    { title: 'url地址', dataIndex: 'url' },
    { title: '图标', dataIndex: 'icon' },
    { title: '排序', dataIndex: 'sort' },
    {
      title: '操作',
      render: (_: any, record: any) => (
        <Space size="middle">
          <Button type="primary" onClick={() => modifyMenuHandler(record)}>
            编辑
          </Button>
          <Button type="primary">新增接口</Button>
          <Button type="primary" danger>
            删除
          </Button>
        </Space>
      ),
    },
  ];

  // 展开菜单
  const onExpandMenusHandler = async (expanded: boolean, record: any) => {
    console.log('展开菜单,查询全部的api');
    const temp: any = [];
    if (expanded) {
      temp.push(record.id);
      const { data, total } = await getTableData({ parentId: record!.id });
      setApiTableData(data);
      // console.log(data, total);
    }
    setExpandedMenusRowKeys(temp);
  };

  return (
    <>
      <Table
        columns={columns}
        dataSource={menusTableData}
        pagination={false}
        expandedRowKeys={expandedMenusRowKeys}
        expandable={{
          expandedRowRender: _ => <ApiTable apiTableData={apiTableData} />,
        }}
        rowKey="id"
        onExpand={onExpandMenusHandler}
      />
      <AccessMenuModal
        loadData={loadData}
        rowData={rowData}
        isAccessMenusVisible={isAccessMenusVisible}
        setIsAccessMenusVisible={setIsAccessMenusVisible}
      />
    </>
  );
};

export default MenusTable;
