import crypto from "crypto"

// Securely store this key, do NOT hard-code in production
const ENCRYPTION_KEY = process.env.ENCRYPTION_KEY || "testdefault-32bytes:123456789012";
const ENABLE_ENCRYPTION = false 
  
if (!ENCRYPTION_KEY || ENCRYPTION_KEY.length !== 32) {
    throw new Error("ENCRYPTION_KEY environment variable must be set and 32 bytes long");
}
const IV_LENGTH = 16; // For AES, this is always 16

export function encrypt(text: string): string {
    if (!ENABLE_ENCRYPTION) {
        return text
    }
    const iv = crypto.randomBytes(IV_LENGTH);
    const cipher = crypto.createCipheriv('aes-256-cbc', Buffer.from(ENCRYPTION_KEY), iv);
    let encrypted = cipher.update(text);
    encrypted = Buffer.concat([encrypted, cipher.final()]);
    return iv.toString('hex') + ':' + encrypted.toString('hex');
}

export function decrypt(text: string): string {
    if (!ENABLE_ENCRYPTION) {
        return text
    }
    const textParts = text.split(':');
    const iv = Buffer.from(textParts.shift() as string, 'hex');
    const encryptedText = Buffer.from(textParts.join(':'), 'hex');
    const decipher = crypto.createDecipheriv('aes-256-cbc', Buffer.from(ENCRYPTION_KEY), iv);
    let decrypted = decipher.update(encryptedText);
    decrypted = Buffer.concat([decrypted, decipher.final()]);
    return decrypted.toString();
}