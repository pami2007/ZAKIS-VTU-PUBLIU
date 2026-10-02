const userService = require('../services/user.service')

const AppError = require('../utils/AppError')

const txn_service = require('../services/airtime.service')

const status_service = require('../services/status.checker.service')

const data_details  = require('../model/dataDB')

const adminRoles = require('../model/admin.model');



class user_controller_flow{
    
    async register_page(req,res){

        return res.render('register',{

            title:'Register'
        })
    }



    async register_controller(req,res, next){
        
        try{
            const register_flow = await userService.register_service(req.validators)
            
            req.flash('success', 'Registration successful login below')

            return req.session.save(err=>{

                if(err){return next(err)};

                return res.redirect('/login')
            })
            
        }catch(err){

            if(err instanceof AppError){

                req.flash('error', err.message)

                return req.session.save((saveErr)=>{

                    if(saveErr){return next(saveErr)};

                    return res.redirect('/register')
                })
                
            }/*else{
                req.flash('error', 'An unexpected error occurred')
                return req.session.save((saveErr)=>{
                    if(saveErr){return next(saveErr)};
                    return res.redirect('/register')
                })
                
            }*/
            return next(err)
        }
    }



    async login_page(req,res){

        return res.render('login',{

            title:'Login'
        })
    }



    async login_controller(req,res){

        req.flash('success', `Login was successful. Welcome back ${req.user.fname}.`)

        return req.session.save((err)=>{

            if(err){

                return next(err)

            }
             return res.redirect('/')
        })
    }



    async home(req,res){

        if(!req.user){

             return res.render(

            'home'
        )
        }else{
            const display = await userService.recentHistoryDetails(req.user.id)

            const admin = await adminRoles.roles(req.user.id)

            return res.render(

            'home',{

                user:req.user,

                history:display.recentDetails,

                admin
            }
        )
        }
    }



    async historyPage(req,res){

        const display = await userService.recentHistoryDetails(req.user.id)

        return res.render('history',{

            history:display.recentDetails

        })
    }



    async historyDetails(req,res,next){

        const {id} = req.params

        const userId = req.user.id

        const user_ID = await txn_service.get_ID(userId)

        const txn_rec = user_ID.user_id

        //check for invalid transaction request
        const display = await userService.historyDetail_ID(id,userId)

        //const data = await data_details.data_ID(Number(display.historyID.purcahase_id))

        const sam = user_ID.user_id.some(item => item.id === Number(id))

        return res.render('historyDetail',{
            //data,
            item:display.historyID,

            sam,

            user:req.user
            
        })
    }



    async history_list(req,res,next){

        const display = await userService.recentHistoryData(req.user.id)

        return res.render('history',{

            history:display.history_datas
        })
    }

    
    async isAuthenticated(req, res, next) {

        if (!req.isAuthenticated()) {

            return res.redirect("/login");

        }

        next();
    }

    async logout(req, res, next) {

        req.logout( (err) => {
            if (err) {

                return next(err);
            }

            res.redirect("/");
    });
    }



    async profile(req,res,next){

        const recent_CB = await userService.recent_CashBack(req.user.id)

        const cash = await userService.today_cashback()

        return res.render(

            'profile',{

                user:req.user,

                cashbackHistory:recent_CB.recent_cashback,

                today:cash.todayCashback
            }
        )
    }



    async CashBack(req,res,next){

        const cashb = await userService.cashBack_history(req.user.id)


        return res.render(

            'cashback',{

                cashbackHistory:cashb.cashback_hist
            }
        )
    }


    async page_not_found(req,res,next){

        return res.render(

            '404'

        )
    }



    async status_lists(req,res){

        const all_statuss = await status_service.status_list()

        return res.send(

            all_statuss.all_status

        )
    }



    async update_actives(req,res,next){

       if(req.user){

        try{
            await userService.last_active(req.user.id)

        }catch(err){

            console.log(err.message)

        }
       }next()
    }


    async contact_surport(req,res,next){
        
        return res.render(

            'support'

        )
    }



    async terms$condition(req,res,next){

        return res.render(

            'terms_&_condition'

        )
    }



    async privacy$policy(req,res,next){


        return res.render(

            'privacy&policy'
        )
    }
    


}
module.exports = new user_controller_flow()

