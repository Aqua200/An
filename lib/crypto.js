const crypto = require('crypto');

// Function to encrypt a message
function encrypt(text, key) {
    const iv = crypto.randomBytes(16);
    const cipher = crypto.createCipheriv('aes-256-cbc', Buffer.from(key, 'hex'), iv);
    let encrypted = cipher.update(text, 'utf8', 'hex');
    encrypted += cipher.final('hex');
    return iv.toString('hex') + ':' + encrypted;
}

// Function to decrypt a message
function decrypt(text, key) {
    const textParts = text.split(':');
    const iv = Buffer.from(textParts.shift(), 'hex');
    const encryptedText = textParts.join(':');
    const decipher = crypto.createDecipheriv('aes-256-cbc', Buffer.from(key, 'hex'), iv);
    let decrypted = decipher.update(encryptedText, 'hex', 'utf8');
    decrypted += decipher.final('utf8');
    return decrypted;
}

// Function to generate a random key
function generateKey() {
    return crypto.randomBytes(32).toString('hex'); // Key should be 32 bytes for AES-256
}

// Example usage
const key = generateKey(); // Generating a random key
const message = "Hello, World!";
const encryptedMessage = encrypt(message, key);
const decryptedMessage = decrypt(encryptedMessage, key);

console.log("Generated Key:", key);
console.log("Encrypted Message:", encryptedMessage);
console.log("Decrypted Message:", decryptedMessage);

module.exports = { encrypt, decrypt, generateKey };
