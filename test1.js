const allMenus = [
  { "id": 10, "key": "10", "title": "测试模块", "parentId": 0 }, 
  { "id": 2, "key": "2", "title": "账号管理", "parentId": 1 }, 
  { "id": 3, "key": "3", "title": "角色管理", "parentId": 1 }, 
  { "id": 4, "key": "4", "title": "资源管理", "parentId": 1 }, 
  { "id": 1, "key": "1", "title": "系统管理", "parentId": 0 }
]
for (const item of allMenus) {
  if (item.parentId === 0) {
    const child = allMenus.find(it => it.parentId == item.id);
    console.log(child);
  } else {
    console.log('不需要判断');
  }
}