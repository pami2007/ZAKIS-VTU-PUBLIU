const txn_model = require('../model/transactionDB')
const AppError = require('../utils/AppError')
const airtimeAPI = require('../api/cheapdataAirtime_API')
const airtime_model = require('../model/airtimeDB')  
const pool = require('../config/database') 
const ref_generator = require('../utils/refGenerator')


class airtime_service_flow{
    static async Airtime_logic(userId, ser_type, amount, network, phone, networkID,airtime_id) {
    const ref_id = ref_generator();
    const connection = await pool.getConnection();
    try {
        await connection.beginTransaction();
        const user_row = await txn_model.lock_Rows(
            connection,
            userId
        );
        const bal = user_row.bal;
        if (Number(amount) > Number(bal)) {
            throw new AppError(
                'Insufficient balance. Fund wallet and try again'
            );
        }
        await txn_model.Transaction_details(
            connection,
            userId,
            ser_type,
            amount,
            network,
            phone,
            'pending',
            ref_id,
            'AIRTIME PURCHASE',
            airtime_id
        );
        await txn_model.deduct_funds(
            connection,
            amount,
            userId
        );
        await connection.commit();
    } catch (error) {
        await connection.rollback();
        throw new AppError(
            error.message ||
            'An error occurred while processing the request.'
        );
    } finally {
        await connection.release();
    }

    // API CALL IS OUTSIDE DATABASE TRANSACTION

    let airtime_API;
    try {
        airtime_API = await airtimeAPI.cheap_airtime(
            ref_id,
            network,
            amount,
            phone
        );
    } catch (error) {
        const refundConnection = await pool.getConnection();
        try {
            await refundConnection.beginTransaction();
            await txn_model.lock_Rows(
                refundConnection,
                userId
            );
            await txn_model.fund_wallet(
                refundConnection,
                amount,
                userId
            );
            await txn_model.updateStatus(
                refundConnection,
                'failed',
                ref_id
            );
            await refundConnection.commit();
        } catch (refundError) {
            await refundConnection.rollback();
            throw new AppError(
                'Transaction failed and refund could not be completed.'
            );
        } finally {
            await refundConnection.release();
        }
        throw new AppError(
            'Unable to process your transaction. Please check your internet connection and try again.'
        );
    }


    // SECOND DATABASE TRANSACTION

    const connections = await pool.getConnection();
    try {
        await connections.beginTransaction();
        await txn_model.lock_Rows(
            connections,
            userId
        );
        if (
            airtime_API === '' ||
            airtime_API === null ||
            airtime_API === undefined
        ){
            await connections.commit();
            throw new AppError(
                'No response from airtime provider. Please try again later.'
            );
        }if(airtime_API.code === '019'){
            await txn_model.fund_wallet(
                connections,
                amount,
                userId
            )
            await txn_model.updateStatus(
                connections,
                'failed',
                ref_id)
            await connections.commit()
            throw new AppError(
                'Purchase temporarily unavailable. Another transaction is being processed. Please wait 15 seconds and try again.'
            )
        }else if (
            airtime_API.content.transactions.status === 'delivered'
        ) {
            await txn_model.updateStatus(
                connections,
                'successful',
                ref_id
            );
            const paid_amount =
                airtime_API.content.transactions.total_amount;

            await txn_model.paid_amount(
                connections,
                paid_amount,
                ref_id
            );
            const profit = (amount - paid_amount)
            await txn_model.profit(
                connections,
                profit,
                ref_id
            );
           /* await txn_model.description(
                connections,
                airtime_API.content.transactions.type,
                ref_id
            );*/
            await connections.commit();
            return {
                response: airtime_API.content
            };


        } else if (
            airtime_API.content.transactions.status === 'failed'
        ) {
            await txn_model.fund_wallet(
                connections,
                amount,
                userId
            );
            await txn_model.updateStatus(
                connections,
                'failed',
                ref_id
            );
           /* await txn_model.description(
                connections,
                airtime_API.content.transactions.type,
                ref_id
            );*/
            await connections.commit();
            return {
                response: airtime_API.content
            };


        } else if (
            airtime_API.content.transactions.status === 'pending'
        ) {
            await connections.commit();
            return {
                response: airtime_API.content
            };
        } else {
            throw new AppError(
                'Unexpected response from airtime provider.'
            );
        }
    } catch (error) {
        await connections.rollback();
        throw new AppError(
            error.message ||
            'An error occurred while processing the request.'
        );
    } finally {
        await connections.release();
    }
}


    static async All_Airtime(){
        const allAirtime = await airtime_model.all_airtime()
        return{
            allAirtime
        }
    }

    static async All_Airtime_airtel(){
        const airtel_airtime = await airtime_model.all_airtime_airtel()
        return{
            airtel_airtime
        }
    }

    static async All_Airtime_glo(){
        const glo_airtime = await airtime_model.all_airtime_glo()
        return{
            glo_airtime
        }
    }

    static async AirtimeID(id){
        const airtimeid = await airtime_model.airtimeID(id)
        return {
            airtimeid
        }
    }

    static  async get_ID(userId){
        const user_id = await txn_model.get_id(userId)
        
        return{
            user_id
        }
    }
}



module.exports = airtime_service_flow