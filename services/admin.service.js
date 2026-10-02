const admin_model = require('../model/admin.model')

class admin_service_flow{
    static async total_user(){
        const totalUser = await admin_model.total_user()
        return{totalUser} 
    }

    static async total_transaction(){
        const total_txns = await admin_model.total_txn()
        return{total_txns}
    }

    static async total_deposit(){
        const totalDeposit = await admin_model.total_DEPOSIT()
        return{totalDeposit}
    }

    static async total_profit(){
        const total_profits = await admin_model.total_PROFIT()
        return{total_profits}
    }

    static async success_status(){
        const successStatus = await admin_model.successSTATUS()
        console.log(successStatus)
        return{successStatus}
    }

    static async failed_status(){
        const failedStatus = await admin_model.failSTATUS()

        return{failedStatus}
    }

    static async pending_status(){
        const pendingStatus = await admin_model.pendingSTATUS()
        return{pendingStatus}
    }

    static async today_profit(){
        const todayProfit = await admin_model.today_PROFIT()
        return{todayProfit}
    }

    static async monthly_profit(){
        const monthlyProfit = await admin_model.monthly_PROFIT()
        return{monthlyProfit}
    }

    static async eletric_profit(){
        const eletricProfit = await admin_model.total_eletricity_PROFIT()
        return{eletricProfit}
    }

    static async all_purchase(){
        const purchase = await admin_model.txn_purchase()
        return{purchase}
    }

    static async active_users(){
        const active = await admin_model.active_user()
        return{active}
    }

    static async user_details(){
        const allUser = await admin_model.user_info()
        return{allUser}
    }

    static async new_User(){
        const newUser = await admin_model.new_users()
        return{newUser}
    }

    static async suspend_acc(){
        const acc_suspend = await admin_model.suspend_user()
        return{acc_suspend}
    }

    static async Total_txn(){
        const all_txn = await admin_model.total_txn()
        return{all_txn}
    }

    static async success_txn(){
        const txn_success = await admin_model.total_success_txn()
        return {txn_success}
    }

    static async fail_txn(){
        const txn_fail = await admin_model.total_fail_txn()
        return {txn_fail}
    }

    static async pending_txn(){
        const txn_pending = await admin_model.total_pending_txn()
        return {txn_pending}
    }

    static async all_txn_record(){
        const all_record = await admin_model.all_txn_record()
        return{all_record}
    }

    static async overAll_deposit(){
        const overallDEPOSIT = await admin_model.overall_deposit()
        return{
            overallDEPOSIT
        }
    }

    static async overallDEPOSITtoday(){
        const overallTODAY = await admin_model.overall_deposit_today()
        return{overallTODAY}
    }

    static async overall_pendingDEPOSIT(){
        const overallPENDING = await admin_model.overall_pending_deposit()
        return{overallPENDING}
    }

    static async overall_failedDEPOSIT(){
        const overallFAILED = await admin_model.overall_fail_deposit()
        return{overallFAILED}
    }

    static async Deposit_details(){
        const depositDETAILS = await admin_model.deposit_history_details()
        return{
            depositDETAILS
        }
    }

    static async airtimePROFIT(){
        const airtime_profit = await admin_model.total_airtime_PROFIT()
        return{airtime_profit}
    }

    static async dataPROFIT(){
        const data_profit = await admin_model.total_data_PROFIT()
        return{data_profit}
    }

    static async depositPROFIT(){
        const deposit_profit = await admin_model.total_deposit_PROFIT()
        return {deposit_profit}
    }

    static async total_user_cashback(){
        const cashBack = await admin_model.total_cashback()
        return {cashBack}
    }

    static async deactivate_user(id){
        const deactiveUSERS = await admin_model.deativateUser(id)
    }

    static async activate_user(id){
        const activateUSER = await admin_model.ativateUser(id)
        return{activateUSER}
    }

    static async view_user_byid(id){
        const userID = await admin_model.user_info_byID(id)
        return{userID}
    }

    static async edit_user_byid(fname,lname,email,phone,bal,cashBack, roles,acc_status,id){
        const editID = await admin_model.edit_user_info(fname,lname,email,phone,bal,cashBack, roles,acc_status,id)
        return{editID}
    }

    static async deposit_fees(){
        const depositFEE = await admin_model.deposit_fee()
        return {depositFEE}
    }

    static async admins_history(id){
        const history = await admin_model.historyDetails(id)
        return {history}
    }


    static async Total_data(){
        const totalDATA = await admin_model.totaldatacount()
        return{totalDATA}
    }

    static async totalactivedata(){
        const activeDATA = await admin_model.totalActive_datacount()
        return{activeDATA}
    }

    static async totalinactivedata(){
        const inactiveDATA = await admin_model.total_inactive_datacount()
        return{inactiveDATA}
    }

    static async view_all_data(){
        const total_data_view = await admin_model.viewallData()
        return{total_data_view}
    }

    static async addData(network,plan,duration,amount,zd_price,data_id, networkID,variation_Code){
        const add_DATA = await admin_model.Add_data(network,plan,duration,amount,zd_price,data_id, networkID,variation_Code)
        return{
            add_DATA
        }
    }

    static async disableData(id){
        const disable_DATA = await admin_model.disable_data(id)
        return {disable_DATA}
    }

    static async enableDATA(id){
        const enable_DATA = await admin_model.enable_data(id)
        return{enable_DATA}
    }
    
    

    //////////
    static async Total_airtime(){
        const totalAIRTIME = await admin_model.totalairtimecount()
        return{totalAIRTIME}
    }

    static async totalactiveairtime(){
        const activeAIRTIME = await admin_model.totalActive_airtimecount()
        return{activeAIRTIME}
    }

    static async totalinactiveairtime(){
        const inactiveAIRTIME = await admin_model.total_inactive_airtimecount()
        return{inactiveAIRTIME}
    }

    static async view_all_airtime(){
        const total_airtime_view = await admin_model.viewallAirtime()
        return{total_airtime_view}
    }

    static async addAirtime(amount,network,networkID){
        const add_AIRTIME = await admin_model.Add_airtime(amount,network,networkID)
        return{
            add_AIRTIME
        }
    }

    static async disableAirtime(id){
        const disable_AIRTIME = await admin_model.disable_airtime(id)
        return {disable_AIRTIME}
    }

    static async enableAIRTIME(id){
        const enable_AIRTIME = await admin_model.enable_airtime(id)
        return{enable_AIRTIME}
    }

    static async editAirtime(amount, network, networkID, id){
        const edit_AT = await admin_model.edit_airtime(amount, network, networkID, id)
        return{edit_AT}
    }

    static async airtimebyID(id){
        const at_byid= await admin_model.airtime_by_id(id)
        return {at_byid}
    }

    static async editData(network,plan,duration,amount,zd_price,data_id, networkID,variation_Code,id){
        const editDATA = await admin_model.edit_data(network,plan,duration,amount,zd_price,data_id, networkID,variation_Code,id)
        return{editDATA}
    }

    static async databyID(id){
        const data_byid = await admin_model.data_by_id(id)
        return{data_byid}
    }
}

module.exports = admin_service_flow