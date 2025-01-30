const crypto = require('crypto');

// Function to encrypt a message
function encrypt(text, key) {
    const iv = crypto.randomBytes(16);
    const cipher = crypto.createCipheriv('aes-256-cbc', Buffer.from(key), iv);
    let encrypted = cipher.update(text);
    encrypted = Buffer.concat([encrypted, cipher.final()]);
    return iv.toString('hex') + ':' + encrypted.toString('hex');
}

// Function to decrypt a message
function decrypt(text, key) {
    const textParts = text.split(':');
    const iv = Buffer.from(textParts.shift(), 'hex');
    const encryptedText = Buffer.from(textParts.join(':'), 'hex');
    const decipher = crypto.createDecipheriv('aes-256-cbc', Buffer.from(key), iv);
    let decrypted = decipher.update(encryptedText);
    decrypted = Buffer.concat([decrypted, decipher.final()]);
    return decrypted.toString();
}

// Example usage
const key = crypto.randomBytes(32); // Key should be 32 bytes for AES-256
const message = "Hello, World!";
const encryptedMessage = encrypt(message, key);
const decryptedMessage = decrypt(encryptedMessage, key);

console.log("Encrypted Message:", encryptedMessage);
console.log("Decrypted Message:", decryptedMessage);
