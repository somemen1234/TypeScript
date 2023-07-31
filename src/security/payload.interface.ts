import { UserStatus } from 'src/users/user-status.enum';

export interface Payload {
  user_id: number;
  name: string;
  is_admin: UserStatus;
  point: number;
}
