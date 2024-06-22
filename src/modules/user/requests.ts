import { JwtPayload } from 'jsonwebtoken';
import { TokenType, UserVerifyStatus } from './enum';

export interface RegisterReqBody {
  first_name: string;
  last_name: string;
  phone_number?: string;
  email: string;
  password: string;
}

export interface LoginRequestBody {
  username?: string;
  email?: string;
  phone_number?: string;
  password: string;
}

export interface TokenPayload extends JwtPayload {
  user_id: string;
  token_type: TokenType;
  verify: UserVerifyStatus;
  iat: number;
  exp: number;
}

export interface ForgotPasswordReqBody {
  email: string;
}
export interface ResetPasswordReqBody {
  email_phone: string;
  forgot_password_token: string;
  password: string;
  confirm_password: string;
}
export interface UpdateMeReqBody {
  first_name?: string;
  last_name?: string;
  phone_number?: string;
  avatar_url?: string;
  address?: string;
}
export interface UpdateUserReqBody {
  user_id: string;
  status: UserVerifyStatus;
}
export interface deleteUserReqBody {
  user_id: string;
}
export interface AddProductToWishListBodyReq {
  product_id: number;
}
export interface DeleteProductFromWishlistReqBody {
  product_id: number;
}
