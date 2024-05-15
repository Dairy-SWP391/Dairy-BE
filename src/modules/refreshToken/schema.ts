export interface IRefreshTokenType {
  id: number;
  token: string;
  user_id: number;
  created_at: Date;
  iat: Date;
  exp: Date;
}
