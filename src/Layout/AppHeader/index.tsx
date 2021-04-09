import React, { PropsWithChildren, useState } from 'react';
import { Layout, Menu, Dropdown, Modal } from 'antd';
import { MenuUnfoldOutlined, MenuFoldOutlined, ExclamationCircleOutlined } from '@ant-design/icons';
import { storage } from './../../utils';
import { authToken } from '../../config';
import { connect, useDispatch, useSelector } from 'dva';
import styles from './index.module.less';
import { GlobalState } from '../../models/global';
import { LoginState } from 'src/models/login';
import ModifyPasswordModal from './components/ModifyPasswordModal';
import { RouteComponentProps } from 'react-router';

// eslint-disable-next-line @typescript-eslint/no-var-requires
const { withRouter } = require('dva').router;

const { Header } = Layout;
const { confirm } = Modal;

type Props = PropsWithChildren<RouteComponentProps & ReturnType<typeof mapStateToProps>>;

const AppHeader = (props: Props) => {
  const [isModifyVisible, setIsModifyVisible] = useState<boolean>(false);
  const dispatch = useDispatch();
  // 从状态中获取用户信息
  const { userInfo } = useSelector((state: any): LoginState => state.present.login);
  // 退出操作
  const logoutHandler = () => {
    confirm({
      icon: <ExclamationCircleOutlined />,
      content: <h3>您确定要退出系统？</h3>,
      onOk() {
        console.log('OK');
        storage.removeItem(authToken);
        setTimeout(() => {
          props.history.push('/login');
        });
      },
      onCancel() {
        console.log('Cancel');
      },
    });
  };

  // 修改密码
  const modifyHandler = () => {
    setIsModifyVisible(true);
  };

  // 打开和关闭左侧菜单按钮事件
  const toggleHandler = () => {
    dispatch({ type: 'global/toggleMenusCollapsed' });
  };

  const menu = (
    <Menu>
      <Menu.Item>
        <div>个人设置</div>
      </Menu.Item>
      <Menu.Item onClick={modifyHandler}>
        <div>修改密码</div>
      </Menu.Item>
      <Menu.Item onClick={logoutHandler}>
        <div>退出</div>
      </Menu.Item>
    </Menu>
  );
  return (
    <Header className={styles.app_header} style={{ padding: 0 }}>
      {React.createElement(props.collapsed ? MenuUnfoldOutlined : MenuFoldOutlined, {
        className: `${styles.trigger}`,
        onClick: toggleHandler,
      })}
      <div className={styles.header_view}>
        {/* 用户中心 */}
        <div className={styles.user_info}>
          <span>{userInfo?.username}</span>
          <Dropdown overlay={menu}>
            <img
              className={styles.avatar}
              src={'http://amin-1302640623.cos.ap-nanjing.myqcloud.com/tmp/cat.jpg'}
              alt="用户头像"
            />
          </Dropdown>
        </div>
      </div>
      {/* 修改密码弹框 */}
      <ModifyPasswordModal
        isModifyVisible={isModifyVisible}
        setIsModifyVisible={setIsModifyVisible}
      />
    </Header>
  );
};

const mapStateToProps = (state: any): GlobalState => state.present.global;

export default withRouter(connect(mapStateToProps)(AppHeader));
