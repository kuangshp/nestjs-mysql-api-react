import React, { useState } from 'react';
import { Table, Space, Button, Modal, message } from 'antd';
import { ExclamationCircleOutlined } from '@ant-design/icons';
import AccessService from 'src/services/system/access';
import useAntdTable, { PaginatedParams } from 'ahooks/lib/useAntdTable';
import { DEFAULT_PAGE_SIZE } from 'src/constants';
import NewBtn from './components/NewBtn';
import MenusTable from './components/MenusTable';
import AccessModuleModal from './components/AccessModuleModal';
import AccessMenuModal from './components/AccessMenuModal';
import { AccessResDto } from './types/access.res.dto';
import { StatusEnum } from 'src/enums';
import yesImg from 'src/assets/images/yes.gif';
import noImg from 'src/assets/images/no.gif';
import { useDispatch, useSelector } from 'dva';
import { AccessState } from 'src/models/system/access';
import { QueryAccessDto } from './types/query.access.dto';

const { confirm } = Modal;
// 统一获取数据方法
const getTableData = async (queryOptions: QueryAccessDto) => {
  const { data, total } = await AccessService.accessListByParentId(queryOptions);
  return { data, total };
};

interface IModuleResult {
  total: number;
  list: AccessResDto[];
}

// 获取模块数据
const getModuleData = async ({ current, pageSize }: PaginatedParams[0]): Promise<IModuleResult> => {
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
  const [menusTableData, setMenusTableData] = useState<AccessResDto[]>([]);
  // 展开模块的
  const [expandedModuleRowKeys, setExpandedModuleRowKeys] = useState([]);
  const [isAccessModalVisible, setIsAccessModalVisible] = useState<boolean>(false);
  const [isAccessMenusVisible, setIsAccessMenusVisible] = useState<boolean>(false);
  const dispatch = useDispatch();
  const { accessRowData } = useSelector((state: any): AccessState => state.present.access);
  // 获取模块数据
  const { tableProps: moduleTableData, search } = useAntdTable(getModuleData, {
    defaultPageSize: DEFAULT_PAGE_SIZE, // 默认请求页数
    cacheKey: 'tableProps',
  });
  const { reset } = search || {};

  // 展开模块获取菜单
  const onExpandHandler = async (expanded: boolean, record: AccessResDto) => {
    const temp: any = [];
    if (expanded) {
      const { data, total } = await getTableData({ parentId: record!.id, pageSize: 100 });
      setMenusTableData(data);
      console.log(total);
      temp.push(record.id);
    }
    setExpandedModuleRowKeys(temp);
  };

  // 重新请求菜单接口
  const loadMenu = async () => {
    console.log(accessRowData, '重新请求菜单');
    setExpandedModuleRowKeys([]);
    if (accessRowData && Object.keys(accessRowData).length) {
      const { data } = await getTableData({ parentId: accessRowData!.parentId, pageSize: 100 });
      setMenusTableData(data);
    }
  };

  const loadNewMenu = async () => {
    if (accessRowData && Object.keys(accessRowData).length) {
      const { data } = await getTableData({ parentId: accessRowData!.id, pageSize: 100 });
      setMenusTableData(data);
    }
  };

  // 编辑行
  const modifyModuleHandler = (rowData: AccessResDto) => {
    dispatch({ type: 'access/setRowData', payload: rowData });
    setIsAccessModalVisible(true);
  };

  // 新增菜单
  const createMenuHandler = (rowData: AccessResDto) => {
    dispatch({ type: 'access/setRowData', payload: rowData });
    setIsAccessMenusVisible(true);
  };

  // 删除行
  const deleteRowModuleHandler = (rowData: AccessResDto) => {
    dispatch({ type: 'access/setRowData', payload: rowData });
    confirm({
      icon: <ExclamationCircleOutlined />,
      content: <h3>您确定要删除该条数据？</h3>,
      async onOk() {
        const result = await AccessService.deleteAccessById(rowData.id);
        if (result) {
          message.success(result);
          reset();
        }
      },
    });
  };

  // 模块表格
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
      title: '模块名称',
      dataIndex: 'moduleName',
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
      dataIndex: 'type',
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
      key: 'description',
      align: 'right' as const,
    },
    {
      title: '操作',
      align: 'center' as const,
      width: 150,
      render: (_: any, record: AccessResDto) => (
        <Space size="middle">
          <Button type="primary" onClick={() => modifyModuleHandler(record)}>
            编辑
          </Button>
          <Button type="primary" onClick={() => createMenuHandler(record)}>
            新增菜单
          </Button>
          <Button type="primary" danger onClick={() => deleteRowModuleHandler(record)}>
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
          expandedRowRender: _ => (
            <MenusTable menusTableData={menusTableData} loadData={loadMenu} />
          ),
        }}
        expandedRowKeys={expandedModuleRowKeys}
        {...moduleTableData}
        onExpand={onExpandHandler}
      />
      {isAccessModalVisible && (
        <AccessModuleModal
          loadData={reset}
          isAccessModalVisible={isAccessModalVisible}
          setIsAccessModalVisible={setIsAccessModalVisible}
        />
      )}
      {isAccessMenusVisible && (
        <AccessMenuModal
          loadData={loadNewMenu}
          isNew={true}
          isAccessMenusVisible={isAccessMenusVisible}
          setIsAccessMenusVisible={setIsAccessMenusVisible}
        />
      )}
    </div>
  );
};

export default Access;
