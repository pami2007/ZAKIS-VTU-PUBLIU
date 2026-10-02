const {body} = require('express-validator')

const user_validator_flow= [
    body('fname').trim()
    .notEmpty()
    .withMessage('First Name required')
    .isLength({min:3, max:20})
    .withMessage('First Name must between 3 and 20 characters'),

    body('lname').trim()
    .notEmpty()
    .withMessage('Last Name required')
    .isLength({min:3, max:20})
    .withMessage('Last Name must between 3 and 20 characters'),

    body('email')
    .notEmpty().withMessage('Email address required')
    .normalizeEmail()
    .withMessage('Enter a valid email address'),

    body('phone')
    .notEmpty().withMessage('Phone number required')
    .isNumeric().withMessage('Phone number must be a number')
    .isLength({min:11, max:11})
    .withMessage('Phone number must be 11 characters'),

    body('password')
    .notEmpty().withMessage('Password Required')
    .isLength({min:6}).withMessage('Password must be at least 6 characters')
    .isStrongPassword()
    .withMessage('Password must contain leters, numbers, and special characters. Eg(abc123!@#$) '),
    
    body('confirm_password')
    .notEmpty().withMessage('confirm_Password Required')
    .isLength({min:6})
    .withMessage('Password must be at least 6 characters')
    .isStrongPassword()
    .withMessage('Password must contain leters, numbers, and special characters. Eg(abc123!@#$) ')

]

module.exports = {user_validator_flow}