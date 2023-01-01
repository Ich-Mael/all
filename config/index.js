require('dotenv').config();

module.exports = {
    DB: process.env.APP_DB,
    PORT: process.env.APP_PORT,
    MAIL_PASSWORD: process.env.MAIL_PASSWORD,
    SG_API_KEY : process.env.SG_API_KEY,
    EMAIL_FROM : process.env.EMAIL_FROM,
    SG_API_KEY_PASSWORD: process.env.SG_API_KEY_PASSWORD, 
    SECRET: process.env.APP_SECRET || 'Thisismysecret'
};
