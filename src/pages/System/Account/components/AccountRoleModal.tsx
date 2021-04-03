import React, { PropsWithChildren } from 'react';
import { Modal } from 'antd';
import { AccountResDto } from '../types/account.res.dto';

type Props = PropsWithChildren<{
  isRoleModifyVisible: boolean;
  setIsRoleModifyVisible: (isShow: boolean) => void;
  loadData: () => void;
  rowData?: AccountResDto;
}>;

const AccountRoleModal = (props: Props) => {
  const { isRoleModifyVisible, setIsRoleModifyVisible } = props;
  const handleModifyOk = () => {
    setIsRoleModifyVisible(false);
  };
  const handleModifyCancel = () => {
    setIsRoleModifyVisible(false);
  };
  return (
    <Modal
      title="给账号分配角色"
      visible={isRoleModifyVisible}
      onOk={handleModifyOk}
      onCancel={handleModifyCancel}
    >
      <h1>测试</h1>
    </Modal>
  );
};

export default AccountRoleModal;
