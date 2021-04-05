const allMenus = [
  { "id": 1, "key": "1", "title": "系统管理", "parentId": null },
  { "id": 2, "key": "2", "title": "账号管理", "parentId": 1 },
  { "id": 3, "key": "3", "title": "角色管理", "parentId": 1 },
  { "id": 4, "key": "4", "title": "资源管理", "parentId": 1 },
];

const checked = [{ "id": 1, "accessId": 1 }, { "id": 2, "accessId": 2 }];

const fullCheckNodeId = (fetchCheckedList) => {
  const checkedList = fetchCheckedList.map((item) => item.accessId);
  for (const item of allMenus) {
    console.log(checkedList.includes(item.id) && !item.parentId, '是否为真', item);
    // 当前包括在此项中且父节点是null的时候，删除
    if (checkedList.includes(item.id) && !item.parentId) {
      const index = checkedList.findIndex((it) => it == item.id);
      checkedList.splice(index, 1);
    }
  }
  console.log(checkedList, '最后的');
  return checkedList.map(item => String(item));
};

console.log(fullCheckNodeId(checked));
