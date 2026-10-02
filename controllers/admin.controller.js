const adminRoles = require('../model/admin.model');
const { async } = require('../model/transactionDB');
const admin_service = require('../services/admin.service')
const AppError = require('../utils/AppError');

class AdminControllerFlow {

    isAdmin(permission) {

        return async (req, res, next) => {

            const ROLES =await adminRoles.roles(
                req.user.id
            );
            if (ROLES !== permission) {
                req.flash('error', "Access denied")

                return req.session.save(
                    (saveErr)=>{
                    if(saveErr){return next(saveErr)}
                    return res.redirect('/')
                })
            }

            next();
        };
    }

  
    suspend_acc(suspend){
        return async(req,res,next)=>{
            const accStatus =await adminRoles.acc_status(req.user.id);

            if(accStatus === suspend){

                req.flash('error', "Your account has been suspended. Contact support for review")

                return req.session.save((saveErr)=>{

                    if(saveErr){return next(saveErr)}

                    return res.redirect('/')
                })
            }
            next()
        }
    }



    async dashBoard(req,res,next){

        const   TU = await admin_service.total_user()

        const total_txn = await admin_service.total_transaction()

        const total_deposit = await admin_service.total_deposit()

        const total_profit = await admin_service.total_profit()

        const success_status = await admin_service.success_status()

        const failed_status = await admin_service.failed_status()

        const pending_status = await admin_service.pending_status()

        const today_Profit = await admin_service.today_profit()

        const allPurcase = await admin_service.all_purchase()

        const actives = await admin_service.active_users()
        //console.log(actives.active)

        return res.render(

            'dashboard',{

                display:TU.totalUser,

                total_t:total_txn.total_txns,

                total_deposits:total_deposit.totalDeposit,

                total_profitss:total_profit.total_profits,

                success:success_status.successStatus,

                fail:failed_status.failedStatus,

                pending:pending_status.pendingStatus,

                todayprofits:today_Profit.todayProfit,

                recent_txn:allPurcase.purchase,

                act : actives.active
                
            }
        )
    }

    async user_admin(req,res,next){

        const   TU = await admin_service.total_user()

        const actives = await admin_service.active_users()

        const user = await admin_service.user_details()

        const New_users = await admin_service.new_User()

        const suspend = await admin_service.suspend_acc()

        return res.render(

            'useradmin',{

                display:TU.totalUser,

                act : actives.active,

                users:user.allUser,

                New:New_users.newUser,
                
                sus:suspend.acc_suspend

            }
        )
    }

    async txn_admin(req,res,next){

        const All_txn = await admin_service.Total_txn()

        const SuccessTxn = await admin_service.success_txn()

        const FailTxn = await admin_service.fail_txn()

        const PendingTxn = await admin_service.pending_txn()

        const All_records = await admin_service.all_txn_record()

        return res.render(

            'txn_admin',{

                displaytxn:All_txn.all_txn,

                displaytxnsuccess:SuccessTxn.txn_success,

                displaytxnfail:FailTxn.txn_fail,

                displaytxnpending:PendingTxn.txn_pending,

                record: All_records.all_record,
            }
        )
    }

    async deposit_admin(req,res,next){

        const Od = await admin_service.overAll_deposit()

        const OdT = await admin_service.overallDEPOSITtoday()

        const OPD = await admin_service.overall_pendingDEPOSIT()

        const OFD = await admin_service.overall_failedDEPOSIT()

        const DepositDetails = await admin_service.Deposit_details()

        return res.render(

            'depositAdmin',{

                displayOD:Od.overallDEPOSIT,

                displayODT: OdT.overallTODAY,

                displayOPD:OPD.overallPENDING,

                displayOFD:OFD.overallFAILED,

                displaydetails:DepositDetails.depositDETAILS
            }
        )
    }



    async admin_profit(req,res,next){

        const today_Profit = await admin_service.today_profit()

        const total_profit = await admin_service.total_profit()

        const total_profit_airtime = await admin_service.airtimePROFIT()

        const total_profit_data = await admin_service.dataPROFIT()

        const total_profit_deposit = await admin_service.depositPROFIT()

        const total_CASHBACK  = await admin_service.total_user_cashback()

        const total_deposit_fee = await  admin_service.deposit_fees()

        const monthprofit = await admin_service.monthly_profit()

        const eletricityProfit = await admin_service.eletric_profit()

        return res.render(

            'adminprofit',{

                total_profitss:total_profit.total_profits,

                todayprofits:today_Profit.todayProfit,

                AP:total_profit_airtime.airtime_profit,

                DP:total_profit_data.data_profit,

                DEP:total_profit_deposit.deposit_profit,

                CB:total_CASHBACK.cashBack,

                fee:total_deposit_fee.depositFEE,

                mon:monthprofit.monthlyProfit,

                eleprofit:eletricityProfit.eletricProfit
                
            }
        )
    }



