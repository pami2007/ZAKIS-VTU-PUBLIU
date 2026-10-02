const crypto = require("crypto");
const AppError = require("../utils/AppError");

class walletService {
    async verifySignature(req) {
    const monnifySignature =
        req.headers["monnify-signature"];
    if (!monnifySignature) {
        return false;
    }

    const requestBody =
        JSON.stringify(req.body);

    const computedSignature =
        crypto
            .createHmac(
                "sha512",
                process.env.MONNIFY_SECRET_KEY
            )
            .update(requestBody)
            .digest("hex");

   if (

    computedSignature.length !==

    monnifySignature.length

) {

    return false;

}

return crypto.timingSafeEqual(

    Buffer.from(computedSignature),

    Buffer.from(monnifySignature)

);

}

}

module.exports =new walletService()