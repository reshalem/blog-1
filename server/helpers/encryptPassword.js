const crypto = require('crypto');

function encryptPassword(password) {
    return crypto.createHmac('sha256', process.env.ENCRYPTION_SECRET)
                    .update(password)
                    .digest('hex');
}

module.exports = encryptPassword;