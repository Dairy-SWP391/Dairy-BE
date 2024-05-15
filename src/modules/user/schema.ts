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
}

// export default class User {
//   _id: number;
//   first_name: string;
//   last_name: string;
//   phone_number?: string;
//   email?: string;
//   password: string;
//   role?: UserRole;
//   created_at: Date;
//   updated_at: Date;
//   status?: UserVerifyStatus;
//   avatar_url?: string;
//   constructor(user: UserType) {
//     this._id = user._id;
//     this.first_name = user.first_name || '';
//     this.last_name = user.last_name || '';
//     this.phone_number = user.phone_number || '';
//     this.password = user.password;
//     this.email = user.email || '';
//     this.role = user.role || UserRole.Customer;
//     this.created_at = user.created_at;
//     this.updated_at = user.updated_at;
//     this.status = user.status || UserVerifyStatus.UNVERIFIED;
//     this.avatar_url = user.avatar_url || '';
//   }
// }
