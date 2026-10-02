const {body} = require('express-validator')

const eletricity_validator_flows= [
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


]

module.exports = {eletricity_validator_flows}