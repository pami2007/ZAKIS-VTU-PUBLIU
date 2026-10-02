const axios = require('axios')

const AppError = require('../utils/AppError')

const vtpassDetails = require('../config/envVtpass')

class airtime_api_flow{

    static async cheap_airtime(request_ID, serviceID, amount, phone){

        try{

                const response = await axios.post(

                vtpassDetails.baseUrl,
                {
                    request_id: String(request_ID),

                    serviceID: String(serviceID).toLowerCase(),

                    amount: Number(amount),

                    phone:Number(phone)
                },
                {
                    headers:{

                        'api-key': vtpassDetails.apiKey,

                        'secret-key': vtpassDetails.secretKey
                    },
                    timeout: 30000
                }
            
        )
            return response.data


        }catch(error){

    if (error.response) {

        throw new AppError(

            error.response.data.content.errors ||

            "Provider returned an error."
        );
    }

    if (error.request) {

        throw new AppError(
            
            "Unable to connect to the provider."
        );
    }

    throw error;
}
    }
}

module.exports = airtime_api_flow