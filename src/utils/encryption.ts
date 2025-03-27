import CryptoJS from 'crypto-js';

export const encryptContent = (content: string, userId: string): string => {
  return CryptoJS.AES.encrypt(content, userId).toString();
};

export const decryptContent = (encryptedContent: string, userId: string): string => {
  const bytes = CryptoJS.AES.decrypt(encryptedContent, userId);
  return bytes.toString(CryptoJS.enc.Utf8);
};