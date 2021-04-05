import React, { useState, PropsWithChildren } from 'react';
import { Button } from 'antd';
import AccessModuleModal from './AccessModuleModal';
import { useDispatch } from 'dva';

type Props = PropsWithChildren<{
  loadData: () => void;
}>;
const NewBtn = (props: Props) => {
  const { loadData } = props;
  const [isAccessModalVisible, setIsAccessModalVisible] = useState<boolean>(false);
  const dispatch = useDispatch();
  const createNewAccessHandler = () => {
    dispatch({ type: 'access/setRowData', payload: null });
    setIsAccessModalVisible(true);
  };
  return (
    <div className="top" style={{ justifyContent: 'flex-end' }}>
      <Button type="primary" onClick={createNewAccessHandler}>
        新增模块
      </Button>
      <AccessModuleModal
        loadData={loadData}
        isAccessModalVisible={isAccessModalVisible}
        setIsAccessModalVisible={setIsAccessModalVisible}
      />
    </div>
  );
};

export default NewBtn;
