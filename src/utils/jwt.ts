import jwt from 'jsonwebtoken';
import { TokenPayload } from '../modules/user/requests';

export const signToken = ({
  payload,
  privateKey = process.env.JWT_SECRET_KEY!,
  options = { algorithm: 'HS256' },
}: {
  payload: string | object | Buffer;
  privateKey?: string;
  options?: jwt.SignOptions;
}) => {
  return new Promise<string>((resolve, reject) => {
    jwt.sign(payload, privateKey, options, (err, token) => {
      if (err) throw reject(err);
      resolve(token!);
    });
  });
};

export const verifyToken = ({
  token,
  secretOrPublicKey = process.env.JWT_SECRET_KEY!,
}: {
  token: string;
  secretOrPublicKey: string;
}) => {
  return new Promise<TokenPayload>((resolve, reject) => {
    jwt.verify(token, secretOrPublicKey, (error, decoded) => {
      if (error) return reject(error);
      resolve(decoded as TokenPayload);
    });
  });
};
