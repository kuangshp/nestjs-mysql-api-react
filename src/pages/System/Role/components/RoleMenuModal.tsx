import React, { PropsWithChildren } from 'react';
import { Modal } from 'antd';

type Props = PropsWithChildren<{
  isRoleMenuVisible: boolean;
  setIsRoleMenuVisible: (flag: boolean) => void;
}>;

const RoleMenuModal = (props: Props) => {
  const { isRoleMenuVisible, setIsRoleMenuVisible } = props;
  const handleOk = () => {
    console.log('提交');
  };
  const handleCancel = () => {
    console.log('取消');
    setIsRoleMenuVisible(false);
  };

  return (
    <Modal
      title="给角色分配菜单"
      visible={isRoleMenuVisible}
      onOk={handleOk}
      onCancel={handleCancel}
    >
      <h1>测试</h1>
    </Modal>
  );
};

export default RoleMenuModal;
