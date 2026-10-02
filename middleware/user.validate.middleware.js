const { validationResult, matchedData } = require('express-validator')

class validate_project_flow{
    async validate_user(req,res,next){
        const errors = validationResult(req);

        if(!errors.isEmpty()){
            req.flash('validationErrors', errors.array())
            req.flash('oldInput', req.body);

            return req.session.save((err)=>{
                if (err){
                    return next(err)
                }
                return res.redirect('/register')
            })
        }

        req.validators = matchedData(req)
        next()
    }

    async airtime_validate(req,res,next){
        const errors = validationResult(req)
        if(!errors.isEmpty()){
            req.flash('validationErrors', errors.array())
            req.flash('oldInput', req.body)
            return req.session.save((err)=>{
                if(err){
                    return next(err)
                };
                return res.redirect('/airtime/mtn')
            })
        }
        req.validators = matchedData(req)
        next()
    }

    async Data_validate(req,res,next){
        const errors = validationResult(req)
        if(!errors.isEmpty()){
            req.flash('validationErrors', errors.array())
            req.flash('oldInput', req.body)
            return req.session.save((err)=>{
                if(err){
                    return next(err)
                };
                return res.redirect('/data/mtn')
            })
        }
        req.validators = matchedData(req)
        next()
    }

    async amount_validate(req,res,next){
        const errors = validationResult(req)
        if(!errors.isEmpty()){
            req.flash('validationErrors', errors.array())
            req.flash('oldInput', req.body)
            return req.session.save((err)=>{
                if(err){
                    return next(err)
                };
                return res.redirect('/deposit')
            })
        }
        req.validators = matchedData(req)
        next()
    }

    async eletricity_validate(req,res,next){
        const errors = validationResult(req)
        if(!errors.isEmpty()){
            req.flash('validationErrors', errors.array())
            req.flash('oldInput', req.body)
            return req.session.save((err)=>{
                if(err){
                    return next(err)
                };
                return res.redirect('/electricity/purchase')
            })
        }
        req.validators = matchedData(req)
        next()
    }
}



module.exports =new validate_project_flow()