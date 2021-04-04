import React, { useState, PropsWithChildren } from 'react';
import { Button } from 'antd';
import AccessModal from './AccessModal';

type Props = PropsWithChildren<{
  loadData: () => void;
}>;
const NewBtn = (props: Props) => {
  const { loadData } = props;
  const [isAccessModalVisible, setIsAccessModalVisible] = useState<boolean>(false);
  const createNewAccessHandler = () => {
    setIsAccessModalVisible(true);
  };
  return (
    <div className="top" style={{ justifyContent: 'flex-end' }}>
      <Button type="primary" onClick={createNewAccessHandler}>
        新增模块
      </Button>
      <AccessModal
        loadData={loadData}
        isAccessModalVisible={isAccessModalVisible}
        setIsAccessModalVisible={setIsAccessModalVisible}
      />
    </div>
  );
};

export default NewBtn;
