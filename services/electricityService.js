const electric_APIcall = require('../api/electricityAPI')
const pool = require('../config/database')
const eletric_model = require('../model/eletricityModel')
const ref_generator = require('../utils/refGenerator')
const txn_model = require('../model/transactionDB')
const AppError = require('../utils/AppError')
const eletric_profit = require('../profitBox/electricityProfitCal')

class electric_service_flow{
    static async eletric_verification(meter_provider,meter_type, meter_number){
        const verifyElectric = await electric_APIcall.verify_electricity(
            meter_provider,meter_type, meter_number
        )
        console.log('verifyElectric', verifyElectric)
        return {verifyElectric}
    }

    static async eletricServiceID(eletric_providers){
        const resultID = await eletric_model.eletric_serviceID(
            String(eletric_providers)
        )
        return {
            resultID
        }
    }




    static async electricity_purchases(userId, meter_type, meter_number, phone, amount, serviceID){
        const ref_id = ref_generator();
        const connection = await pool.getConnection();

        try{
            await connection.beginTransaction();
            const userRow = await txn_model.lock_Rows(
                connection,
                userId
            )
            const userBal = userRow.bal

            if(Number(amount) > Number(userBal)){
                throw new AppError(
                    'Insufficient balance. Fund wallet and try again'
                );
            }

            if(Number(amount) < Number(2000)){
                throw new AppError(
                    'Minimum purchase amount: ₦2,000 '
                );
            }

            if(Number(amount) > Number(100000)){
                throw new AppError(
                    'Maximun purchase amount: ₦100,000 '
                );
            }


            await eletric_model.eletric_txn_details(
                connection,
                userId,
                'eletricity',
                amount,
                phone,
                'pending',
                ref_id,
                'ELETRIC PURCHASE',
                meter_type,
                meter_number
            )
            await txn_model.deduct_funds(
                connection,
                amount,
                userId
            )
            await connection.commit()
        }catch(error){
            await connection.rollback();
            throw new AppError(
                error.message ||
                'An error occurred while processing the request.'
            );
        }finally{
            await connection.release()
        }

        //API CALL TO ELECTRICITY PROVIDER
        let electric_API;
        try{
            electric_API = await electric_APIcall.electric_purchase_flow(
                ref_id,
                serviceID,
                meter_number,
                meter_type,
                amount,
                phone
            )
        }catch(error){
            const refundConnection = await pool.getConnection()
            try{
                await refundConnection.beginTransaction()
                await txn_model.lock_Rows(
                    refundConnection,
                    userId
                );
                await txn_model.updateStatus(
                    refundConnection,
                    'failed',
                    ref_id
                );
                await txn_model.fund_wallet(
                    refundConnection,
                    amount,
                    userId
                );
                await refundConnection.commit()
            }catch(errrefund){
                await refundConnection.rollback()
                throw new AppError(
                    'Transaction failed and refund could not be completed.'
                )
            }finally{
                await refundConnection.release()
            }

            throw new AppError(
                'Unable to process your transaction. Please check your internet connection and try again.'
            )
        }

        const connection2  = await pool.getConnection()
        try{
            await connection2.beginTransaction()
            await txn_model.lock_Rows(
                connection2,
                userId
            )
                if(
                electric_API === '' || 
                electric_API === undefined || 
                electric_API === null
            ){
                await connection2.commit()
                throw new AppError(
                    'No response from the  provider. Please try again later.'
                );
            }if(electric_API.code === '019'){
                await txn_model.fund_wallet(
                    connection2,
                    amount,
                    userId
                )
                await txn_model.updateStatus(
                    connection2,
                    'failed',
                    ref_id
                )
                await connection2.commit()
                throw new AppError(
                    'Purchase temporarily unavailable. Another transaction is being processed. Please wait 15 seconds and try again. '
                )
            }if(electric_API.content.transactions.status === 'failed'){
                await txn_model.fund_wallet(
                    connection2,
                    amount,
                    userId
                )
                await txn_model.updateStatus(
                    connection2,
                    'failed',
                    ref_id
                )
                await connection2.commit()
                return{
                    response: electric_API.content
                }

            }
            ///////
            if(electric_API.content.transactions.status === 'delivered'){
                const profit = await eletric_profit.main_service_profit(connection2,electric_API,ref_id, amount)
                await connection2.commit()
                return{
                    response: electric_API.content
                }
            }
            ///////
            if(electric_API.content.transactions.status === 'pending'){
                await connection2.commit()
                return{
                    response:electric_API.content
                }
            }else{
                throw new AppError(
                    'Unexpected response from eletricity provider.'
                )
            }
        }catch(err){
            await connection2.rollback()
            throw new AppError(
                error.message ||
                'An error occurred while processing the request.'
            )
        }finally{
            await connection2.release()
        }
        
    }
}



module.exports = electric_service_flow