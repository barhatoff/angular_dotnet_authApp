export type UserRole = 'Admin' | 'User' | 'Guest';
export interface UserDto {
  email: string;
  nickname: string;
  avatar: string;
  role: UserRole;
}
export interface UserDtoTable {
  id: string;
  email: string;
  nickname: string;
  role: UserRole;
}
