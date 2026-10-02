const airtimeService = require('../services/airtime.service')
const AppError = require('../utils/AppError')

class airtime_controller_flow{

    async airtimePAGE(req,res,next){

        const allSerAir = await airtimeService.All_Airtime()

        res.render('airtime',{

            card:allSerAir.allAirtime,

            user:req.user
        })
    }

    async glo_airtime_page(req,res,next){

        const glo = await airtimeService.All_Airtime_glo()

        res.render('airtime',{

            card:glo.glo_airtime,

            user:req.user
        })
    }

    async airtel_airtime_page(req,res,next){

        const airtel = await airtimeService.All_Airtime_airtel()

        res.render('airtime',{

            card:airtel.airtel_airtime,

            user:req.user
        })
    }



    async airtimeController(req,res,next){

        try{
            const {id} = req.params

            const {phone} = req.validators

            const allSerID = await airtimeService.AirtimeID(id)

            const userId = req.user.id

            const networkID = allSerID.airtimeid.networkID

            const network = allSerID.airtimeid.network

            const amount = allSerID.airtimeid.amount

            const type = allSerID.airtimeid.type

             const airtime_id = allSerID.airtimeid.id

            const result = await airtimeService.Airtime_logic(
                userId,
                type,
                amount,
                network,
                phone,
                networkID,
                airtime_id
            )

            return res.render('details',{

                card:result.response

            })

        }catch(err){

            if(err instanceof AppError){

                req.flash('error'  ,err.message)


                return req.session.save((saveErr)=>{

                    if(saveErr){
                        
                        return next(saveErr)
                        
                    }
                    return res.redirect('/airtime/mtn')
                })
            }
        }
    }//

}

module.exports =new airtime_controller_flow()