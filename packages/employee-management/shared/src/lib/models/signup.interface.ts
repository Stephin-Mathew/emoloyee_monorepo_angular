export interface UserPermissions {
  add: boolean;
  edit: boolean;
  delete: boolean;
}

export type UserRole = 'admin' | 'user';

export interface SignupDetails {
  name: string;
  username: string;
  email: string;
  password: string;
  role?: UserRole;
  permissions?: UserPermissions;
}
