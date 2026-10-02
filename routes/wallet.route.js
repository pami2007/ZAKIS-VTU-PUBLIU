const express = require("express");

const router = express.Router();
const monnifyService = require('../api/monify.service')
const walletController = require("../controllers/wallet.controller");
const IsAutenticated = require('../controllers/user.controller')
const asyncHandler = require('../middleware/AsyncHandler')
const admin_controller = require('../controllers/admin.controller')
const {amount_validator_flow} = require('../validators/depositValidator')
const amount_logic = require('../middleware/user.validate.middleware')



router.get("/deposit",IsAutenticated.isAuthenticated,admin_controller.suspend_acc('suspend'), asyncHandler(walletController.depositepage));

router.post("/deposit",amount_validator_flow,amount_logic.amount_validate,  asyncHandler(walletController.deposit));

router.post("/webhook/verify",  asyncHandler(walletController.webhook) );

router.post('/vtpass/webhook',  asyncHandler(walletController.vtpass_webhook))

router.post('/claim/:id/cashback',admin_controller.suspend_acc('suspend'), asyncHandler(walletController.cash_back))
module.exports = router;