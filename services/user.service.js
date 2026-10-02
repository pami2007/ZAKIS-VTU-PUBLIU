const user_controller = require('../model/userDB')
const txn_model = require('../model/transactionDB')
const password_hash = require('bcrypt')
const AppError = require('../utils/AppError')
const { pool } = require('../config/database')


class user_service_flow{
    static async register_service(userDetails){

        const existing_acc = await user_controller.userEMAIL(userDetails.email)
        if(existing_acc){
            throw new AppError('Email already register')
        }

        if(userDetails.password !== userDetails.confirm_password){
            throw new AppError('password and comfirm password must be the same')
        }
        
        const hash_pass = await password_hash.hash(userDetails.password,10)

        const userdatas=({
            fname: userDetails.fname,
            lname: userDetails.lname,
            email: userDetails.email,
            phone: userDetails.phone,
            password:hash_pass
        })
        await user_controller.register(userdatas)
    }

    static async historyDetail_ID(id,userId){
        const historyID = await user_controller.historyDetails(id,userId)
        return{
            historyID
        }
    }

    static async recentHistoryDetails(userId){
        const recentDetails = await user_controller.recentHistory(userId)

        return{
            recentDetails
        }
    }

    static async recentHistoryData(userId){
        const history_datas = await user_controller.recentHistoryData(userId)
        return{
            history_datas
        }
    }
    
    static async cashBack_history(userId){
        const cashback_hist = await user_controller.cashback_history(userId)
        return{
            cashback_hist
        }
    }

    static async recent_CashBack(userId){
        const recent_cashback = await user_controller.recent_cashback(userId)
        return{
            recent_cashback
        }
    }

    static async today_cashback(){
        const todayCashback = await user_controller.overall_cashback_today()
        return{
            todayCashback
        }
    }

    static async last_active(id){
        const active = await user_controller.last_actives(id)
        return {
            active
        }
    }

}

module.exports = user_service_flow