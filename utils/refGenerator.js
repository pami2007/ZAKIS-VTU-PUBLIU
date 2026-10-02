const crypto = require("crypto");

function generateReference(prefix = "ZAKI") {
    const now = new Date();

    const date =
        now.getFullYear().toString() +
        String(now.getMonth() + 1).padStart(2, "0") +
        String(now.getDate()).padStart(2, "0");

    const time =
        String(now.getHours()).padStart(2, "0") +
        String(now.getMinutes()).padStart(2, "0") +
        String(now.getSeconds()).padStart(2, "0") +
        String(now.getMilliseconds()).padStart(3, "0");

    // 12 random hexadecimal characters (48 bits of randomness)
    const random = crypto.randomBytes(6).toString("hex").toUpperCase();

    return `${prefix}-${date}${time}-${random}`;
}

module.exports = generateReference;