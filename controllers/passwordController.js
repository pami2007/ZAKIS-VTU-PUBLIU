const crypto = require("crypto");
const bcrypt = require("bcrypt");
const AppError = require("../utils/AppError");
const db = require("../config/database");
const resend = require("../config/email");


class password_controller_flow {

    // ==========================================
    // FORGOT PASSWORD
    // ==========================================

    async forgotPassword(req, res) {

        try {

            const { email } = req.body;

            if (!email) {
                throw new AppError(
                    "Email is required."
                );
            }

            // Find user
            const [users] = await db.execute(
                "SELECT id, email FROM myusers WHERE email = ? LIMIT 1",
                [email]
            );

            /*
                Don't reveal whether the email exists.
            */

            if (users.length === 0) {

                return res.render(
                    "emailReceive"
                );

            }

            const user = users[0];

            // Generate secure reset token
            const token = crypto
                .randomBytes(32)
                .toString("hex");

            // Hash token before storing it
            const tokenHash = crypto
                .createHash("sha256")
                .update(token)
                .digest("hex");

            // Token expires in 30 minutes
            const expiresAt = new Date(
                Date.now() + 30 * 60 * 1000
            );

            // Remove previous reset tokens
            await db.execute(
                "DELETE FROM password_resets WHERE user_id = ?",
                [user.id]
            );

            // Save hashed token
            await db.execute(
                `INSERT INTO password_resets
                (user_id, token_hash, expires_at)
                VALUES (?, ?, ?)`,
                [
                    user.id,
                    tokenHash,
                    expiresAt
                ]
            );

            // Create reset URL
            const resetLink =
                `${process.env.APP_URL}/reset-password/${token}`;

            // Send reset email
            const { error } = await resend.emails.send({

                from: process.env.EMAIL_FROM,

                to: [user.email],

                subject: "Reset Your Zaki Sub Password",

                html: `
                    <div style="font-family: Arial, sans-serif;">

                        <h2>Password Reset</h2>

                        <p>
                            We received a request to reset
                            your Zaki Sub password.
                        </p>

                        <p>
                            Click the button below to create
                            a new password.
                        </p>

                        <a
                            href="${resetLink}"
                            style="
                                display:inline-block;
                                padding:12px 20px;
                                background:#8B5E34;
                                color:white;
                                text-decoration:none;
                                border-radius:5px;
                            "
                        >
                            Reset Password
                        </a>

                        <p>
                            This link will expire in 30 minutes.
                        </p>

                        <p>
                            If you didn't request this,
                            you can safely ignore this email.
                        </p>

                    </div>
                `
            });

            if (error) {

                console.error(error);

                req.flash('error', 'Your request could not be process. Make sure you are connected to the internet.' || 'ERROR ON THE SERVER')

                return req.session.save((saveErr)=>{
                    if(saveErr){return next(saveErr)}
                    return res.redirect('/forgot-password')
                })

            }

            // EJS response instead of JSON
            return res.render(
                "emailReceive"
            );

        } catch (error) {

            console.error(error);

            throw error;
        }

    }


    // ==========================================
    // SHOW RESET PASSWORD PAGE
    // ==========================================

    async showResetPassword(req, res) {

        try {

            const { token } = req.params;

            if (!token) {
                throw new AppError(
                    "Invalid reset link."
                );
            }

            // Hash token
            const tokenHash = crypto
                .createHash("sha256")
                .update(token)
                .digest("hex");

            // Check token
            const [rows] = await db.execute(
                `SELECT user_id
                 FROM password_resets
                 WHERE token_hash = ?
                 AND expires_at > NOW()
                 LIMIT 1`,
                [tokenHash]
            );

            if (rows.length === 0) {

                throw new AppError(
                    "This reset link is invalid or has expired."
                );

            }

            // IMPORTANT:
            // Send token to EJS so the form can use it

            return res.render(
                "reset-password",
                {
                    token
                }
            );

        } catch (error) {

            console.error(error);

            throw error;
        }

    }


    // ==========================================
    // RESET PASSWORD
    // ==========================================

    async resetPassword(req, res) {

        try {

            const { token } = req.params;

            const { password, confirmPassword } = req.body;

            if (!token || !password) {

                throw new AppError(
                    "Invalid request."
                );

            }

            // Check password length
            if (password.length < 6) {

                throw new AppError(
                    "Password must be at least 6 characters."
                );

            }

            // Check passwords match
            if (password !== confirmPassword) {

                throw new AppError(
                    "Passwords do not match."
                );

            }

            // Hash reset token
            const tokenHash = crypto
                .createHash("sha256")
                .update(token)
                .digest("hex");

            // Find valid reset token
            const [rows] = await db.execute(
                `SELECT user_id
                 FROM password_resets
                 WHERE token_hash = ?
                 AND expires_at > NOW()
                 LIMIT 1`,
                [tokenHash]
            );

            if (rows.length === 0) {

                throw new AppError(
                    "Reset link is invalid or expired."
                );

            }

            const userId = rows[0].user_id;

            // ==========================================
            // HASH NEW PASSWORD
            // ==========================================

            const hashedPassword =
                await bcrypt.hash(password, 10);

            // Update password
            await db.execute(
                `UPDATE myusers
                 SET password = ?
                 WHERE id = ?`,
                [
                    hashedPassword,
                    userId
                ]
            );

            // Delete reset token
            await db.execute(
                `DELETE FROM password_resets
                 WHERE token_hash = ?`,
                [tokenHash]
            );

            // EJS response instead of JSON
            return res.render(
                "password-reset-success"
            );

        } catch (error) {

            console.error(error);

            throw error;
        }

    }

}


module.exports = new password_controller_flow();