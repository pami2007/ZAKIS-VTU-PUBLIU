const txn_model = require('../model/transactionDB')
const pool = require('../config/database')
const AppError = require('../utils/AppError')
const statusAPI = require('../api/status.checker.API')

class Status_checker_flow{
    static async status_list(){
        const all_status = await txn_model.status_checker()
        return{
            all_status
        }
    }

    static async status_list_ID(id){
        const statusID = await txn_model.status_id(id)
        return{
            statusID
        }
    }


    static async status_logic(userId,network,type,amount,description,ref_id,txn_date){
        const connection = await pool.getConnection()
        try{
            await connection.beginTransaction()
            await txn_model.lock_Rows(connection,userId)
            await txn_model.status_update_Details(connection,userId,network,type,amount,description,ref_id,txn_date)

            const refund_API = await statusAPI.status_api_flow(ref_id)
            console.log(refund_API)
            /*if(refund_API.content.transactions.status === '' || refund_API === null || refund_API === undefined || refund_API.response_description === 'INVALID REQUEST ID'){
                await connection.commit()
                throw new AppError('No response from API provider. Please try again later.')
            
            }*/if(refund_API.code === '015'){
                await txn_model.fund_wallet(connection,amount,userId)
                await txn_model.updateStatus(connection,'refund',ref_id)
                await connection.commit()
                /*return{
                    responses:refund_API.code
                }*/throw new AppError('Money refunded')
            }if(refund_API.code === '019'){
                //await connection2.fund_wallet(connection2,zaki_amount,ref_id)
                await connection2.updateStatus(connection2,'refund',ref_id)
                await connection2.commit()
                throw new AppError(
                    'Duplicate transactions '
                    )
            }else if(refund_API.content.transactions.status === 'delivered'){
                await txn_model.updateStatus(connection,'successful',ref_id)
                await connection.commit()
                return{
                    response:refund_API.content
                }
            }else if(refund_API.content.transactions.status === 'failed'){
                await txn_model.fund_wallet(connection,amount,userId)
                await txn_model.updateStatus(connection,`failed`, ref_id)
                await connection.commit()
                return{
                    response:refund_API.content
                }
            }else if(refund_API.content.transactions.status === 'pending'){
                await connection.commit()
                return {
                    response:refund_API.content
                }
            }else{
                throw new AppError("Unexpected response from airtime provider.");
            }
        }catch(error){
            await connection.rollback()
            throw new AppError(error.message || 'An error occurred while processing the request.')
        }finally{
            connection.release()
        }
    }

        
static async vtpass_webhooks(req){
    let connection;

    try{

        let payload;

        const raw = Object.keys(req.body || {})[0];

        if(raw){

            try{
                payload = JSON.parse(raw);
            }catch(error){
                throw new AppError(
                    'Invalid webhook JSON payload'
                );
            }

        }else if(
            req.body &&
            req.body.type === 'transaction-update'
        ){

            payload = req.body;

        }else{

            throw new AppError(
                'Empty webhook payload'
            );
        }


        if(payload?.type !== 'transaction-update'){

            throw new AppError(
                'Invalid VTpass webhook type'
            );
        }


        const webhookData = payload?.data;

        if(!webhookData){

            throw new AppError(
                'VTpass webhook data not found'
            );
        }


        const vtp_ref_id =
            webhookData?.requestId;

        if(!vtp_ref_id){

            throw new AppError(
                'Vtpass requestId not found'
            );
        }


        const providerTransaction =
            webhookData?.content?.transactions;

        if(!providerTransaction){

            throw new AppError(
                'VTpass transaction data not found'
            );
        }


        const providerCode =
            String(webhookData?.code || '');

        const providerDescription =
            webhookData?.response_description || '';

        const providerStatus =
            String(
                providerTransaction?.status || ''
            ).toLowerCase();

        const providerAmount =
            Number(webhookData?.amount);

        const providerType =
            providerTransaction?.type;


        console.log(
            'VTpass Webhook:',
            {
                vtp_ref_id,
                providerCode,
                providerDescription,
                providerStatus,
                providerAmount,
                providerType
            }
        );


        connection = await pool.getConnection();

        await connection.beginTransaction();


        const lockedTransaction =
            await txn_model.get_ref_id(
                connection,
                vtp_ref_id
            );


        if(!lockedTransaction){

            throw new AppError(
                'Transaction not found'
            );
        }


        const currentStatus =
            String(
                lockedTransaction.status || ''
            ).toLowerCase();


        /*
        |--------------------------------------------------------------------------
        | IGNORE ALREADY PROCESSED TRANSACTIONS
        |--------------------------------------------------------------------------
        */

        if(currentStatus !== 'pending'){

            await connection.commit();

            console.log(
                `Webhook ignored. Transaction already ${lockedTransaction.status}`
            );

            return;
        }


        /*
        |--------------------------------------------------------------------------
        | FAILED
        |--------------------------------------------------------------------------
        */

        if(
            providerCode === '016' ||
            providerDescription === 'TRANSACTION FAILED' ||
            providerStatus === 'failed'
        ){

            await txn_model.fund_wallet(
                connection,
                lockedTransaction.amount,
                lockedTransaction.userId
            );


            await txn_model.updateStatus(
                connection,
                'failed',
                vtp_ref_id
            );


            await connection.commit();


            console.log(
                `Transaction ${vtp_ref_id} failed and refunded`
            );

            return;
        }


        /*
        |--------------------------------------------------------------------------
        | REVERSED
        |--------------------------------------------------------------------------
        */

        if(
            providerCode === '040' ||
            providerStatus === 'reversed'
        ){

            await txn_model.fund_wallet(
                connection,
                lockedTransaction.amount,
                lockedTransaction.userId
            );


            await txn_model.updateStatus(
                connection,
                'failed',
                vtp_ref_id
            );


            await connection.commit();


            console.log(
                `Transaction ${vtp_ref_id} reversed and refunded`
            );

            return;
        }


        /*
        |--------------------------------------------------------------------------
        | SUCCESSFUL
        |--------------------------------------------------------------------------
        

        if(
            providerStatus === 'delivered' ||
            providerStatus === 'successful' ||
            (
                providerCode === '000' &&
                providerStatus === 'completed'
            )
        ){

            const TransactionAmount =
                Number(lockedTransaction.amount);


            /*if(
                providerAmount !== TransactionAmount
            ){

                throw new AppError(
                    'Transaction amount mismatch'
                );
            }


            /*
            |--------------------------------------------------------------------------
            | DATA SERVICES
            |--------------------------------------------------------------------------
            

            if(
                providerType === 'Data Services'
            ){

                await txn_model.updateStatus(
                    connection,
                    'successful',
                    vtp_ref_id
                );


                const paid_amount =
                    Number(
                        providerTransaction?.total_amount
                    );


                await txn_model.paid_amount(
                    connection,
                    paid_amount,
                    vtp_ref_id
                );


                const discount =
                    Number(
                        providerTransaction?.commission || 0
                    ) / 2;


                await txn_model.Discount(
                    connection,
                    discount,
                    vtp_ref_id
                );


                await txn_model.Cashback(
                    connection,
                    discount,
                    vtp_ref_id
                );


                await txn_model.Cashback(
                    connection,
                    discount,
                    discount,
                    lockedTransaction.userId
                );


                await txn_model.User_profit(
                    connection,
                    discount,
                    vtp_ref_id
                );


                const admin_profit =
                    Number(lockedTransaction.amount)
                    - paid_amount
                    - discount;


                await txn_model.profit(
                    connection,
                    admin_profit,
                    vtp_ref_id
                );


                await connection.commit();


                console.log(
                    `Transaction ${vtp_ref_id} marked successful`
                );

                return;
            }


            /*
            |--------------------------------------------------------------------------
            | AIRTIME RECHARGE
            |--------------------------------------------------------------------------
           

            if(
                providerType === 'Airtime Recharge'
            ){

                await txn_model.updateStatus(
                    connection,
                    'successful',
                    vtp_ref_id
                );


                const paid_amount =
                    Number(
                        providerTransaction?.total_amount
                    );


                await txn_model.paid_amount(
                    connection,
                    paid_amount,
                    vtp_ref_id
                );


                const profit =
                    Number(lockedTransaction.amount)
                    - paid_amount;


                await txn_model.profit(
                    connection,
                    profit,
                    vtp_ref_id
                );


                await connection.commit();


                console.log(
                    `Transaction ${vtp_ref_id} marked successful`
                );

                return;
            }


            throw new AppError(
                `Unknown VTpass service type: ${providerType}`
            );
        }


        /*
        |--------------------------------------------------------------------------
        | PENDING
        |--------------------------------------------------------------------------
        */

        if(
            providerStatus === 'pending' ||
            providerStatus === 'processing' ||
            providerStatus === 'initiated'
        ){

            await connection.commit();

            console.log(
                `Transaction ${vtp_ref_id} is still ${providerStatus}`
            );

            return;
        }


        /*
        |--------------------------------------------------------------------------
        | UNKNOWN RESPONSE
        |--------------------------------------------------------------------------
        */

        await connection.rollback();

        console.log(
            `Unknown VTpass response: code=${providerCode}, status=${providerStatus}`
        );


    }catch(error){

        if(connection){

            try{
                await connection.rollback();
            }catch(rollbackError){

                console.error(
                    'Rollback error:',
                    rollbackError
                );
            }
        }


        console.error(
            'VTpass webhook error:',
            error
        );

    }finally{

        if(connection){
            connection.release();
        }
    }
}


}

module.exports = Status_checker_flow  