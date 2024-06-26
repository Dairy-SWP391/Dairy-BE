import * as CryptoJS from 'crypto-js';
import { createHash } from 'crypto';
import 'dotenv/config';

function sha256(content: string) {
  return createHash('sha256').update(content).digest('hex');
}
// cái này để lưu password thôi
export function hashPassword(password: string) {
  return sha256(password + process.env.SALT!);
}
// cái này để encrypt sensitive Information
export function encrypt(value: any): string {
  const parsedKey = CryptoJS.enc.Utf8.parse(process.env.KEY as any);
  const ciphertext = CryptoJS.AES.encrypt(value, parsedKey, {
    iv: parsedKey,
  }).toString();
  return ciphertext;
}
