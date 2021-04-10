import React, { useState } from 'react';

import { Form, Table, Button, Modal, message, Space } from 'antd';
import { ExclamationCircleOutlined } from '@ant-design/icons';
import useAntdTable, { PaginatedParams } from 'ahooks/lib/useAntdTable';

import styles from './index.module.less';
import RoleService from 'src/services/system/role';
import { DEFAULT_PAGE_SIZE } from 'src/constants';
import yesImg from 'src/assets/images/yes.gif';
import noImg from 'src/assets/images/no.gif';
import { StatusEnum, RoleEnum } from 'src/enums';
import TopForm from './components/TopForm';
import { AccountTableDto, RoleResDto } from './types/role.res.dto';
import RoleModal from './components/RoleModal';
import RoleMenuModal from './components/RoleMenuModal';
import { useDispatch } from 'dva';
import RoleApiModal from './components/RoleApiModal';

const { confirm } = Modal;
// 封装请求数据
const getTableData = async (
  { current, pageSize }: PaginatedParams[0],
  formData: Record<string, any>
): Promise<AccountTableDto> => {
  const { data, total } = await RoleService.roleList({
    pageNumber: current,
    pageSize,
    ...formData,
  });
  return {
    total: total,
    list: data,
  };
};

const Role: React.FC = () => {
  // 是否显示修改行弹框
  const [isModifyVisible, setIsModifyVisible] = useState<boolean>(false);
  const [isRoleMenuVisible, setIsRoleMenuVisible] = useState<boolean>(false);
  const [isRoleApiVisible, setIsRoleApiVisible] = useState<boolean>(false);
  const dispatch = useDispatch();
  // 头部搜索表单
  const [searchForm] = Form.useForm();
  const { tableProps, search } = useAntdTable(getTableData, {
    defaultPageSize: DEFAULT_PAGE_SIZE, // 默认请求页数
    form: searchForm,
    cacheKey: 'tableProps',
  });
  const { submit, reset } = search || {};
  // 编辑行数据
  const modifyRow = (rowData: RoleResDto) => {
    dispatch({ type: 'role/setRowData', payload: rowData });
    setIsModifyVisible(true);
  };
  // 分配菜单
  const dispatchMenus = (rowData: RoleResDto) => {
    dispatch({ type: 'role/setRowData', payload: rowData });
    setIsRoleMenuVisible(true);
  };

  // 分配接口
  const dispatchApi = (rowData: RoleResDto) => {
    dispatch({ type: 'role/setRowData', payload: rowData });
    setIsRoleApiVisible(true);
  };

  // 删除数据
  const deleteRow = (rowData: RoleResDto) => {
    dispatch({ type: 'role/setRowData', payload: rowData });
    confirm({
      icon: <ExclamationCircleOutlined />,
      content: <h3>您确定要删除该条数据？</h3>,
      async onOk() {
        const result = await RoleService.deleteRoleById(rowData.id);
        if (result) {
          message.success(result);
          reset();
        }
      },
    });
  };
  // 表格列数据
  const columns = [
    {
      title: '名称',
      dataIndex: 'name',
      align: 'right' as const,
      width: 100,
    },
    {
      title: '描述',
      dataIndex: 'description',
      align: 'right' as const,
      width: 200,
    },
    {
      title: '状态',
      dataIndex: 'status',
      align: 'center' as const,
      width: 60,
      render: (_: any, record: RoleResDto) => {
        if (Object.is(record.status, StatusEnum.NORMAL)) {
          return <img src={yesImg} />;
        } else {
          return <img src={noImg} />;
        }
      },
    },
    {
      title: '是否为默认角色',
      dataIndex: 'isDefault',
      align: 'center' as const,
      width: 80,
      render: (_: any, record: RoleResDto) => {
        if (Object.is(record.isDefault, RoleEnum.DEFAULT)) {
          return '是';
        } else {
          return '否';
        }
      },
    },
    {
      title: '操作',
      key: 'operation',
      align: 'center' as const,
      fixed: 'right' as const,
      width: 200,
      // 当前行的值，当前行数据，行索引
      render: (_: any, record: RoleResDto) => {
        return (
          <Space size="middle">
            <Button type="primary" onClick={() => modifyRow(record)}>
              编辑
            </Button>
            <Button onClick={() => dispatchMenus(record)}>分配菜单</Button>
            <Button onClick={() => dispatchApi(record)}>分配接口</Button>
            <Button type="primary" danger onClick={() => deleteRow(record)}>
              删除
            </Button>
          </Space>
        );
      },
    },
  ];
  return (
    <div className={styles.role}>
      <TopForm form={searchForm} submit={submit} reset={reset} />
      <Table columns={columns} rowKey="id" {...tableProps} bordered scroll={{ x: 1200 }} />
      {isModifyVisible && (
        <RoleModal
          isModifyVisible={isModifyVisible}
          setIsModifyVisible={setIsModifyVisible}
          loadData={reset}
        />
      )}
      {isRoleMenuVisible && (
        <RoleMenuModal
          isRoleMenuVisible={isRoleMenuVisible}
          setIsRoleMenuVisible={setIsRoleMenuVisible}
        />
      )}
      {isRoleApiVisible && (
        <RoleApiModal
          isRoleApiVisible={isRoleApiVisible}
          setIsRoleApiVisible={setIsRoleApiVisible}
        />
      )}
    </div>
  );
};

export default Role;
