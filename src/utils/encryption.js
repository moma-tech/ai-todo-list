/**
 * @fileoverview Encryption Utility
 * @description Provides ChaCha20-Poly1305 encryption/decryption for secure data storage.
 * Uses Node.js built-in crypto module.
 */

const crypto = require('crypto');
const fs = require('fs');
const path = require('path');

/**
 * Encryption configuration
 */
const ALGORITHM = 'chacha20-poly1305';
const KEY_LENGTH = 32; // 256 bits
const NONCE_LENGTH = 12; // 96 bits for ChaCha20-Poly1305
const AUTH_TAG_LENGTH = 16;

/**
 * @typedef {Object} EncryptedData
 * @property {string} nonce - Base64 encoded nonce
 * @property {string} tag - Base64 encoded authentication tag
 * @property {string} data - Base64 encoded encrypted data
 */

/**
 * Get or generate the encryption key
 * @description Reads key from KEY_FILE env var or generates a new one
 * @returns {Buffer} The encryption key
 */
function getKey() {
  const keyPath = process.env.KEY_FILE || path.join(__dirname, '../../data/.key');
  
  if (fs.existsSync(keyPath)) {
    return fs.readFileSync(keyPath);
  }
  
  const newKey = crypto.randomBytes(KEY_LENGTH);
  fs.mkdirSync(path.dirname(keyPath), { recursive: true });
  fs.writeFileSync(keyPath, newKey, { mode: 0o600 });
  console.log(`Generated new encryption key at: ${keyPath}`);
  
  return newKey;
}

/**
 * Encrypt data using ChaCha20-Poly1305
 * @param {string|Object} plaintext - Data to encrypt
 * @returns {EncryptedData} Encrypted data with nonce and auth tag
 * 
 * @example
 * const encrypted = encrypt({ id: 1, title: 'Test' });
 * // Returns: { nonce: '...', tag: '...', data: '...' }
 */
function encrypt(plaintext) {
  const key = getKey();
  const nonce = crypto.randomBytes(NONCE_LENGTH);
  
  const data = typeof plaintext === 'string' 
    ? plaintext 
    : JSON.stringify(plaintext);
  
  const cipher = crypto.createCipheriv(ALGORITHM, key, nonce, {
    authTagLength: AUTH_TAG_LENGTH
  });
  
  const encrypted = Buffer.concat([
    cipher.update(data, 'utf8'),
    cipher.final()
  ]);
  
  const tag = cipher.getAuthTag();
  
  return {
    nonce: nonce.toString('base64'),
    tag: tag.toString('base64'),
    data: encrypted.toString('base64')
  };
}

/**
 * Decrypt data using ChaCha20-Poly1305
 * @param {EncryptedData} encryptedData - Encrypted data object
 * @returns {string} Decrypted plaintext
 * 
 * @example
 * const decrypted = decrypt({ nonce: '...', tag: '...', data: '...' });
 * // Returns: '{"id":1,"title":"Test"}'
 */
function decrypt(encryptedData) {
  const key = getKey();
  const nonce = Buffer.from(encryptedData.nonce, 'base64');
  const tag = Buffer.from(encryptedData.tag, 'base64');
  const data = Buffer.from(encryptedData.data, 'base64');
  
  const decipher = crypto.createDecipheriv(ALGORITHM, key, nonce, {
    authTagLength: AUTH_TAG_LENGTH
  });
  
  decipher.setAuthTag(tag);
  
  const decrypted = Buffer.concat([
    decipher.update(data),
    decipher.final()
  ]);
  
  return decrypted.toString('utf8');
}

/**
 * Decrypt and parse JSON data
 * @param {EncryptedData} encryptedData - Encrypted data object
 * @returns {Object} Parsed JSON object
 */
function decryptJSON(encryptedData) {
  const plaintext = decrypt(encryptedData);
  return JSON.parse(plaintext);
}

module.exports = {
  encrypt,
  decrypt,
  decryptJSON,
  getKey
};
