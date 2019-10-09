// const host = 'http://www.dtc233.com/api/admin/'
const host = '/bfl/'
// export const ERR_OK = 200

// 登录接口
// export const loginUrl = host + 'admin/login';

export default{
  login: host + 'admin/login/login',
  //role
  getAdminRolePageList: host + "admin/role/getAdminRolePageList",
  insertAdminRole: host + "admin/role/insertAdminRole",
  updateAdminRole: host + "admin/role/updateAdminRole",
  deletedAdminRole: host + "admin/role/deletedAdminRole/",
  getMenuListByRoleId: host + "admin/roleMenu/getMenuListByRoleId/",
  insertAdminRoleMenu: host + "admin/roleMenu/insertAdminRoleMenu",
  //user
  getAdminUserPageList: host + "admin/user/getAdminUserPageList",
  insertAdminUser: host + "admin/user/insertAdminUser",
  editAdminUser: host + "admin/user/updateAdminUser",
  deletedAdminUserByUserId: host + "admin/user/deletedAdminUserByUserId/",
  //menu
  getMenuPageList: host + "admin/menu/getMenuPageList",
  insertMenu: host + "admin/menu/insertMenu",
  updateMenu: host + "admin/menu/updateMenu",
  deletedMenuByMenuId: host + "admin/menu/deletedMenuByMenuId/",
  //CONST
  ERR_OK: 200,
  ERR_NO: 500,
  UNLOGIN: 4001,
  UNAUTH: 4002
}
