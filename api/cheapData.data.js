const axios = require('axios')

const AppError = require('../utils/AppError')

const vtpassDetails = require('../config/envVtpass')


class data_api_flow{

    static async cheapData(
        request_id,
        serviceID,
        billersCode,
        variation_Code,
        amount,phone
    ){
        
        try{
            const response = await axios.post(

                vtpassDetails.baseUrl,

                {
                    request_id:String(request_id),

                    serviceID:String(`${(serviceID).toLowerCase()}-data`),

                    billersCode:String(phone),

                    variation_code:String(variation_Code),

                    amount:Number(amount),

                    phone:Number(phone)
                },
                {
                    headers:{

                        'api-key': vtpassDetails.apiKey,

                        'secret-key': vtpassDetails.secretKey
                    },
                    timeout: 30000
                },
                
            )
            //console.log(response.data)
            return response.data

        }catch(error){

             if (error.response) {

                throw new AppError(
                    error.response.data.content.errors || 

                    'An error occurred while processing the request.'
                );
            }

            if(error.request){
                
                throw new AppError(
                    'Unable to connect to the provider. Please check your internet connection.'
                )
            }
            throw error;
        }
    }
}

module.exports = data_api_flow