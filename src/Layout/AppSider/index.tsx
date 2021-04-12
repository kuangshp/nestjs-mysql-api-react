import React, { useState, useMemo, PropsWithChildren, useEffect } from 'react';
import { Layout, Menu } from 'antd';
import { ObjectType } from '../../typings';
import styles from './index.module.css';
import { MenusProps } from './menus';
import { FolderOpenOutlined, FileTextOutlined } from '@ant-design/icons';
import { connect, useSelector } from 'dva';
import { RouteComponentProps, withRouter } from 'dva/router';
import { GlobalState } from '../../models/global';
import { MenusState } from 'src/models/menus';
import { getTreeList } from 'src/utils';
const { Sider } = Layout;
const { SubMenu } = Menu;

type Props = PropsWithChildren<RouteComponentProps & ReturnType<typeof mapStateToProps>>;

// 查找当前父节点
const findMenus = (menusList: Array<MenusProps>, currentPath: string): string | undefined => {
  let currentItem: MenusProps = { id: 0, name: '', url: '', parentId: 0 };
  // 递归查找
  function findItem(menusList: Array<MenusProps>) {
    for (const item of menusList) {
      if (item.children && item.children.length) {
        findItem(item.children);
      }
      if (item.url === currentPath) {
        currentItem = item;
      }
    }
  }
  findItem(menusList);
  return currentItem.id
    ? menusList.find((item: MenusProps) => item.id === currentItem.parentId)?.url
    : '';
};

const AppSider = (props: Props) => {
  const { location, history } = props;
  const [selectKey, setSelectKey] = useState<string[]>([]);
  const [openKey, setOpenKey] = useState<string[]>([]);
  const [menusDataList, setMenusDataList] = useState<MenusProps[]>([]);
  // 可以使用hooks代替下面的connect
  const { menusList } = useSelector((state: any): MenusState => state.present.menus);
  // 初始化菜单
  const initMenus = () => {
    // 格式化菜单成树结构
    const menusTree = getTreeList(menusList);
    setMenusDataList(menusTree);
  };

  useEffect(() => {
    initMenus();
  }, [menusList]);

  // 选择菜单的事件
  const selectMenuHandler = (ev: ObjectType) => {
    console.log('点击了菜单', ev);
    // 根据菜单去跳转页面
    const { key } = ev;
    const toPath = key && key.startsWith('/') ? key : `/${key}`;
    // 设置当前选中的
    // setSelectKey(key);
    console.log(openKey, selectKey);
    history.push(toPath);
  };
  // 刷新的时候默认选中
  useMemo(() => {
    if (Object.is(location.pathname, '/home')) {
      console.log('跳转到首页', location.pathname);
      setSelectKey([]);
      setOpenKey([]);
    } else {
      setSelectKey([location.pathname]);
      const openMenusKey = findMenus(menusDataList, location.pathname) as string;
      setOpenKey([openMenusKey]);
    }
  }, [location.pathname]);

  return (
    <Sider trigger={null} collapsible collapsed={props.collapsed} className={styles.app_sider}>
      <div className={styles.logo} onClick={() => history.push('/home')} />
      <Menu
        theme="dark"
        mode="inline"
        defaultSelectedKeys={selectKey}
        defaultOpenKeys={openKey}
        // selectedKeys={selectKey}
        onClick={selectMenuHandler}
      >
        {menusDataList.map((item: MenusProps) => {
          const renderMenu = (item: MenusProps) => {
            if (item.children && item.children.length) {
              return (
                <SubMenu
                  key={item.url}
                  icon={item.icon ? item.icon : <FolderOpenOutlined />}
                  title={item.name}
                >
                  {item.children.map((childrenItem: MenusProps) => renderMenu(childrenItem))}
                </SubMenu>
              );
            } else {
              return (
                <Menu.Item key={item.url} icon={item.icon ? item.icon : <FileTextOutlined />}>
                  {item.name}
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
const mapStateToProps = (state: any): GlobalState => state.present.global;

export default withRouter(connect(mapStateToProps)(AppSider));
