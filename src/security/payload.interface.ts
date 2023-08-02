import { UserStatus } from 'src/users/user-status.enum';

export interface Payload {
  id: number;
  name: string;
  is_admin: UserStatus;
  point: number;
}
