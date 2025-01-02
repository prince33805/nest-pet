import * as crypto from 'crypto';
import * as dotenv from 'dotenv';
dotenv.config();

const PUBLIC_KEY = process.env.PUBLIC_KEY?.replace(/\\n/g, '\n');
const PRIVATE_KEY = process.env.PRIVATE_KEY?.replace(/\\n/g, '\n');

export function encryptData(data: string): string {
  const buffer = Buffer.from(data, 'utf8');
  const encrypted = crypto.publicEncrypt(PUBLIC_KEY, buffer);
  return encrypted.toString('base64');
}

export function decryptData(encryptedData: string): string {
  const buffer = Buffer.from(encryptedData, 'base64');
  const decrypted = crypto.privateDecrypt(
    {
      key: PRIVATE_KEY,
      passphrase: '',
    },
    buffer,
  );
  return decrypted.toString('utf8');
}
