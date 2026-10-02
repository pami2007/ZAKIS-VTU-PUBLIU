const axios = require('axios')

const AppError = require('../utils/AppError')

const vtpassDetails = require('../config/envVtpass')


class Status_alogrithm{
    static async status_api_flow(request_ID){
        try{
                const response = await axios.post(

                vtpassDetails.vtpassrequryurl,
                {
                    request_id:String(request_ID)
                },
                {
                    headers:{
                        'api-key': process.env.VTPASS_API_KEY,

                        'secret-key': process.env.VTPASS_SK_KEY 
                    },
                    timeout: 30000
                }
            
        )
            return response.data

        }catch(error){
            //console.log(error.response.data)
             if (error.response) {

                throw new AppError(
                    error.response.data.content.errors || 
                    'An error occurred while processing the request.'
                );
            }

            if (error.request) {
                throw new Error(
                    "Unable to connect to the provider. Please check your internet connection."
                );
            }
            throw error;
             
        }
    }
}

module.exports = Status_alogrithm