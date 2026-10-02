const { body } = require('express-validator');

const eletricity_validator_flow = [

    // ==============================
    // ELECTRICITY PROVIDER
    // ==============================
    body('meter_provider')
        .trim()
        .notEmpty()
        .withMessage('Electricity provider is required')
        .bail(),

    // ==============================
    // METER TYPE
    // ==============================
    body('meter_type')
        .trim()
        .notEmpty()
        .withMessage('Meter type is required')
        .bail()
        .isIn(['prepaid', 'postpaid'])
        .withMessage('Invalid meter type'),

    // ==============================
    // METER NUMBER
    // ==============================
    body('meter_number')
        .trim()
        .notEmpty()
        .withMessage('Meter number is required')
        .bail()
        .isNumeric()
        .withMessage('Meter number must contain only digits')
        .bail()
        .isLength({ min: 11, max: 15 })
        .withMessage('Meter number must be between 11 and 15 digits'),

    // ==============================
    // PHONE NUMBER
    // ==============================
    body('phone')
        .optional({ checkFalsy: true })
        .trim()
        .isNumeric()
        .withMessage('Phone number must contain only digits')
        .bail()
        .isLength({ min: 11, max: 11 })
        .withMessage('Phone number must be exactly 11 digits'),

    // ==============================
    // AMOUNT
    // ==============================
    body('amount')
        .trim()
        .notEmpty()
        .withMessage('Amount is required')
        .bail()
        .isInt({ min: 2000 })
        .withMessage('Amount must be a whole number of at least ₦2,000')

];

module.exports = {
    eletricity_validator_flow
};