require('dotenv').config()

module.exports = {
   apiKey: process.env.VTPASS_API_KEY ,
  secretKey: process.env.VTPASS_SK_KEY,
  primaryKey:process.env.VTPASS_PK_KEY,
  baseUrl: process.env.VTPASS_BASE_URL,
  baseUrlverify: process.env.VTPASS_BASE_URL_VERIFY,
  vtpassrequryurl: process.env.VTPASS_REQURY_URL
}