const axios = require('axios')

const AppError = require('../utils/AppError')

const vtpassDetails = require('../config/envVtpass')


class electricity_API_flow{

    static async verify_electricity(
        meter_provider,
        
        meter_type, 
        
        meter_number){
        try{

            const response = await axios.post(

                vtpassDetails.baseUrlverify,
                {
                   billersCode: Number(meter_number),

                   serviceID: String(meter_provider),

                   type: String(meter_type) 
                },
                {
                    headers:{

                        'api-key': vtpassDetails.apiKey,

                        'secret-key': vtpassDetails.secretKey
                    },
                    timeout: 30000
                }
            )
            //console.log(response.data)
            return response.data
        }catch(error){
            if (error.response) {
                throw new AppError(
                    error.response.data.content.errors ||
                     'An error occurred while processing the request.');
            }

            //console.log(error.request)

            if (error.request) {
                throw new Error(
                    "Unable to connect to the provider. Please check your internet connection."
                );
            }
        }
    }

    static async electric_purchase_flow( 
        ref_id,serviceID, 
        meter_number,
        meter_type,
        amount,
        phone
    
    ){
        try{
            const response = await axios.post(

                vtpassDetails.baseUrl,

                {
                    request_id:String(ref_id),

                    serviceID:String(serviceID),

                    billersCode:String(meter_number),

                    variation_code:String(meter_type),

                    amount:Number(amount),

                    phone:Number(phone)
                },
                {
                    headers:{
                        'api-key': vtpassDetails.apiKey,

                        'secret-key': vtpassDetails.secretKey
                    },
                    timeout: 50000
                }
            )
            return response.data

        }catch(error){

             if (error.response) {
                throw new AppError(
                    error.response.data.content.errors || 
                    'An error occurred while processing the request.'
                );
            }

            //console.log(error.request)

            if (error.request) {
                throw new Error(
                    "Unable to connect to the provider. Please check your internet connection."
                );
            }
            throw error;    
        }
    }


}

module.exports = electricity_API_flow