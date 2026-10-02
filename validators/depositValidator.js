const {body} = require('express-validator')

const amount_validator_flow =[
    
    body('amount')
    .notEmpty().withMessage('Amount  required')
    .isNumeric().withMessage('Amount must be a number')
]

module.exports = {amount_validator_flow}