const express = require("express");
const limit = require('../middleware/rateLimiter')
const router = express.Router();

const password_controller_flow =
    require('../controllers/passwordController');


// Forgot password page
router.get(
    "/forgot-password", limit.forgotPasswordLimiter,
    (req, res) => {
        res.render("forgot-password");
    }
);


// Submit email
router.post(
    "/forgot-password",
    password_controller_flow.forgotPassword.bind(
        password_controller_flow
    )
);


// Open reset link
router.get(
    "/reset-password/:token",
    password_controller_flow.showResetPassword.bind(
        password_controller_flow
    )
);


// Submit new password
router.post(
    "/reset-password/:token",
    password_controller_flow.resetPassword.bind(
        password_controller_flow
    )
);


module.exports = router;