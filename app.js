const express = require('express')
const compression = require('compression')
const morgan = require('morgan')
const helmet = require('helmet')
const passport = require('passport')
const flash = require('connect-flash')
const cookiesParser = require('cookie-parser')
const path = require('path')


const session = require('./config/session')
require('./config/passport')
require('dotenv').config()

const route = require('./routes/user.route')
const admin_Route = require('./routes/admin.route')

const globalError = require('./middleware/globalErrorHandler')
const user_controller = require('./controllers/user.controller')
require('./cron/monnifypendingtxnAutomation');
const app = express()

app.set('view engine', 'ejs')
app.set("views", path.join(__dirname, "views"));

app.use(
    helmet({
        contentSecurityPolicy:false,
    })
)

app.use(compression())

app.use(morgan('dev'))

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use(cookiesParser())

app.use(session)

app.use(passport.initialize())
app.use(passport.session());

app.use(flash());

app.use((req,res,next)=>{
    res.locals.success = req.flash('success');
    res.locals.error = req.flash('error');
    res.locals.validationErrors = req.flash('validationErrors');
    res.locals.oldInput = req.flash('oldInput')[0]||{};
    res.locals.user = req.user || null 

    next();
})

app.use(express.static('public'));

app.use(user_controller.update_actives)
app.use(route)


app.use(globalError)

module.exports = app;

