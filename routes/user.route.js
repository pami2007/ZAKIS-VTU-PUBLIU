const user_route = require('express').Router()
const asyncHandlers = require('../middleware/AsyncHandler')
const user_controller = require('../controllers/user.controller')
const validate_users = require('../middleware/user.validate.middleware')
const passport = require('passport')
const airtime_controller = require('../controllers/airtimecontroller')
const data_controller = require('../controllers/dataController')
const {user_validator_flow} = require('../validators/userValidator')
const {phone_validator_flow} = require('../validators/phoneNO.validate')
const {eletricity_validator_flow}= require('../validators/eletricityValidator')
const {eletricity_validator_flows}= require('../validators/eletricityValidators')
const admin_route = require('../routes/admin.route')
const wallet_route = require('../routes/wallet.route')
const passwordRoutes = require("../routes/passwordRoutes");
const admin_controller = require('../controllers/admin.controller')
const electricity_controller = require('../controllers/electricityController')
const limit = require('../middleware/rateLimiter')
const amount_logic = require('../middleware/user.validate.middleware')

user_route.get('/',(user_controller.home))
user_route.get('/register',(user_controller.register_page))
user_route.post('/register', user_validator_flow, validate_users.validate_user, asyncHandlers(user_controller.register_controller))
user_route.get('/login', asyncHandlers(user_controller.login_page))
user_route.post('/login',(req,res,next)=>{
    passport.authenticate('local',async(err, user, info)=>{
        if(err){
            return next(err);
        }
        if (!user) {
    req.flash(
        "error",
        info.message || "Invalid email or password"
    );

    return req.session.save((err) => {
        if (err) return next(err);

        return res.redirect("/login");
    });

        }
        req.session.regenerate((err) => {

            if (err) {

                return next(err);

            }

        req.login(user,(error)=>{
            if(error){
                return next (error)
            }

            return user_controller.login_controller(
                req,
                res
            )
        })
    })
})(req,res,next)
});
user_route.get('/airtime/mtn',user_controller.isAuthenticated,admin_controller.suspend_acc('suspend'), asyncHandlers(airtime_controller.airtimePAGE))
//user_route.post('/:id/airtime/purchases',user_controller.isAuthenticated,phone_validator_flow,validate_users.airtime_validate, asyncHandlers(airtime_controller.airtimeController))
user_route.post('/:id/airtime/purchases',phone_validator_flow,validate_users.airtime_validate, asyncHandlers(airtime_controller.airtimeController))
user_route.get('/data/mtn',user_controller.isAuthenticated,admin_controller.suspend_acc('suspend'), asyncHandlers(data_controller.data_page))
user_route.post('/:id/data/purchase',user_controller.isAuthenticated,phone_validator_flow,validate_users.Data_validate, asyncHandlers(data_controller.data_post))
user_route.get('/history',user_controller.isAuthenticated,admin_controller.suspend_acc('suspend'), asyncHandlers(user_controller.historyPage))
user_route.get('/history/list', user_controller.isAuthenticated,admin_controller.suspend_acc('suspend'), asyncHandlers(user_controller.history_list))
user_route.get('/:id/history/details',user_controller.isAuthenticated,admin_controller.suspend_acc('suspend'), asyncHandlers(user_controller.historyDetails))
user_route.get('/cashback/history', user_controller.isAuthenticated,admin_controller.suspend_acc('suspend'), asyncHandlers(user_controller.CashBack))
user_route.get('/logout',user_controller.logout)
user_route.get('/airtime/airtel', user_controller.isAuthenticated,admin_controller.suspend_acc('suspend'), asyncHandlers(airtime_controller.airtel_airtime_page))
user_route.get('/airtime/glo', user_controller.isAuthenticated,admin_controller.suspend_acc('suspend'),asyncHandlers(airtime_controller.glo_airtime_page))
user_route.get('/data/airtel', user_controller.isAuthenticated,admin_controller.suspend_acc('suspend'),asyncHandlers(data_controller.airtel_page))
user_route.get('/data/glo', user_controller.isAuthenticated,admin_controller.suspend_acc('suspend'),asyncHandlers(data_controller.glo_page))
user_route.get('/user/profile',user_controller.isAuthenticated,asyncHandlers(user_controller.profile))
user_route.get('/support', user_controller.isAuthenticated,asyncHandlers(user_controller.contact_surport))
user_route.post('/verifing/electricity',eletricity_validator_flows,amount_logic.eletricity_validate, asyncHandlers(electricity_controller.electric_verification))
user_route.get('/electricity/purchase',user_controller.isAuthenticated,admin_controller.suspend_acc('suspend'), asyncHandlers(electricity_controller.electric_page))
user_route.post('/electricity/purchase',eletricity_validator_flow,amount_logic.eletricity_validate, asyncHandlers(electricity_controller.electricity_purchase))
user_route.get('/privacy_policy', user_controller.privacy$policy)
user_route.get('/term_condition', user_controller.terms$condition)
user_route.use(passwordRoutes)
user_route.use(admin_route)
user_route.use(wallet_route)
user_route.use( user_controller.isAuthenticated, asyncHandlers(user_controller.page_not_found))

module.exports = user_route
