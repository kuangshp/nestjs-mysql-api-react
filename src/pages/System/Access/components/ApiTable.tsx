import React, { PropsWithChildren, useState } from 'react';
import { Space, Button, Table, Modal, message } from 'antd';
import AccessApiModal from './AccessApiModal';
import { AccessResDto } from '../types/access.res.dto';
import { ExclamationCircleOutlined } from '@ant-design/icons';
import AccessService from 'src/services/system/access';
import { StatusEnum } from 'src/enums';
import { useDispatch } from 'dva';
import yesImg from 'src/assets/images/yes.gif';
import noImg from 'src/assets/images/no.gif';
// import { AccessState } from 'src/models/system/access';
const { confirm } = Modal;

type Props = PropsWithChildren<{
  apiTableData: AccessResDto[];
  loadData: () => void;
}>;

const ApiTable = (props: Props) => {
  const { apiTableData, loadData } = props;
  const [isAccessApiVisible, setIsAccessApiVisible] = useState<boolean>(false);
  const dispatch = useDispatch();
  // const { accessRowData } = useSelector((state: any): AccessState => state.present.access);

  const modifyApiHandler = (rowData: AccessResDto) => {
    dispatch({ type: 'access/setRowData', payload: rowData });
    setIsAccessApiVisible(true);
  };
  // 删除数据
  const deleteApiHandler = (rowData: AccessResDto) => {
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
      title: '接口名称',
      dataIndex: 'apiName',
      align: 'right' as const,
    },
    {
      title: '请求方式',
      dataIndex: 'method',
      align: 'center' as const,
    },
    {
      title: 'url地址',
      dataIndex: 'url',
      align: 'right' as const,
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
          <Button type="primary" onClick={() => modifyApiHandler(record)}>
            编辑
          </Button>
          <Button type="primary" danger onClick={() => deleteApiHandler(record)}>
            删除
          </Button>
        </Space>
      ),
    },
  ];
  return (
    <div>
      <Table columns={columns} dataSource={apiTableData} pagination={false} rowKey="id" />
      {isAccessApiVisible && (
        <AccessApiModal
          isAccessApiVisible={isAccessApiVisible}
          setIsAccessApiVisible={setIsAccessApiVisible}
          loadData={loadData}
        />
      )}
    </div>
  );
};

export default ApiTable;
