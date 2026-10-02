const status_service = require('../services/status.checker.service')
const AppError = require('../utils/AppError')


class status_controller_flow{
    async status_lists(req,res){
        const all_statuss = await status_service.status_list()
        return res.render(
            'pending_status',{
                card:all_statuss.all_status
            }
        )
    }

    async status_list_ID(req,res,next){
        try{
        const {id} = req.params
        const status_id = await status_service.status_list_ID(id)
        const userId = status_id.statusID.userId
        const ref_id = status_id.statusID.ref_id
        const network = status_id.statusID.network
        const type = status_id.statusID.ser_type
        const amount = status_id.statusID.amount
        const description = status_id.statusID.description
        const txn_date = status_id.statusID.dates
        const result = await status_service.status_logic(userId,network,type,amount,description,ref_id,txn_date)
 
        if(result.response.transactions.status === 'delivered'){
            req.flash('success', 'pending transaction status have been updated to successful')

            return req.session.save((saveErr)=>{
                if (saveErr){return next(saveErr)};
                return res.redirect('/status/pending')
            })

        }else if(result.response.transactions.status === 'failed'){
            req.flash('success', 'pending status has been updated to failed and account refunded')
            return req.session.save((saveErr)=>{
                if (saveErr){return next(saveErr)};
                return res.redirect('/status/pending')
            })

        }else{
            req.flash('error', 'Transaction still pending')
            return req.session.save((saveErr)=>{
                if (saveErr){return next(saveErr)};
                return res.redirect('/status/pending')
            })
        }
        }catch(err){
            if(err instanceof AppError){
                req.flash('error', err.message || 'ERROR ON THE SERVER')
                 return req.session.save((saveErr)=>{
                    if(saveErr){return next(saveErr)}
                    return res.redirect('/status/pending')
                })
            }
        }
    }
}


module.exports = new status_controller_flow()