    async suspendUSER(req,res,next){

        const {id} = req.params

        await admin_service.deactivate_user(id)

         req.flash('success', 'ACCOUNT SUSPENDED SUCCESSFULLY')

        return req.session.save((saveErr)=>{

            if(saveErr){return next(saveErr)};

            return res.redirect('/admin/users')

        })
    }


    async activateUSER(req,res,next){

        const {id} = req.params

        await admin_service.activate_user(id)

         req.flash('success', 'ACCOUNT REACTIVATED SUCCESSFULLY')

        return req.session.save((saveErr)=>{

            if(saveErr){return next(saveErr)};

            return res.redirect('/admin/users')
        })
    }



    async viewUser(req,res,next){

        const {id} = req.params

        const userbyID = await admin_service.view_user_byid(id)

        return res.render(

            'adminUserView',{

                item:userbyID.userID

            }
        )
    }



    async editUSERs(req,res,next){

        const {id} = req.params

        const {

            fname,
            
            lname,
            
            email,
            
            phone,
            
            bal,
            
            cashBack, 
            
            roles,
            
            acc_status
        
        } = req.body

        await admin_service.edit_user_byid(
            
            fname,
            
            lname,
            
            email,
            
            phone,
            
            bal,
            
            cashBack, 
            
            roles,
            
            acc_status,
            
            id
        )

         req.flash('success', 'ACCOUNT UPDATED SUCCESSFULLY')

        return req.session.save((saveErr)=>{
            
            if(saveErr){return next(saveErr)};

            return res.redirect('/admin/users')

        })
    }



    async admin_history(req,res,next){

        const {id} = req.params

        const his = await admin_service.admins_history(id)

        return res.render(

            'adminreceipt',{

                item:his.history
            }
        )
    }



    async adminairtime(req,res,next){

        const total_profit_airtime = await admin_service.airtimePROFIT()

        const totalairtime = await admin_service.Total_airtime()

        const activeAirtime = await admin_service.totalactiveairtime()

        const inactivesAirtime = await admin_service.totalinactiveairtime()

        const allairtime_view = await admin_service.view_all_airtime()

        return res.render(

            'adminAirtime',{

                TAP:total_profit_airtime.airtime_profit,

                TA:totalairtime.totalAIRTIME,

                AA:activeAirtime.activeAIRTIME,

                IA:inactivesAirtime.inactiveAIRTIME,

                view:allairtime_view.total_airtime_view
            }
        )
    }



    async adminData(req,res,next){

        const total_profit_data = await admin_service.dataPROFIT()

        const totaldata = await admin_service.Total_data()

        const activeDatas = await admin_service.totalactivedata()

        const inactivesData = await admin_service.totalinactivedata()

        const alldata_view = await admin_service.view_all_data()

        return res.render(

            'adminData',{

                TP:total_profit_data.data_profit,

                TD:totaldata.totalDATA,

                AD:activeDatas.activeDATA,

                ID:inactivesData.inactiveDATA,

                view:alldata_view.total_data_view

                //add:addData.add_DATA

            }
        )
    }

    async addDATAS(req,res,next){

        const {

            network,
            
            plan,
            
            duration,
            
            amount,
            
            zd_price,
            
            data_id, 
            
            networkID,

            variation_Code
        } = req.body

        const addData = await admin_service.addData(
            network,

            plan,
            
            duration,
            
            amount,
            
            zd_price,
            
            data_id, 
            
            networkID,
            
            variation_Code
        )

        req.flash('success', 'ALL DATA PLAN ADDED SUCCESSFULLY')

        return req.session.save((saveErr)=>{

            if(saveErr){return next(saveErr)}

            return res.redirect('/admin/data')
        })
    }


