import { USER_STATUS } from '@prisma/client';
import { signToken, verifyToken } from '~/utils/jwt';
import { TokenType } from '../user/enum';
import { DatabaseInstance } from '~/database/database.services';

class RefreshTokenService {
  private decodeRefreshToken(refresh_token: string) {
    return verifyToken({
      token: refresh_token,
      secretOrPublicKey: process.env.JWT_SECRET_REFRESH_TOKEN!,
    });
  }

  private signRefreshToken({
    user_id,
    verify,
    exp,
  }: {
    user_id: string;
    verify: USER_STATUS;
    exp?: number;
  }) {
    if (exp) {
      return signToken({
        payload: { user_id, verify, token_type: TokenType.RefreshToken, exp },
        privateKey: process.env.JWT_SECRET_REFRESH_TOKEN!,
      });
    } else {
      return signToken({
        payload: { user_id, verify, token_type: TokenType.RefreshToken },
        options: { expiresIn: process.env.REFRESH_TOKEN_EXPIRE_IN },
        privateKey: process.env.JWT_SECRET_REFRESH_TOKEN!,
      });
    }
  }

  private signAccessToken({ user_id, verify }: { user_id: string; verify: USER_STATUS }) {
    return signToken({
      payload: { user_id, verify, token_type: TokenType.AccessToken },
      options: { expiresIn: process.env.ACCESS_TOKEN_EXPIRE_IN },
      privateKey: process.env.JWT_SECRET_ACCESS_TOKEN!,
    });
  }

  async refreshToken({
    user_id,
    verify,
    refresh_token,
    exp,
  }: {
    user_id: string;
    verify: USER_STATUS;
    refresh_token: string;
    exp: number;
  }) {
    // tạo ra access_token va refresh_token moi
    const [access_token, new_refresh_token] = await Promise.all([
      this.signAccessToken({ user_id, verify }),
      this.signRefreshToken({ user_id, verify, exp }),
    ]);

    const { iat } = await this.decodeRefreshToken(refresh_token);
    // xóa RT cũ
    await DatabaseInstance.getPrismaInstance().refreshToken.delete({
      where: {
        token: refresh_token,
      },
    });
    // thêm RT mới
    await DatabaseInstance.getPrismaInstance().refreshToken.create({
      data: {
        //  new RefreshToken({ token: new_refresh_token, user_id: user_id, iat, exp })
        token: new_refresh_token,
        user_id,
        iat: new Date(iat * 1000),
        exp: new Date(exp * 1000),
      },
    });
    return { access_token, refresh_token: new_refresh_token };
  }
}
const refreshTokenService = new RefreshTokenService();
export default refreshTokenService;
