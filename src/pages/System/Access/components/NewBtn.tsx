import React, { useState } from 'react';
import { Button } from 'antd';
import AccessModal from './AccessModal';

const NewBtn = () => {
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
        isAccessModalVisible={isAccessModalVisible}
        setIsAccessModalVisible={setIsAccessModalVisible}
      />
    </div>
  );
};

export default NewBtn;
