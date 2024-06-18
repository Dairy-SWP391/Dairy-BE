import { signToken, verifyToken } from '~/utils/jwt';
import { TokenType, UserVerifyStatus } from './enum';
import { DatabaseInstance } from '~/database/database.services';
import { RegisterReqBody, UpdateMeReqBody, UpdateUserReqBody } from './requests';
import { hashPassword } from '~/utils/crypto';
import { ROLE, USER_STATUS } from '@prisma/client';
import { generateId } from '~/utils/utils';
import axios from 'axios';
import { ErrorWithStatus } from '../error/entityError';
import HTTP_STATUS from '~/constants/httpsStatus';
import { USER_MESSAGES } from './messages';
import { upperCase } from 'lodash';

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

  private signForgotPasswordToken({ user_id, verify }: { user_id: string; verify: USER_STATUS }) {
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
        forgot_password_token: '',
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

  async login({ user_id, verify }: { user_id: string; verify: USER_STATUS }) {
    // dùng cái user_id tạo access và refresh token
    const [access_token, refresh_token] = await this.signAccessAndRefreshToken({
      user_id,
      verify,
    });

    const { exp, iat } = await this.decodeRefreshToken(refresh_token);
    // lưu refresh token vào database
    await DatabaseInstance.getPrismaInstance().refreshToken.create({
      data: {
        user_id,
        token: refresh_token,
        iat: new Date(iat * 1000),
        exp: new Date(exp * 1000),
      },
    });
    return { access_token, refresh_token };
  }

  async forgotPassword({ user_id, verify }: { user_id: string; verify: USER_STATUS }) {
    const forgot_password_token = await this.signForgotPasswordToken({ user_id, verify });

    await DatabaseInstance.getPrismaInstance().user.update({
      where: {
        id: user_id,
      },
      data: {
        updated_at: new Date(),
        forgot_password_token: forgot_password_token as string,
      },
    });

    console.log('forgot_password_token: ', forgot_password_token);
    return forgot_password_token;
  }

  async getMe(user_id: string) {
    return await DatabaseInstance.getPrismaInstance().user.findUnique({
      where: {
        id: user_id,
      },
      select: {
        id: true,
        first_name: true,
        last_name: true,
        phone_number: true,
        email: true,
        created_at: true,
        updated_at: true,
        role: true,
        status: true,
      },
    });
  }

  private async getGoogleToken(code: string) {
    const body = {
      code,
      client_id: process.env.GOOGLE_CLIENT_ID!,
      client_secret: process.env.GOOGLE_CLIENT_SECRET!,
      redirect_uri: process.env.GOOGLE_REDIRECT_URI!,
      grant_type: 'authorization_code',
    };
    const { data } = await axios.post('https://oauth2.googleapis.com/token', body, {
      headers: {
        'Content-Type': 'application/json',
      },
    });

    return { access_token: data.access_token as string, id_token: data.id_token as string };
  }

  async getUserInfoFromOauth(access_token: string, id_token: string) {
    const { data } = await axios.get('https://www.googleapis.com/oauth2/v1/userinfo', {
      params: {
        access_token,
        alt: 'json',
      },
      headers: {
        Authorization: `Bearer ${id_token}`,
      },
    });
    return data as {
      id: string;
      email: string;
      verified_email: boolean;
      name: string;
      given_name: string;
      family_name: string;
      picture: string;
      locale: string;
    };
  }

  async oAuth(code: string) {
    const { access_token, id_token } = await this.getGoogleToken(code);
    const userinfo = await this.getUserInfoFromOauth(access_token, id_token);

    if (userinfo.verified_email === false) {
      throw new ErrorWithStatus({
        message: USER_MESSAGES.EMAIL_NOT_VERIFIED,
        status: HTTP_STATUS.BAD_REQUEST, // 400
      });
    }
    const user = await this.getUserByEmail(userinfo.email);

    if (user) {
      const [access_token, refresh_token] = await this.signAccessAndRefreshToken({
        user_id: user.id.toString(),
        verify: user.status,
      });

      const { exp, iat } = await this.decodeRefreshToken(refresh_token);
      await DatabaseInstance.getPrismaInstance().refreshToken.create({
        data: {
          user_id: user.id,
          token: refresh_token,
          exp: new Date(exp * 1000),
          iat: new Date(iat * 1000),
        },
      });
      return { access_token, refresh_token, new_user: 0, verify: user.status };
    } else {
      const password = Math.random().toString(36).slice(1, 15);
      const data = await this.register({
        email: userinfo.email,
        first_name: userinfo.given_name,
        last_name: userinfo.family_name,
        password: password,
        phone_number: '',
      });
      return {
        ...data,
        new_user: 1,
        verify: USER_STATUS.UNVERIFIED,
      };
    }
  }

  async resetPassword(user_id: string, password: string) {
    return await DatabaseInstance.getPrismaInstance().user.update({
      where: {
        id: user_id,
      },
      data: {
        forgot_password_token: '',
        password: hashPassword(password),
        updated_at: new Date(),
      },
    });
  }

  async updateMe(user_id: string, payload: UpdateMeReqBody) {
    return await DatabaseInstance.getPrismaInstance().user.update({
      where: {
        id: user_id,
      },
      data: {
        ...payload,
        updated_at: new Date(),
      },
    });
  }

  async getAccessToken(user_id: string, verify: USER_STATUS) {
    const access_token = await this.signAccessToken({
      user_id,
      verify,
    });

    return { access_token };
  }

  async getAllUsers(role: string) {
    if (role === ROLE.ADMIN) {
      return await DatabaseInstance.getPrismaInstance().user.findMany({
        where: {
          role: {
            not: ROLE.ADMIN,
          },
        },
      });
    } else {
      return await DatabaseInstance.getPrismaInstance().user.findMany({
        where: {
          role: ROLE.MEMBER,
        },
      });
    }
  }

  async updateUser(payload: UpdateUserReqBody) {
    return await DatabaseInstance.getPrismaInstance().user.update({
      where: {
        id: payload.user_id,
      },
      data: {
        status: upperCase(payload.status) as USER_STATUS,
      },
    });
  }

  async deleteUser(user_id: string) {
    await DatabaseInstance.getPrismaInstance().address.deleteMany({
      where: {
        user_id,
      },
    });
    await DatabaseInstance.getPrismaInstance().order.deleteMany({
      where: {
        user_id,
      },
    });
    await DatabaseInstance.getPrismaInstance().refreshToken.deleteMany({
      where: {
        user_id,
      },
    });
    return await DatabaseInstance.getPrismaInstance().user.delete({
      where: {
        id: user_id,
      },
    });
  }
}
const userService = new UserService();
export default userService;