    async disableDT(req,res,next){

        const {id} = req.params

        const showdata = await admin_service.disableData(id)

        req.flash('success', 'DATA DISABLE SUCCESSFULLY')

        return req.session.save((saveErr)=>{

            if(saveErr){return next(saveErr)}

            return res.redirect('/admin/data')

        })
    }


    async enableDT(req,res,next){

        const {id} = req.params

        const showdata = await admin_service.enableDATA(id)

        req.flash('success', 'DATA REACTIVATED SUCCESSFULLY')

        return req.session.save((saveErr)=>{
            
            if(saveErr){return next(saveErr)}

            return res.redirect('/admin/data')
        })
    }


    async addAIRTIME(req,res,next){

        const {amount,network,networkID} = req.body

        const addData = await admin_service.addAirtime(amount,network,networkID)

        req.flash('success', 'AIRTIME ADDED SUCCESSFULLY')

        return req.session.save((saveErr)=>{

            if(saveErr){return next(saveErr)}

            return res.redirect('/admin/airtime')
        })
    }


    async disableAT(req,res,next){

        const {id} = req.params

        const showairtime = await admin_service.disableAirtime(id)

        req.flash('success', 'AIRTIME DISABLE SUCCESSFULLY')

        return req.session.save((saveErr)=>{

            if(saveErr){return next(saveErr)}

            return res.redirect('/admin/airtime')
        })
    }


    async enableAT(req,res,next){

        const {id} = req.params

        const showairtime = await admin_service.enableAIRTIME(id)

        req.flash('success', 'AIRTIME REACTIVATED SUCCESSFULLY')

        return req.session.save((saveErr)=>{

            if(saveErr){return next(saveErr)}

            return res.redirect('/admin/airtime')
        })
    }



    async editAT(req,res,next){

        const {id} = req.params

        const {amount, network, networkID} = req.body

        const sam = await admin_service.editAirtime(amount, network, networkID, id)

        req.flash('success', 'AIRTIME UPDATED SUCCESSFULLY')

        return req.session.save((saveErr)=>{

            if(saveErr){return next(saveErr)}

            return res.redirect('/admin/airtime')

        })
    }



    async editAT_page(req,res,next){

        const {id} = req.params

        const page = await admin_service.airtimebyID(id)

       const total_profit_airtime = await admin_service.airtimePROFIT()

        const totalairtime = await admin_service.Total_airtime()

        const activeAirtime = await admin_service.totalactiveairtime()

        const inactivesAirtime = await admin_service.totalinactiveairtime()

        const allairtime_view = await admin_service.view_all_airtime()

       // console.log(page.at_byid)
        return res.render(

            'editADIMNAirtime',{

                items:page.at_byid,

                 TAP:total_profit_airtime.airtime_profit,

                TA:totalairtime.totalAIRTIME,

                AA:activeAirtime.activeAIRTIME,

                IA:inactivesAirtime.inactiveAIRTIME,

                view:allairtime_view.total_airtime_view

            }
        )
    }



    async EditDATA(req,res,next){

        const {id} = req.params

        const {
            
            network,
            
            plan,
            
            duration,
            
            amount,
            
            zd_price,
            
            data_id, 
            
            networkID,
            
            variation_Code
        
        } = req.body

        const sam = await admin_service.editData(
            
            network,
            
            plan,
            
            duration,
            
            amount,
            
            zd_price,
            
            data_id, 
            
            networkID,
            
            variation_Code,
            
            id
        )
        req.flash('success', 'DATA UPDATED SUCCESSFULLY')

        return req.session.save((saveErr)=>{

            if(saveErr){return next(saveErr)}

            return res.redirect('/admin/data')
        })
    }


    async editdata_page(req,res,next){

        const {id} = req.params

        const page = await admin_service.databyID(id)

        const total_profit_data = await admin_service.dataPROFIT()

        const totaldata = await admin_service.Total_data()

        const activeDatas = await admin_service.totalactivedata()

        const inactivesData = await admin_service.totalinactivedata()

        const alldata_view = await admin_service.view_all_data()

       // console.log(page.at_byid)
        return res.render(

            'editadminData',{

                items:page.data_byid,

                 TP:total_profit_data.data_profit,

                TD:totaldata.totalDATA,

                AD:activeDatas.activeDATA,

                ID:inactivesData.inactiveDATA,

                view:alldata_view.total_data_view
            }
        )
    }

    async settings(req,res,next){

        return res.render(

            'settings'
        )
    }
}



module.exports = new AdminControllerFlow();