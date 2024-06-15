export interface IRefreshTokenType {
  id: number;
  token: string;
  user_id: number;
  created_at: Date;
  iat: number;
  exp: number;
}
export default class RefreshToken {
  token: string;
  created_at: Date;
  user_id: number;
  exp: Date;
  iat: Date;
  constructor({ token, created_at, user_id, exp, iat }: IRefreshTokenType) {
    this.token = token;
    this.created_at = created_at || new Date();
    this.user_id = user_id;
    this.iat = new Date(iat * 1000);
    this.exp = new Date(exp * 1000);
  }
}
