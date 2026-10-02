const wallet_service = require('../services/wallet.service.logic')
const MonnifyService = require('../api/monify.service');
const vtpass_webhook = require('../services/status.checker.service')
const AppError = require('../utils/AppError');


class WalletController {

    async depositepage(req,res){
        return res.render("deposit");
    }

    async deposit(req, res, next) {
        try {
            const { amount } = req.validators;
            const cal_amount = (amount * 1.02)
            const user = req.user; // Assuming you have user information in the request object
            const transaction = await wallet_service.wallet_funding(
                user,
                amount,
                cal_amount
            );
            return res.redirect(transaction.transactions.checkoutUrl);
        } catch (err) {
            if(err instanceof AppError){
                req.flash('error', err.message)
                return req.session.save((saveErr)=>{
                    if(saveErr){return next(saveErr)}
                    return res.redirect('/deposit')
                })
            }
        }
    }

    async webhook(req, res, next) {
    //console.log("Webhook received:", req.body); // Log the entire request body for debugging
    try {
        await wallet_service.webhook_confirmation(req);
        return res.sendStatus(200);
    }
    catch (error) {
        next(error);
    }
}

    async vtpass_webhook(req,res,next){
        //console.log("VTpass Webhook received:", req.body); // Log the entire request body for debugging
        try{
            await vtpass_webhook.vtpass_webhooks(req)
            
            return res.json({
                response:'success'
            })
        }catch(err){
            next(err)
        }
    }

    async cash_back(req,res,next){
        try{
            const {id} = req.params
            const user_id = await wallet_service.cashBack(id)
            const  bal = user_id.user_ID.bal
            const cashBack = user_id.user_ID.cashBack
            const total_cb = user_id.user_ID.total_cb
            const CB_logic = await wallet_service.cashBack_logic(id,bal,cashBack,total_cb)
            console.log(CB_logic.message)
            req.flash(
                'success', CB_logic.message
            )
            return req.session.save((saveErr)=>{
                if(saveErr){return next(saveErr)};
                return res.redirect('/')
            })
        }catch(err){
            if(err instanceof AppError){
                req.flash('error', err.message)
                return req.session.save((saveErr)=>{
                    if(saveErr){return next(saveErr)}
                    return res.redirect('/user/profile')
                })
            }
        }
    }



}

module.exports = new WalletController();


