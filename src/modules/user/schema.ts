import { ROLE, USER_STATUS } from '@prisma/client';

export interface IUserType {
  id: string;
  first_name: string;
  last_name: string;
  phone_number: string | null;
  email: string;
  password: string;
  role: ROLE;
  created_at: Date;
  updated_at: Date;
  status: USER_STATUS;
  avatar_url?: string;
  address?: string;
}

export default class User {
  id: string;
  first_name: string;
  last_name: string;
  phone_number?: string;
  email: string;
  password: string;
  role?: ROLE;
  created_at: Date;
  updated_at: Date;
  status?: USER_STATUS;
  avatar_url?: string;
  address?: string;
  constructor(user: IUserType) {
    this.id = user.id;
    this.first_name = user.first_name || '';
    this.last_name = user.last_name || '';
    this.phone_number = user.phone_number || '';
    this.password = user.password;
    this.email = user.email;
    this.role = user.role || ROLE.MEMBER;
    this.created_at = user.created_at;
    this.updated_at = user.updated_at;
    this.status = user.status || USER_STATUS.UNVERIFIED;
    this.avatar_url = user.avatar_url || '';
    this.address = user.address || '';
  }
}
