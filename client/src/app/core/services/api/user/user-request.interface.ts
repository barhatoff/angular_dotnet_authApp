import { UserRole } from '@shared/models/user.model';

export interface UpdateAvatarRequest {
  avatar: string;
}
export interface UpdateNicknameRequest {
  nickname: string;
}
export interface UpdatePasswordRequest {
  password: string;
  newPassword: string;
}
// Admin only
export interface UpdateUserRoleRequest {
  email: string;
  role: UserRole;
}
