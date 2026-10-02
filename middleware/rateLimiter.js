

                        const rateLimit = require("express-rate-limit");
const AppError = require("../utils/appError");

class rate_limiting_flow{
   loginLimiter = rateLimit({
    windowMs: 15 * 60 * 1000,
    limit: 5,
    //
    standardHeaders: true,
    legacyHeaders: false,
   // skipSuccessfulRequests:true

    handler:async (req, res, next) => {
        next(new AppError(
            "Too many failed login attempts. Please try again in 15 minute.",
            429
        ));
    }
});

 forgotPasswordLimiter = rateLimit({
    windowMs: 15 * 60 * 1000,
    limit: 5,
    standardHeaders: true,
    legacyHeaders: false,

    handler:async (req, res, next) => {
        next(new AppError(
            "Too many password reset requests. Please try again later.",
            429
        ));
    }
});


}

module.exports = new rate_limiting_flow()