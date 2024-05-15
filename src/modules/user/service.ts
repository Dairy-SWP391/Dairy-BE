import { signToken, verifyToken } from '~/utils/jwt';
import { TokenType, UserVerifyStatus } from './enum';
import { DatabaseInstance } from '~/database/database.services';
import { RegisterReqBody } from './requests';
import { hashPassword } from '~/utils/crypto';
import { USER_STATUS } from '@prisma/client';
import { generateId } from '~/utils/utils';

class UserService {
  private decodeRefreshToken(refresh_token: string) {
    return verifyToken({
      token: refresh_token,
      secretOrPublicKey: process.env.JWT_SECRET_REFRESH_TOKEN!,
    });
  }

  // viết hàm nhận vào user_id để bỏ vào payload và tạo access token
  private signAccessToken({ user_id, verify }: { user_id: string; verify: USER_STATUS }) {
    return signToken({
      payload: { user_id, verify, token_type: TokenType.AccessToken },
      options: { expiresIn: process.env.ACCESS_TOKEN_EXPIRE_IN },
      privateKey: process.env.JWT_SECRET_ACCESS_TOKEN!,
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

  private signEmailVerifyToken({ user_id, verify }: { user_id: string; verify: UserVerifyStatus }) {
    return signToken({
      payload: { user_id, verify, token_type: TokenType.EmailVerificationToken },
      options: { expiresIn: process.env.EMAIL_VERIFY_TOKEN_EXPIRE_IN },
      privateKey: process.env.JWT_SECRET_EMAIL_VERIFY_TOKEN!,
    });
  }

  private signForgotPasswordToken({
    user_id,
    verify,
  }: {
    user_id: string;
    verify: UserVerifyStatus;
  }) {
    return signToken({
      payload: { user_id, verify, token_type: TokenType.ForgotPasswordToken },
      options: { expiresIn: process.env.FORGOT_PASSWORD_TOKEN_EXPIRE_IN },
      privateKey: process.env.JWT_SECRET_FORGOT_PASSWORD_TOKEN!,
    });
  }

  // ký refresh_token và access_token
  private signAccessAndRefreshToken({ user_id, verify }: { user_id: string; verify: USER_STATUS }) {
    return Promise.all([
      this.signAccessToken({ user_id, verify }),
      this.signRefreshToken({ user_id, verify }),
    ]);
  }

  async getUserByEmail(email: string) {
    return await DatabaseInstance.getPrismaInstance().user.findUnique({
      where: {
        email,
      },
    });
  }

  async getUserByPhoneNumber(phone_number: string) {
    return await DatabaseInstance.getPrismaInstance().user.findUnique({
      where: {
        phone_number,
      },
    });
  }

  async register(registerBody: RegisterReqBody) {
    const { first_name, last_name, password, email, phone_number } = registerBody;
    const id = generateId('US');
    const user = await DatabaseInstance.getPrismaInstance().user.create({
      data: {
        id,
        first_name,
        last_name,
        password: hashPassword(password),
        email,
        phone_number,
      },
    });
    const [access_token, refresh_token] = await this.signAccessAndRefreshToken({
      user_id: user.id.toString(),
      verify: user.status,
    });

    const { iat, exp } = await this.decodeRefreshToken(refresh_token);

    await DatabaseInstance.getPrismaInstance().refreshToken.create({
      data: {
        user_id: user.id,
        token: refresh_token,
        iat: new Date(iat * 1000),
        exp: new Date(exp * 1000),
      },
    });

    return { access_token, refresh_token };
  }
}

const userService = new UserService();
export default userService;
