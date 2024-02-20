const crypto = require("crypto");

// Secret key (should be kept confidential)
const key = Buffer.from(process.env.CRYPTO_KEY, "hex");

const encryptData = (data) => {
  const iv = crypto.randomBytes(16); // Generate a new IV for each encryption
  const cipher = crypto.createCipheriv("aes-256-cbc", key, iv);
  let encrypted = cipher.update(data, "utf8", "base64");
  encrypted += cipher.final("base64");
  const ivAndEncryptedData = iv.toString("hex") + ":" + encrypted; // Combine IV and encrypted data
  return ivAndEncryptedData;
};

const decryptData = (ivAndEncryptedData) => {
  const parts = ivAndEncryptedData.split(":"); // Split the IV and encrypted data
  const iv = Buffer.from(parts[0], "hex");
  const encryptedData = parts[1];
  const decipher = crypto.createDecipheriv("aes-256-cbc", key, iv);
  let decrypted = decipher.update(encryptedData, "base64", "utf8");
  decrypted += decipher.final("utf8");
  return decrypted;
};

module.exports = {
  encryptField: (value) => encryptData(value),
  decryptField: (value) => decryptData(value),
  encryptData,
  decryptData,
};
