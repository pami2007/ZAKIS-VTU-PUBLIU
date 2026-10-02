const electric_service = require('../services/electricityService')
const AppError = require('../utils/AppError')

class electric_controller_flow{

    async electric_page(req,res,next){

        return res.render(

            'electric'
        )
    }



    async electric_verification(req, res, next) {
    try {

        const { meter_provider, meter_type, meter_number } = req.validators;

        const result = await electric_service.eletric_verification(

            meter_provider,

            meter_type,

            meter_number
        );
        return res.status(200).json(

            result.verifyElectric
        );

    } catch (error) {

        console.error(error.message);

        return res.status(503).json({

            success: false,

            message: error.message
        });

    }
}
    


    async electricity_purchase(req,res,next){

        try{
            const {meter_provider,meter_type, meter_number, phone, amount } = req.validators

            const userId = req.user.id

            const result = await electric_service.electricity_purchases(
                userId,
                
                meter_type, 
                
                meter_number, 
                
                phone, amount, 
                
                meter_provider
            )
            return res.render(

                'details',{

                    card:result.response
                }
            )
        }catch(err){

            if(err instanceof AppError){

                req.flash('error', err.message || 'ERROR ON THE SERVER')

                return req.session.save((saveErr)=>{

                    if(saveErr){return next(saveErr)}
                    
                    return res.redirect('/electricity/purchase')
                })
            }
        }
        
    }
}

module.exports = new electric_controller_flow()