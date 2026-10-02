const txn_model = require('../model/transactionDB')
const AppError = require('../utils/AppError')
const dataDB = require('../model/dataDB')
const pool = require('../config/database')
const ref_generator = require('../utils/refGenerator')
const Api_results = require('../api/cheapData.data')
const { response } = require('express')

class data_service_flow{
    static async allData(){
        const dataResult = await dataDB.allDATA()
        return{
            dataResult
        }
    }

    static async airtel_Data(){
        const airtel = await dataDB.airtel_data()
        return{
            airtel
        }
    }

    static async glo_Data(){
        const glo  = await dataDB.glo_data()
        return{
            glo
        }
    }

    static async AllDataID(id){
        const dataIdResult = await dataDB.data_ID(id)
        return {
            dataIdResult
        }
    }


    /*DATA BUSSINESS LOGIC */
    static async data_purchase_flow(userId,ser_type, amount,network,phone,networkID,data_id,variation_Code,zaki_amount){
       const ref_id = ref_generator();

       const connection = await pool.getConnection();
       try{
            await connection.beginTransaction();
            const user_row = await txn_model.lock_Rows(
                connection,
                userId
            );
            const bal = user_row.bal;
            if(Number(zaki_amount) > Number(bal)){
                throw new AppError(
                    'Insufficient balance. Fund wallet and try again'
                );
            }
            await txn_model.Transaction_details(
                connection,
                userId,
                ser_type,
                zaki_amount,
                network,
                phone,
                'pending',
                ref_id,
                'DATA PURCHASE',
                data_id
            );
            await txn_model.deduct_funds(
                connection,
                zaki_amount,
                userId
            );
            await connection.commit();
    }catch(error){
        await connection.rollback();
        throw new AppError(
            error.message ||
            'An error occurred while processing the request.'
        );
    }finally{
        await connection.release();
    }
    

    //API CALL FOR DATA DELIVERY
    let data_API;
    try{
        data_API = await Api_results.cheapData(
            ref_id,
            network,
            phone,
            variation_Code,
            amount,
            phone
        );
        
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
            )
            await txn_model.fund_wallet(
                refundConnection,
                zaki_amount,
                userId
            );
            await refundConnection.commit()
        }catch(refundErr){
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

    //SECOND TRANSACTION AFTER API CALL
    const connection2 = await pool.getConnection()
    try{
        await connection2.beginTransaction()
        await txn_model.lock_Rows(
            connection2, 
            userId)
        if(
            data_API === '' || 
            data_API === undefined || 
            data_API === null
        ){
            await connection2.commit()
            throw new AppError(
                'No response from airtime provider. Please try again later.'
            );
        }if(data_API.code === '019'){
            await txn_model.fund_wallet(
                connection2,
                zaki_amount,
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
        }
        else if(data_API.content.transactions.status === 'delivered'){
            await txn_model.updateStatus(
                connection2,
                'successful',
                ref_id
            );
            const paid_amount = data_API.content.transactions.total_amount;
            await txn_model.paid_amount(
                connection2,
                paid_amount,
                ref_id
            )
            
            const discount = data_API.content.transactions.commission / 2
            await txn_model.Discount(
                connection2, 
                discount, 
                ref_id
            )
            await txn_model.Cashback(
                connection2, 
                discount,
                discount, 
                userId)
            await txn_model.User_profit(
                connection2, 
                discount, 
                ref_id
            )
            
            const admin_profit = (zaki_amount - paid_amount - discount)
            
            await txn_model.profit(
                connection2,
                admin_profit, 
                ref_id)
            //await txn_model.description(connection2,data_API.content.transactions.type, ref_id)
            await connection2.commit()
            return{
                response:data_API.content
            }


        }else if(data_API.content.transactions.status === 'failed'){
            await txn_model.fund_wallet(
                connection2,
                zaki_amount,
                userId
            );
            await txn_model.updateStatus(
                connection2,
                'failed',
                ref_id
            )
           /* await txn_model.description(
                connection2,
                data_API.content.transactions.type,
                ref_id
            )*/
            await connection2.commit();
            return{
                response: data_API.content
            }


        }else if(data_API.content.transactions.status === 'pending'){
            await connection2.commit()
            return{
                response:data_API.content
            }
        }
        else{
            throw new AppError(
                'Unexpected response from airtime provider.'
            )
            
        }
    }catch(error){
        await connection2.rollback();
        throw new AppError(
            error.message  ||
            'An error occurred while processing the request.'
        )
    }finally{
        await connection2.release()
    }
}}

module.exports = data_service_flow
