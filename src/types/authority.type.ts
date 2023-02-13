export interface RoleDto {
  id: string | number
  roleName: string
  description: string
  createTime: string
  updateTime: string
}

export interface UserDto {
  userId: number
  email: string
  userName: string
  apps: string[]
  createTime: string
  roles: RoleDto
}

export interface OwnerVo {
  id?: string | number
  userName: string
  email: string
}

export interface DomainDetailVo extends Omit<RoleDto, 'roleName'> {
  name: string
  owner: OwnerVo
  creator: OwnerVo
  admins: OwnerVo[]
  code: string
}

export interface NoticeDto {
  channelType: number
  modeTypes: number[]
  dailyNotifyTime?: string
}
