import React, { PropsWithChildren, useState } from 'react';
import { Space, Button, Table, Modal, message } from 'antd';
import AccessService from 'src/services/system/access';
import AccessMenuModal from './AccessMenuModal';
import AccessApiModal from './AccessApiModal';

import ApiTable from './ApiTable';
import { AccessResDto } from '../types/access.res.dto';
import { ExclamationCircleOutlined } from '@ant-design/icons';
import { StatusEnum } from 'src/enums';
import yesImg from 'src/assets/images/yes.gif';
import noImg from 'src/assets/images/no.gif';
import { useDispatch, useSelector } from 'dva';
import { AccessState } from 'src/models/system/access';
import { QueryAccessDto } from './../types/query.access.dto';

const { confirm } = Modal;

type Props = PropsWithChildren<{
  menusTableData: AccessResDto[];
  loadData: () => void;
}>;

// 统一获取数据方法
const getTableData = async (queryOptions: QueryAccessDto) => {
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
  const [apiTableData, setApiTableData] = useState<AccessResDto[]>([]);
  const { accessRowData } = useSelector((state: any): AccessState => state.present.access);
  const dispatch = useDispatch();
  // 编辑行
  const modifyMenuHandler = (rowData: AccessResDto) => {
    dispatch({ type: 'access/setRowData', payload: rowData });
    setIsAccessMenusVisible(true);
  };

  // 新建API
  const createApiHandler = (rowData: AccessResDto) => {
    dispatch({ type: 'access/setRowData', payload: rowData });
    setIsAccessApiVisible(true);
  };

  // 删除菜单
  const deleteMenuHandler = (rowData: AccessResDto) => {
    dispatch({ type: 'access/setRowData', payload: rowData });
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
    // {
    //   title: 'ID',
    //   dataIndex: 'id',
    //   align: 'right' as const,
    // },
    // {
    //   title: '父节点',
    //   dataIndex: 'parentId',
    //   align: 'right' as const,
    // },
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
      render: (_: any, record: AccessResDto) => {
        if (Object.is(record.status, StatusEnum.FORBIDDEN)) {
          return <img src={noImg} />;
        } else {
          return <img src={yesImg} />;
        }
      },
    },
    {
      title: '描述',
      dataIndex: 'description',
      align: 'right' as const,
    },
    {
      title: '操作',
      align: 'center' as const,
      width: 150,
      render: (_: any, record: AccessResDto) => (
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
  const onExpandMenusHandler = async (expanded: boolean, record: AccessResDto) => {
    console.log(record, '展开接');
    const temp: any = [];
    if (expanded) {
      temp.push(record.id);
      const { data } = await getTableData({ parentId: record!.id, pageSize: 100 });
      setApiTableData(data);
    }
    setExpandedMenusRowKeys(temp);
  };
  // 刷新api数据
  const loadApiData = async () => {
    console.log(accessRowData, '更新接口');
    setExpandedMenusRowKeys([]);
    if (accessRowData && Object.keys(accessRowData).length) {
      const { data } = await getTableData({ parentId: accessRowData!.parentId, pageSize: 100 });
      setApiTableData(data);
    }
  };
  const loadApiData1 = async () => {
    console.log(accessRowData, '更新接口1');
    if (accessRowData && Object.keys(accessRowData).length) {
      const { data } = await getTableData({ parentId: accessRowData!.id, pageSize: 100 });
      setApiTableData(data);
    }
  };
  return (
    <>
      <Table
        columns={columns}
        dataSource={menusTableData}
        pagination={false}
        expandedRowKeys={expandedMenusRowKeys}
        expandable={{
          expandedRowRender: _ => <ApiTable apiTableData={apiTableData} loadData={loadApiData} />,
        }}
        rowKey="id"
        onExpand={onExpandMenusHandler}
      />
      {isAccessMenusVisible && (
        <AccessMenuModal
          loadData={loadData}
          isAccessMenusVisible={isAccessMenusVisible}
          setIsAccessMenusVisible={setIsAccessMenusVisible}
        />
      )}
      {isAccessApiVisible && (
        <AccessApiModal
          loadData={loadApiData1}
          isNew={true}
          isAccessApiVisible={isAccessApiVisible}
          setIsAccessApiVisible={setIsAccessApiVisible}
        />
      )}
    </>
  );
};

export default MenusTable;
