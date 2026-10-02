const passport = require('passport')
const local_strategy = require('passport-local').Strategy
const bcrypt = require('bcrypt')

const user_model = require('../model/userDB')

passport.use(

    new local_strategy(

        {
            usernameField:'email',

            passwordField: 'password'
        },

        async (email, password, done)=>{

            try{

                const userEmail = await user_model.userEMAIL(email);

                if(!userEmail){

                    return done(null, false,{

                        message:'Invalid email or password'
                    })

                }
            
                const match_password = await bcrypt.compare(password, userEmail.password)

                if(!match_password){

                    return done (null, false,{

                        message:'Invalid email or password'
                    })
                }

                return done(null, userEmail)

            }catch(error){

                return done(error)

            }
            
        }
    )
)

passport.serializeUser((userEmail, done)=>{

    done(null, userEmail.id)

})

passport.deserializeUser(async(id, done)=>{

    try{

        const user = await user_model.userID(id);

        done(null, user);

    }catch(error){
        
        done(error)
    }
})