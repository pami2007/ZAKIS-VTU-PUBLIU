const axios = require("axios");
const { v4: uuid } = require("uuid");

const config = require('../config/monify.config');
const AppError = require("../utils/AppError");

class MonnifyService {

    static async authenticate() {

        try {

            // Base64(API_KEY:SECRET_KEY)
            const authorization = Buffer.from(
        
                `${config.apiKey}:${config.secretKey}`
            ).toString("base64");

            const response = await axios.post(

                `${config.baseUrl}/auth/login`,

                {},

                {

                    headers: {

                        Authorization: `Basic ${authorization}`,

                        "Content-Type": "application/json"

                    }

                }

            );
            //console.log(response.data)
            return response.data.responseBody.accessToken;

        } catch (error) {

            console.log(error.response?.data || error.message);

            throw new AppError("Unable to authenticate with Monnify");

        }

    }

    static async initializeTransaction(user, amount) {
    try {

        const token = await this.authenticate();

        const paymentReference = uuid();

        const response = await axios.post(

            `${config.baseUrl}/merchant/transactions/init-transaction`,

            {

                amount: amount,

                customerName:`${user.fname} ${user.lname}`,

                customerEmail: user.email,

                paymentReference,

                paymentDescription: "Wallet Funding",

                currencyCode: "NGN",

                contractCode: config.contractCode,

                redirectUrl: `${config.appUrl}`,

                paymentMethods: [

                    "CARD",

                    "ACCOUNT_TRANSFER",

                    "USSD"

                ]

            },

            {

                headers: {

                    Authorization: `Bearer ${token}`,

                    "Content-Type": "application/json"

                },
                timeout:30000

            }

        );
        //console.log(response.data)
        return response.data.responseBody;

    } catch (error) {

        console.log(error.response?.data || error.message);

        throw new AppError("Unable to initialize transaction");

    }

        }


    static async verifyTransaction(transactionReference) {

        try {

            const token = await this.authenticate();

            const response = await axios.get(

                `${config.baseUrl}/merchant/transactions/query`,

                {

                    params: {

                        transactionReference

                    },

                    headers: {

                        Authorization: `Bearer ${token}`

                    }

                }

            );
            //console.log(response.data)
            return response.data.responseBody;

        }

        catch(error){

            console.log(error.response?.data);

            throw error;

        }

    }



}

module.exports =  MonnifyService;