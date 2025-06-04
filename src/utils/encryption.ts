
import CryptoJS from 'crypto-js';

const SECRET_KEY = 'osfm-markdown-editor-key'; // In production, this should be user-specific

export const encryptContent = (content: string): string => {
  try {
    return CryptoJS.AES.encrypt(content, SECRET_KEY).toString();
  } catch (error) {
    console.error('Encryption error:', error);
    return content;
  }
};

export const decryptContent = (encryptedContent: string): string => {
  try {
    const bytes = CryptoJS.AES.decrypt(encryptedContent, SECRET_KEY);
    const decrypted = bytes.toString(CryptoJS.enc.Utf8);
    return decrypted || encryptedContent;
  } catch (error) {
    console.error('Decryption error:', error);
    return encryptedContent;
  }
};

export const generateNoteId = (): string => {
  return Date.now().toString(36) + Math.random().toString(36).substr(2);
};
