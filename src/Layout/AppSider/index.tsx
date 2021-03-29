import React, { useState, useMemo, PropsWithChildren } from 'react';
import { Layout, Menu } from 'antd';
import { ObjectType, CombinedState } from '../../typings';
import styles from './index.module.css';
import { menusDataList, MenusProps } from './menus';
import { FolderOpenOutlined, FileTextOutlined } from '@ant-design/icons';
import { storage } from './../../utils';
import { authToken } from '../../config';
import { connect } from 'dva';
import { RouteComponentProps, withRouter } from 'dva/router';
import { GlobalState } from '../../models/global';
const { Sider } = Layout;
const { SubMenu } = Menu;

type Props = PropsWithChildren<RouteComponentProps & ReturnType<typeof mapStateToProps>>;

// 查找当前父节点
const findMenus = (menusList: Array<MenusProps>, currentPath: string): string | undefined => {
  let currentItem: MenusProps = { id: 0, label: '', value: '', parentId: 0 };
  // 递归查找
  function findItem(menusList: Array<MenusProps>) {
    for (const item of menusList) {
      if (item.children && item.children.length) {
        findItem(item.children);
      }
      if (item.value === currentPath) {
        currentItem = item;
      }
    }
  }
  findItem(menusList);
  return currentItem.id
    ? menusList.find((item: MenusProps) => item.id === currentItem.parentId)?.value
    : '';
};

const AppSider = (props: Props) => {
  const { location, history } = props;
  const [selectKey, setSelectKey] = useState<string>('');
  const [openKey, setOpenKey] = useState<string>('');

  // 选择菜单的事件
  const selectMenuHandler = (ev: ObjectType) => {
    console.log('点击了菜单', ev);
    // 根据菜单去跳转页面
    const { key } = ev;
    const toPath = key && key.startsWith('/') ? key : `/${key}`;
    history.push(toPath);
  };
  // 刷新的时候默认选中
  useMemo(() => {
    setSelectKey(location.pathname);
    setOpenKey(() => findMenus(menusDataList, location.pathname) as string);
  }, [location.pathname]);

  return (
    <Sider trigger={null} collapsible collapsed={props.collapsed} className={styles.app_sider}>
      <div className={styles.logo} />
      <Menu
        theme="dark"
        mode="inline"
        defaultSelectedKeys={[selectKey]}
        defaultOpenKeys={[openKey]}
        onClick={selectMenuHandler}
      >
        {menusDataList.map((item: MenusProps) => {
          const renderMenu = (item: MenusProps) => {
            if (item.children && item.children.length) {
              return (
                <SubMenu
                  key={item.value}
                  icon={item.icon ? item.icon : <FolderOpenOutlined />}
                  title={item.label}
                >
                  {item.children.map((childrenItem: MenusProps) => renderMenu(childrenItem))}
                </SubMenu>
              );
            } else {
              return (
                <Menu.Item key={item.value} icon={item.icon ? item.icon : <FileTextOutlined />}>
                  {item.label}
                </Menu.Item>
              );
            }
          };
          return renderMenu(item);
        })}
      </Menu>
    </Sider>
  );
};
const mapStateToProps = (state: CombinedState): GlobalState => state.global;

export default withRouter(connect(mapStateToProps)(AppSider));
