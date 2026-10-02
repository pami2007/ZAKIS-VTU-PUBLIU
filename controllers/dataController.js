const Data_service = require('../services/dataService')
const AppError = require('../utils/AppError')


class Data_controller_flow{

    async data_page(req,res){

        const data = await  Data_service.allData()

        return res.render(

            'data',{

                card:data.dataResult,

                user:req.user

            }
        )
    }


    
    async airtel_page(req,res,next){

        const airtel_datas = await Data_service.airtel_Data()

        return res.render(

            'data',{

                card:airtel_datas.airtel,

                user:req.user
            }
        )
    }



    async glo_page(req,res,next){

        const glo_datas = await Data_service.glo_Data()

        return res.render(

            'data',{

                card:glo_datas.glo,

                user:req.user
            }
        )
    }



    async data_post(req,res,next){

        try{
            
            const {id} = req.params

            const {phone} =req.validators

            const userId = req.user.id

            const dataID = await Data_service.AllDataID(id)

            const network = dataID.dataIdResult.network

            const type = dataID.dataIdResult.type

            const plan = dataID.dataIdResult.plan

            const days = dataID.dataIdResult.duration

            const amount = dataID.dataIdResult.amount

            const zaki_amount = dataID.dataIdResult.zd_price

            const data_id = dataID.dataIdResult.id

            const networkID = dataID.dataIdResult.networkID

            const variation_Code = dataID.dataIdResult.variation_Code

            const result = await Data_service.data_purchase_flow(
                userId,
                type,
                amount,
                network,
                phone,
                networkID,
                data_id,
                variation_Code,
                zaki_amount
            )

            return res.render('details',{

                card:result.response
            })

        }catch(err){

            if(err instanceof AppError){

                req.flash('error', err.message || 'ERROR ON THE SERVER'

                )

                return req.session.save((saveErr)=>{

                    if(saveErr){return next(saveErr)}
                    
                    return res.redirect('/data/mtn')
                })
            }

        }
    }
}

module.exports = new Data_controller_flow()