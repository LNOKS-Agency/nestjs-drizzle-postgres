import { Exclude } from 'class-transformer';
import { UserRole } from '../../../enum/user-role';

export class UserDto {
  id: number;
  email: string;
  firstName: string;
  lastName: string;
  role: UserRole;
  @Exclude()
  password: string;

  constructor(partial: Partial<UserDto>) {
    Object.assign(this, partial);
  }
}
