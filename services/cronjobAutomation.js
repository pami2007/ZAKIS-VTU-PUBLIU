const admin_model = require('../model/admin.model')
const txn_model = require('../model/transactionDB')
const monify_ref_Api = require('../api/monify.service')
const statusAPI = require('../api/status.checker.API')
const eletric_profit = require('../profitBox/electricityProfitCal')


class bot_automation_flow {

    static async monnifypendingReview() {

        try {

            // Get maximum 10 pending transactions
            const transactions =
                await admin_model.getmonifyPendingTransactions()

            if (transactions.length === 0) {

                console.log('No pending transactions.')

                return
            }

            console.log(
                `Found ${transactions.length} pending transaction(s).`
            )


            await Promise.all(

                transactions.map(async (transaction) => {

                    try {

                        const monnify =
                            await monify_ref_Api.verifyTransaction(
                                transaction.transactionReference
                            )

                            
                        const paymentStatus =
                            monnify.paymentStatus
                            console.log(transaction.ref_id)
                            

                        // =========================
                        // PAYMENT SUCCESSFUL
                        // =========================

                        if (paymentStatus.toUpperCase() === 'PAID') {
                            const amountPaid = Number(monnify.amountPaid)
                            const fee =
                                Number(monnify.fee)
                            const amount =
                                Number(transaction.amount)
                            const profit =
                                amountPaid - amount - fee


                            await admin_model.updatesStatus(
                                'successful',
                                transaction.ref_id
                            )


                            await admin_model.paidAmount(
                                fee,
                                transaction.ref_id
                            )


                            await admin_model.profits(
                                profit,
                                transaction.ref_id
                            )


                            console.log(
                                `Successful: ${transaction.transactionReference}`
                            )

                            return
                        }


                        // =========================
                        // PAYMENT EXPIRED
                        // =========================

                        if (paymentStatus.toUpperCase() === 'EXPIRED') {

                            await admin_model.updatesStatus(
                                'failed',
                                transaction.ref_id
                            )


                            console.log(
                                `Expired: ${transaction.transactionReference}`
                            )

                            return
                        }


                        // =========================
                        // STILL PENDING
                        // =========================

                        console.log(
                            `Still pending: ${transaction.transactionReference}`
                        )

                    } catch (error) {

                        console.error(
                            `Failed: ${transaction.transactionReference}`,
                            error.message
                        )


                        // Get Monnify error message safely
                        const responseMessage =
                            error?.response?.data?.responseMessage


                        // =========================
                        // TRANSACTION DOES NOT EXIST
                        // =========================

                        if (
                            responseMessage ===
                            'Could not find transaction with the specified transaction reference'
                        ) {

                            await admin_model.updatesStatus(
                                'failed',
                                transaction.ref_id
                            )


                            console.log(
                                `Transaction not found: ${transaction.transactionReference}`
                            )
                        }

                    }

                })

            )

        } catch (err) {

            console.error(
                'Pending transaction worker error:',
                err.message
            )

        }

    }


////////////////////////////////////////////////////////
    static async vtpasspendingFlow(){
        try{
            const transactions =
                await admin_model.getvtpassAirtimePendingTransactions()

            
            if (transactions.length === 0) {

                console.log('No pending transactions.')

                return
            }

            console.log(
                `Found ${transactions.length} pending transaction(s).`
            )
            //console.log(transactions)
            await Promise.all(
                transactions.map(async(transaction)=>{
                    try{
                        const vtpassAirtime = await statusAPI.status_api_flow(transaction.ref_id)
                        
                        if(vtpassAirtime.code === '017'){
                            await admin_model.updatesStatus(
                                'failed',
                                transaction.ref_id
                            )
                            await admin_model.updaterefund(
                                transaction.amount,
                                transaction.userId
                            )
                            console.log(`REFUND:  ${transaction.ref_id}`)
                            return
                        }

                        if(vtpassAirtime.code === '015'){
                            await admin_model.updatesStatus(
                                'failed',
                                transaction.ref_id
                            )
                            await admin_model.updaterefund(
                                transaction.amount,
                                transaction.userId
                            )
                            console.log(`REFUND:  ${transaction.ref_id}`)
                            return
                        }

                        if(vtpassAirtime.code === '019'){
                            await admin_model.updatesStatus(
                                'failed',
                                transaction.ref_id
                            )
                            await admin_model.updaterefund(
                                transaction.amount,
                                transaction.userId
                            )
                            console.log(`REFUND:  ${transaction.ref_id} `)
                            return
                        }

                        if(vtpassAirtime.code === '010'){
                            await admin_model.updatesStatus(
                                'failed',
                                transaction.ref_id
                            )
                            await admin_model.updaterefund(
                                transaction.amount,
                                transaction.userId
                            )
                            console.log(`REFUND:  ${transaction.ref_id} `)
                            return
                        }

                        if(vtpassAirtime.code === '018'){
                            await admin_model.updatesStatus(
                                'failed',
                                transaction.ref_id
                            )
                            await admin_model.updaterefund(
                                transaction.amount,
                                transaction.userId
                            )
                            console.log(`REFUND:  ${transaction.ref_id} `)
                            return
                        }


                        if(vtpassAirtime.content.transactions.status === 'failed'){
                            await admin_model.updatesStatus(
                                'failed',
                                transaction.ref_id
                            )
                            await admin_model.updaterefund(
                                transaction.amount,
                                transaction.userId
                            )
                            console.log(`REFUND:  ${transaction.ref_id} `)
                            return
                        }

                        if(vtpassAirtime.content.transactions.status === 'pending'){
                            await admin_model.updatesStatus(
                                'pending',
                                transaction.ref_id
                            )
                            console.log(`Pending:  ${transaction.ref_id} `)
                            return
                        }


                        if(vtpassAirtime.content.transactions.status === 'delivered'){
                            await admin_model.updatesStatus(
                                'successful',
                                transaction.ref_id
                            )
                            const paid_amount = vtpassAirtime.content.transactions.total_amount
                            await admin_model.paidAmount(
                                paid_amount, 
                                transaction.ref_id
                            
                            )
                            const profit = 
                                Number(transaction.amount) - Number(paid_amount)

                            await admin_model.profits(
                                profit,
                                transaction.ref_id
                            )
                            console.log(`successfully delivered`)
                            return
                        }
                    }catch(error){
                        console.log(error.message)
                    }
                })
            )
        }catch(err){
            console.log(err.message)
        }
    }


//////////////////////////////////////////////////////////////////////
    static async vtpassDATApendingFlow(){
        try{
            const transactions =
                await admin_model.getvtpassDataPendingTransactions()
                
            
            if (transactions.length === 0) {

                console.log('No pending transactions.')

                return
            }

            console.log(
                `Found ${transactions.length} pending transaction(s).`
            )
            //console.log(transactions)
            await Promise.all(
                transactions.map(async(transaction)=>{
                    try{
                        const vtpassData = await statusAPI.status_api_flow(transaction.ref_id)
                        //console.log(vtpassData)
                       
                        
                        if(vtpassData.code === '017'){
                            await admin_model.updatesStatus(
                                'failed',
                                transaction.ref_id
                            )
                            await admin_model.updaterefund(
                                transaction.amount,
                                transaction.userId
                            )
                            console.log(`REFUND:  ${transaction.ref_id} `)
                            return
                        }

                        
                        if(vtpassData.code === '018'){
                            await admin_model.updatesStatus(
                                'failed',
                                transaction.ref_id
                            )
                            await admin_model.updaterefund(
                                transaction.amount,
                                transaction.userId
                            )
                            console.log(`REFUND:  ${transaction.ref_id} `)
                            return
                        }

                        if(vtpassData.code === '015'){
                            await admin_model.updatesStatus(
                                'failed',
                                transaction.ref_id
                            )
                            await admin_model.updaterefund(
                                transaction.amount,
                                transaction.userId
                            )
                            console.log(`REFUND:  ${transaction.ref_id} `)
                            return
                        }

                        if(vtpassData.code === '019'){
                            await admin_model.updatesStatus(
                                'failed',
                                transaction.ref_id
                            )
                            await admin_model.updaterefund(
                                transaction.amount,
                                transaction.userId
                            )
                            console.log(`REFUND:  ${transaction.ref_id} `)
                            return
                        }

                        if(vtpassData.code === '010'){
                            await admin_model.updatesStatus(
                                'failed',
                                transaction.ref_id
                            )
                            await admin_model.updaterefund(
                                transaction.amount,
                                transaction.userId
                            )
                            console.log(`REFUND:  ${transaction.ref_id} `)
                            return
                        }


                        if(vtpassData.content.transactions.status === 'failed'){
                            await admin_model.updatesStatus(
                                'failed',
                                transaction.ref_id
                            )
                            await admin_model.updaterefund(
                                transaction.amount,
                                transaction.userId
                            )
                            console.log(`REFUND:  ${transaction.ref_id}`)
                            return
                        }

                        if(vtpassData.content.transactions.status === 'pending'){
                            await admin_model.updatesStatus(
                                'pending',
                                transaction.ref_id
                            )
                            console.log(`Pending:  ${transaction.ref_id} `)
                            return
                        }


                        if(vtpassData.content.transactions.status === 'delivered'){
                            await admin_model.updatesStatus(
                                'successful',
                                transaction.ref_id
                            )
                            const paid_amount = vtpassData.content.transactions.total_amount
                            await admin_model.paidAmount(
                                paid_amount, 
                                transaction.ref_id
                            
                            )

                            const discount = vtpassData.content.transactions.commission / 2
                            console.log(`discount ${discount}`)
                            await admin_model.Discount(
                                discount,
                                transaction.ref_id
                            )

                            await admin_model.Cashback(
                                discount,
                                discount,
                                transaction.userId
                            )

                            await admin_model.User_profit(
                                discount,
                                transaction.ref_id
                            )

                            const admin_profit = (transaction.amount - paid_amount - discount)
                            await  admin_model.profits(
                                admin_profit,
                                transaction.ref_id
                            )

                            console.log(`Status updated successfully. txn status is successful`)
                              return
                        }
                    }catch(error){
                        console.log(error.message)
                    }
                })
            )
        }catch(err){
            console.log(err.message)
        }
    }
/////////////////////////////////////////////////////////
    static async eletricity_automation_flow(){
        try{
            const transactions = await admin_model.getvtpassEletricPendingTransactions()

            if(transactions.length === 0){
                console.log('No pending transactions.')

                return
            }

            await Promise.all(
                transactions.map(async(transaction)=>{
                    try{
                        const vtpass_Eletric = await statusAPI.status_api_flow(transaction.ref_id)
                        console.log(vtpass_Eletric)
                        if(vtpass_Eletric.code === '017'){
                            await admin_model.updatesStatus(
                                'failed',
                                transaction.ref_id
                            )
                            await admin_model.updaterefund(
                                transaction.amount,
                                transaction.userId
                            )
                            console.log(`REFUND: ${transaction.ref_id}`)
                            return
                        }
                        if(vtpass_Eletric.code === '015'){
                            await admin_model.updatesStatus(
                                'failed',
                                transaction.ref_id
                            )
                            await admin_model.updaterefund(
                                transaction.amount,
                                transaction.userId
                            )
                            console.log(`REFUND: ${transaction.ref_id}`)
                            return
                        }

                        if(vtpass_Eletric.code === '019'){
                            await admin_model.updatesStatus(
                                'failed',
                                transaction.ref_id
                            )
                            await admin_model.updaterefund(
                                transaction.amount,
                                transaction.userId
                            )
                            console.log(`REFUND: ${transaction.ref_id}`)
                            return
                        }

                        if(vtpass_Eletric.code === '010'){
                            await admin_model.updatesStatus(
                                'failed',
                                transaction.ref_id
                            )
                            await admin_model.updaterefund(
                                transaction.amount,
                                transaction.userId
                            )
                            console.log(`REFUND: ${transaction.ref_id}`)
                            return
                        }

                        
                        if(vtpass_Eletric.code === '013'){
                            await admin_model.updatesStatus(
                                'failed',
                                transaction.ref_id
                            )
                            await admin_model.updaterefund(
                                transaction.amount,
                                transaction.userId
                            )
                            console.log(`REFUND: ${transaction.ref_id}`)
                            return
                        }

                        if(vtpass_Eletric.code === '018'){
                            await admin_model.updatesStatus(
                                'failed',
                                transaction.ref_id
                            )
                            await admin_model.updaterefund(
                                transaction.amount,
                                transaction.userId
                            )
                            console.log(`REFUND: ${transaction.ref_id}`)
                            return
                        }

                        if(vtpass_Eletric.content.transactions.status === 'delivered'){
                
                            await eletric_profit.automation_service_profit(vtpass_Eletric, transaction.ref_id, transaction.amount)
                            console.log(`SUCCEFUL: ${transaction.ref_id}`)
                            return
                        }

                        if(vtpass_Eletric.content.transactions.status === 'failed'){
                            await admin_model.updatesStatus(
                                'failed',
                                transaction.ref_id
                            )
                            await admin_model.updaterefund(
                                transaction.amount,
                                transaction.userId
                            )
                            console.log(`FAILED: ${transaction.ref_id}`)
                            return
                        }

                        if(vtpass_Eletric.content.transactions.status === 'pending'){
                            await admin_model.updatesStatus(
                                'pending',
                                transaction.ref_id
                            )
                            
                            console.log(`pending: ${transaction.ref_id}`)
                            return
                        }
                    }catch(err){
                        console.log(err.message)
                    }
                })
            )
        }catch(error){
            console.log(error.message)
        }
    }
}

module.exports = bot_automation_flow