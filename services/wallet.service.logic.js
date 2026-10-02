const monnifyService = require("../api/monify.service");
const txn_model = require('../model/transactionDB')
const pool = require('../config/database')
const reference_generator = require('../utils/refGenerator');
const AppError = require("../utils/AppError");
const verifySignatures = require('../services/wallet.service')
const my_users = require('../model/userDB')

class wallet_service_flow{
    static async wallet_funding(user, amount,cal_amount){
        const connection = await pool.getConnection()
        try{
            const transactions = await monnifyService.initializeTransaction(user,cal_amount)
            //console.log(amount)
            await connection.beginTransaction()
            await txn_model.lock_Rows(connection, user.id)
            const  ref_id = reference_generator()
            await txn_model.deposit_Transaction_details(
                connection,
                user.id,
                'DEPOSIT',
                 amount,
                 `pending`,
                 ref_id,
                 'Wallet Funding',
                 transactions.paymentReference,
                 transactions.transactionReference)

            await connection.commit()
            return{
                transactions
            }
            
        }catch(error){
            await connection.rollback()
            throw new AppError(
                    error.message || "An error occurred while initiating the transaction."
        );
        }finally{
            await connection.release()
        }
    }

    //Webhook for monify
    static async webhook_confirmation(req){
        //console.log(req.body)
        if(!(await verifySignatures.verifySignature(req))){
            throw new AppError('Invalid Signature')
        }

        const { paymentReference,transactionReference} = req.body.eventData;



        const connection = await pool.getConnection()
        try{
            await connection.beginTransaction();
            const transaction = await txn_model.getTransactionByReference(
                connection,
                paymentReference
            );

        if (!transaction) {throw new AppError("Transaction not found");}

       if (transaction.status !== "PENDING") {
        await connection.rollback();
        return;
        }

        const payment = await monnifyService.verifyTransaction(transactionReference)

        if (payment.paymentStatus.toUpperCase() !== "PAID") {throw new AppError("Payment not successful");}

        /*if (Number(payment.amountPaid)!== Number(transaction.amount)
        ) {
            throw new AppError("Amount mismatch");
        }*/
       //console.log(payment.fee)
        
        if (payment.paymentReference !==  transaction.payment_reference) {
            throw new AppError("Reference mismatch");
        }
        const profit = (payment.amountPaid - transaction.amount - payment.fee)
            await txn_model.fund_wallet(connection,transaction.amount,transaction.userId)
            await txn_model.updateStatus(connection,`successful`,transaction.ref_id)
            await txn_model.paid_amount(connection,payment.fee, transaction.ref_id )
            await txn_model.profit(connection,profit,transaction.ref_id)
            await connection.commit()
        }catch(error){
            await connection.rollback()
            throw error;
        }finally{
            await connection.release()
        }
    }

    static async cashBack(id){
        const user_ID = await my_users.userID(id)
        return{user_ID}
    }





    static async cashBack_logic(id,bal,cashBack,total_cb){
        
        const connection = await pool.getConnection()
        try{
            await connection.beginTransaction()
            await txn_model.lock_Rows(connection,id)
            const ref_id = reference_generator()
            
            if(Number(100) > Number(cashBack)){
                throw new AppError('The minimun withdrawal for cash back is 100 naira')
            }

            await txn_model.lock_Rows(connection, id)
            await txn_model.record_cashback_txn(
                connection,
                Number(id),
                cashBack,
                'pending',
                ref_id,
                'Cashback withdrawal',
                'Cashback'
            )
            await txn_model.fund_wallet(
                connection,
                cashBack,
                Number(id)
            )
            await txn_model.updateCB_bal(
                connection,
                Number(id))
            const total_cb_claim = (Number(bal) + Number(cashBack))
            await txn_model.totalBal(
                connection,
                total_cb_claim,
                ref_id
            )
            await txn_model.updateStatus(
                connection,
                'successful',
                ref_id)
            await connection.commit()
            return{
                message:'Congratulation cashback claim successfully'
            }
        }catch(err){
            await connection.rollback()
            throw new AppError(err.message || 'Unable to process your request')
        }finally{
            await connection.release()
        }
    }

}

module.exports = wallet_service_flow