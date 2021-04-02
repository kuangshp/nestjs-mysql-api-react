import React, { PropsWithChildren } from 'react';
import { Modal } from 'antd';

type Props = PropsWithChildren<{
  isModifyVisible: boolean;
  setIsModifyVisible: (isShow: boolean) => void;
}>;

const AccountModal = (props: Props) => {
  const { isModifyVisible, setIsModifyVisible } = props;
  const handleModifyOk = () => {
    console.log('编辑');
    setIsModifyVisible(false);
  };
  const handleModifyCancel = () => {
    setIsModifyVisible(false);
  };

  return (
    <>
      <Modal
        title="Basic Modal"
        visible={isModifyVisible}
        onOk={handleModifyOk}
        onCancel={handleModifyCancel}
      >
        <p>Some contents...</p>
        <p>Some contents...</p>
        <p>Some contents...</p>
      </Modal>
    </>
  );
};

export default AccountModal;
