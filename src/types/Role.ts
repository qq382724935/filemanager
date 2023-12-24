export type RoleType = { roleName: string; roleCode: string };

export interface RoleDataType extends RoleType {
  id: string;
  createDate?: string;
  userIdList?: string[];
  permissionIdList?: string[];
  updateDate?: string;
}
