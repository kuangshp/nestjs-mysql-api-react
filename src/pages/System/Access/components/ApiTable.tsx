import React, { PropsWithChildren, useState } from 'react';
import { Space, Button, Table, Modal, message } from 'antd';
import AccessApiModal from './AccessApiModal';
import { AccessReqDto } from '../types/access.req.dto';
import { AccessResDto } from '../types/access.res.dto';
import { ExclamationCircleOutlined } from '@ant-design/icons';
import AccessService from 'src/services/system/access';
import { StatusEnum } from 'src/enums';
import { useDispatch } from 'dva';
const { confirm } = Modal;

type Props = PropsWithChildren<{
  apiTableData: any;
}>;

const ApiTable = (props: Props) => {
  const { apiTableData } = props;
  const [isAccessApiVisible, setIsAccessApiVisible] = useState<boolean>(false);
  const dispatch = useDispatch();

  const modifyApiHandler = (rowData: any) => {
    dispatch({ type: 'access/setRowData', payload: rowData });
  };
  const loadData = () => {
    console.log('加载');
  };
  // 删除数据
  const deleteApiHandler = (rowData: any) => {
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
      title: '接口名称',
      dataIndex: 'actionName',
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
      // render: (_: any, record: AccessResDto) => {
      //   if (Object.is(record.status, StatusEnum.FORBIDDEN)) {
      //     return (
      //       <Button type="primary" danger>
      //         禁用
      //       </Button>
      //     );
      //   } else {
      //     return <Button type="primary">启用</Button>;
      //   }
      // },
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
      <AccessApiModal
        isAccessApiVisible={isAccessApiVisible}
        setIsAccessApiVisible={setIsAccessApiVisible}
        loadData={loadData}
      />
    </div>
  );
};

export default ApiTable;
