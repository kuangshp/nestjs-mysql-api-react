import React, { PropsWithChildren } from 'react';
import { Space, Button, Table } from 'antd';

type Props = PropsWithChildren<{
  apiTableData: any;
}>;

const ApiTable = (props: Props) => {
  const { apiTableData } = props;
  const columns = [
    { title: '接口名称', dataIndex: 'actionName' },
    { title: '请求方式', dataIndex: 'method' },
    { title: 'url地址', dataIndex: 'url' },
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
  return (
    <div>
      <Table columns={columns} dataSource={apiTableData} pagination={false} rowKey="id" />
    </div>
  );
};

export default ApiTable;
