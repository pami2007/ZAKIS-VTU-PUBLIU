require('dotenv').config()

module.exports = {
   apiKey: process.env.MONNIFY_API_KEY,
  secretKey: process.env.MONNIFY_SECRET_KEY,
  contractCode: process.env.MONNIFY_CONTRACT_CODE,
  baseUrl: process.env.MONNIFY_BASE_URL,
  redirectUrl: process.env.MONNIFY_REDIRECT_URL,
}