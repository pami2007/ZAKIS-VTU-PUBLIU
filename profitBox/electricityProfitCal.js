const txn_model = require('../model/transactionDB')
const AppError = require('../utils/AppError')
const pool = require('../config/database')
const eletric_model = require('../model/eletricityModel')
const admin_model = require('../model/admin.model')

class electric_profit_flow{
    static async main_service_profit(connection, api_response, ref_id, amount){
        console.log(api_response.token)
        
        const apiData = api_response.content.transactions;
        const profit =Number(amount) - Number(apiData.total_amount)
        await txn_model.updateStatus(connection,'successful', ref_id)
        
        await txn_model.paid_amount(
            connection,
            apiData.total_amount || 'N/A',
            ref_id
        )

       await txn_model.profit(
        connection,
        profit || 'N/A',
        ref_id
       )

        await eletric_model.address(
            connection,
            api_response.customerAddress || api_response.address || api_response.CustomerAddress || api_response.Address ||'N/A',
            ref_id
        )

        await eletric_model.tokenes(
            connection,
            api_response.token || api_response.purchased_code || 'N/A',
            ref_id
        )

        await eletric_model.units(
            connection,
            api_response.units || api_response.Units || api_response.PurchasedUnits || 'N/A',
            ref_id
        )

        await eletric_model.customer_name(
            connection,
            api_response.customerName ||api_response.Name || api_response.name ||'N/A',
            ref_id
        )

        await eletric_model.receiptNO(
            connection,
            api_response.tokenAmount || 'N/A',
            ref_id
        )

        await eletric_model.eletric_provider(
            connection,
            apiData.product_name || 'N/A',
            ref_id
        )

    }

    static async automation_service_profit(api_response, ref_id, amount){
        console.log(api_response.token)
        
        const apiData = api_response.content.transactions;
        const profit =Number(amount) - Number(apiData.total_amount)
        await eletric_model.updateStatus1('successful', ref_id)
        
        await eletric_model.paid_amount1(
            apiData.total_amount || 'N/A',
            ref_id
        )

       await admin_model.profits(
        profit || 'N/A',
        ref_id
       )

        await eletric_model.address1(
            api_response.customerAddress || api_response.address || api_response.CustomerAddress || api_response.Address ||'N/A',

            ref_id
        )

        await eletric_model.tokenes1(
            api_response.token || api_response.purchased_code || 'N/A',
            ref_id
        )

        await eletric_model.units1(
            api_response.units || api_response.Units || api_response.PurchasedUnits || 'N/A',
            ref_id
        )

        await eletric_model.customer_name1(
            api_response.customerName ||api_response.Name || api_response.name ||'N/A',
            ref_id
        )
//token amount, receipt number and provider name for automation service
        await eletric_model.receiptNO1(
            api_response.tokenAmount || 'N/A',
            ref_id
        )

        await eletric_model.eletric_provider1(
            apiData.product_name || 'N/A',
            ref_id
        )
    }
}

module.exports = electric_profit_flow

