const {body} = require('express-validator')

const phone_validator_flow =[
    
    body('phone')
    .notEmpty().withMessage('Phone number required')
    .isNumeric().withMessage('Phone number must be a number')
    .isLength({min:11, max:11})
    .withMessage('Phone number must be 11 characters')
]

module.exports = {phone_validator_flow}