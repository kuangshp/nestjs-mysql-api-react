import React, { PropsWithChildren, useState } from 'react';
import { Space, Button, Table, Modal, message } from 'antd';
import AccessService from 'src/services/system/access';
import AccessMenuModal from './AccessMenuModal';
import AccessApiModal from './AccessApiModal';

import ApiTable from './ApiTable';
import { AccessResDto } from '../types/access.res.dto';
import { AccessReqDto } from '../types/access.req.dto';
import { ExclamationCircleOutlined } from '@ant-design/icons';
import { StatusEnum } from 'src/enums';

const { confirm } = Modal;

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
  const [isAccessApiVisible, setIsAccessApiVisible] = useState<boolean>(false);
  // 展开菜单的
  const [expandedMenusRowKeys, setExpandedMenusRowKeys] = useState([]);
  // api接口数据
  const [apiTableData, setApiTableData] = useState([]);
  const [rowData, setRowData] = useState<AccessResDto | undefined>();
  // 编辑行
  const modifyMenuHandler = (rowData: any) => {
    setRowData(rowData);
    setIsAccessMenusVisible(true);
  };

  // 新建API
  const createApiHandler = (rowData: any) => {
    setRowData(rowData);
    setIsAccessApiVisible(true);
  };

  // 删除菜单
  const deleteMenuHandler = (rowData: any) => {
    confirm({
      icon: <ExclamationCircleOutlined />,
      content: <h3>您确定要删除该条数据？</h3>,
      async onOk() {
        const result = await AccessService.deleteAccessById(rowData.id);
        if (result) {
          message.success(result);
          loadData();
        }
      },
    });
  };

  const columns = [
    {
      title: '菜单',
      dataIndex: 'actionName',
      align: 'right' as const,
    },
    {
      title: 'url地址',
      dataIndex: 'url',
      align: 'right' as const,
    },
    {
      title: '图标',
      dataIndex: 'icon',
      align: 'right' as const,
    },
    {
      title: '排序',
      dataIndex: 'sort',
      align: 'center' as const,
    },
    {
      title: '状态',
      dataIndex: 'status',
      align: 'center' as const,
      // render: (_: any, record: AccessResDto) => {
      //   if (Object.is(record.status, StatusEnum.FORBIDDEN)) {
      //     return <Button type="primary" danger>禁用</Button>;
      //   } else {
      //     return <Button type="primary">启用</Button>;
      //   }
      // }
    },
    {
      title: '描素',
      dataIndex: 'description',
      align: 'right' as const,
    },
    {
      title: '操作',
      align: 'center' as const,
      width: 150,
      render: (_: any, record: AccessReqDto) => (
        <Space size="middle">
          <Button type="primary" onClick={() => modifyMenuHandler(record)}>
            编辑
          </Button>
          <Button type="primary" onClick={() => createApiHandler(record)}>
            新增接口
          </Button>
          <Button type="primary" danger onClick={() => deleteMenuHandler(record)}>
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
      <AccessApiModal
        loadData={loadData}
        rowData={rowData}
        isNew={true}
        isAccessApiVisible={isAccessApiVisible}
        setIsAccessApiVisible={setIsAccessApiVisible}
      />
    </>
  );
};

export default MenusTable;
