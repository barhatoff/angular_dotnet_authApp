import { UserDtoTable } from '@shared/models/user.model';

export function isUserDto(obj: any): obj is UserDtoTable {
  return (
    typeof obj === 'object' &&
    obj !== null &&
    'email' in obj &&
    typeof obj.email === 'string' &&
    'nickname' in obj &&
    typeof obj.nickname === 'string' &&
    'role' in obj &&
    typeof obj.role === 'string'
  );
}
