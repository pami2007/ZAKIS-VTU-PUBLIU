const session = require("express-session");
require('dotenv').config()

const MySQLStore = require("express-mysql-session")(session);

const options = {

    host: process.env.DB_HOST,

    port: process.env.DB_PORT,

    user: process.env.DB_USER,

    password: process.env.DB_PASSWORD,

    database: process.env.DB_DB

};

const sessionStore = new MySQLStore(options);

module.exports = session({

    key: "sid",

    secret: process.env.SESSION_SECRET,

    store: sessionStore,

    resave: false,

    saveUninitialized: false,

    cookie: {

        httpOnly: true,

        priority:"high",
        
        secure: process.env.NODE_ENV === "production",

        sameSite: "lax",

        maxAge: 1000 * 60 * 60

    }

});