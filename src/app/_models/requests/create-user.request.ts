import { SaveUserRequest } from './save-user.request';

export interface CreateUserRequest extends SaveUserRequest {
  email: string;
  password: string;
}
