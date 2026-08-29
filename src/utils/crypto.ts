/**
 * Web Cryptography API (SubtleCrypto) Engine
 * Implements RSA-OAEP + AES-256-GCM Hybrid End-to-End Encryption
 */

export interface KeyPairBundle {
  publicKey: CryptoKey;
  privateKey: CryptoKey;
  publicKeyJWK: string;
  publicKeyFingerprint: string;
}

export interface EncryptedPacket {
  encryptedKey: string; // Base64 encrypted AES key
  iv: string; // Base64 12-byte IV
  ciphertext: string; // Base64 encrypted text/media
  fingerprint: string;
}

// Convert ArrayBuffer to Base64
export function bufferToBase64(buffer: ArrayBuffer): string {
  const bytes = new Uint8Array(buffer);
  let binary = '';
  for (let i = 0; i < bytes.byteLength; i++) {
    binary += String.fromCharCode(bytes[i]);
  }
  return window.btoa(binary);
}

// Convert Base64 to ArrayBuffer
export function base64ToBuffer(base64: string): ArrayBuffer {
  const binary = window.atob(base64);
  const bytes = new Uint8Array(binary.length);
  for (let i = 0; i < binary.length; i++) {
    bytes[i] = binary.charCodeAt(i);
  }
  return bytes.buffer;
}

// Generate RSA-OAEP Key Pair (2048-bit, SHA-256)
export async function generateUserKeyPair(): Promise<KeyPairBundle> {
  const keyPair = await window.crypto.subtle.generateKey(
    {
      name: 'RSA-OAEP',
      modulusLength: 2048,
      publicExponent: new Uint8Array([1, 0, 1]),
      hash: 'SHA-256',
    },
    true,
    ['encrypt', 'decrypt']
  );

  const exportedJWK = await window.crypto.subtle.exportKey('jwk', keyPair.publicKey);
  const jwkString = JSON.stringify(exportedJWK);

  // Compute a short SHA-256 fingerprint for UI badges & safety codes
  const encoder = new TextEncoder();
  const digest = await window.crypto.subtle.digest('SHA-256', encoder.encode(jwkString));
  const hashArray = Array.from(new Uint8Array(digest));
  const hex = hashArray.map(b => b.toString(16).padStart(2, '0')).join('');
  const shortFingerprint = hex.substring(0, 12).toUpperCase().match(/.{1,4}/g)?.join('-') || hex.substring(0, 8);

  return {
    publicKey: keyPair.publicKey,
    privateKey: keyPair.privateKey,
    publicKeyJWK: jwkString,
    publicKeyFingerprint: shortFingerprint,
  };
}

// Import public key from JWK string
export async function importPublicKey(jwkString: string): Promise<CryptoKey> {
  const jwk = JSON.parse(jwkString);
  return await window.crypto.subtle.importKey(
    'jwk',
    jwk,
    {
      name: 'RSA-OAEP',
      hash: 'SHA-256',
    },
    true,
    ['encrypt']
  );
}

// Encrypt plaintext for recipient using recipient's public key
export async function encryptE2EEMessage(
  plaintext: string,
  recipientPublicKeyJWK: string
): Promise<EncryptedPacket> {
  const recipientKey = await importPublicKey(recipientPublicKeyJWK);

  // 1. Generate one-time AES-256-GCM symmetric session key
  const sessionKey = await window.crypto.subtle.generateKey(
    {
      name: 'AES-GCM',
      length: 256,
    },
    true,
    ['encrypt', 'decrypt']
  );

  // 2. Encrypt plaintext with AES-GCM
  const iv = window.crypto.getRandomValues(new Uint8Array(12));
  const encoder = new TextEncoder();
  const encodedPlaintext = encoder.encode(plaintext);

  const encryptedData = await window.crypto.subtle.encrypt(
    {
      name: 'AES-GCM',
      iv: iv,
    },
    sessionKey,
    encodedPlaintext
  );

  // 3. Export raw session key and encrypt it using recipient's RSA-OAEP public key
  const exportedRawKey = await window.crypto.subtle.exportKey('raw', sessionKey);
  const encryptedSessionKey = await window.crypto.subtle.encrypt(
    {
      name: 'RSA-OAEP',
    },
    recipientKey,
    exportedRawKey
  );

  // 4. Compute fingerprint from recipient key
  const digest = await window.crypto.subtle.digest('SHA-256', encoder.encode(recipientPublicKeyJWK));
  const hashArray = Array.from(new Uint8Array(digest));
  const hex = hashArray.map(b => b.toString(16).padStart(2, '0')).join('');
  const shortFp = hex.substring(0, 8).toUpperCase();

  return {
    encryptedKey: bufferToBase64(encryptedSessionKey),
    iv: bufferToBase64(iv.buffer),
    ciphertext: bufferToBase64(encryptedData),
    fingerprint: shortFp,
  };
}

// Decrypt message packet using user's private key
export async function decryptE2EEMessage(
  packet: EncryptedPacket,
  userPrivateKey: CryptoKey
): Promise<string> {
  try {
    // 1. Decrypt AES session key with user's RSA private key
    const encryptedKeyBuffer = base64ToBuffer(packet.encryptedKey);
    const rawSessionKey = await window.crypto.subtle.decrypt(
      {
        name: 'RSA-OAEP',
      },
      userPrivateKey,
      encryptedKeyBuffer
    );

    // 2. Import session key for AES-GCM
    const sessionKey = await window.crypto.subtle.importKey(
      'raw',
      rawSessionKey,
      {
        name: 'AES-GCM',
      },
      false,
      ['decrypt']
    );

    // 3. Decrypt ciphertext with session key and IV
    const ivBuffer = base64ToBuffer(packet.iv);
    const ciphertextBuffer = base64ToBuffer(packet.ciphertext);

    const decryptedBuffer = await window.crypto.subtle.decrypt(
      {
        name: 'AES-GCM',
        iv: new Uint8Array(ivBuffer),
      },
      sessionKey,
      ciphertextBuffer
    );

    const decoder = new TextDecoder();
    return decoder.decode(decryptedBuffer);
  } catch (err) {
    console.error('E2EE Decryption error:', err);
    return '🔒 [Encrypted Message - Private Key Verification Failed]';
  }
}

// Generate Signal-style Safety Numbers (6 chunks of 5 numbers) for cryptographic peer verification
export async function generateSafetyNumbers(keyA: string, keyB: string): Promise<string[]> {
  const combined = [keyA, keyB].sort().join('::');
  const encoder = new TextEncoder();
  const digest = await window.crypto.subtle.digest('SHA-512', encoder.encode(combined));
  const bytes = new Uint8Array(digest);

  const chunks: string[] = [];
  for (let i = 0; i < 6; i++) {
    // Combine 4 bytes to form a 5-digit number
    const num = ((bytes[i * 4] << 24) | (bytes[i * 4 + 1] << 16) | (bytes[i * 4 + 2] << 8) | bytes[i * 4 + 3]) >>> 0;
    const chunk = (num % 100000).toString().padStart(5, '0');
    chunks.push(chunk);
  }
  return chunks;
}
