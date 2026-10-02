const pool = require('../config/database')

class user_transaction{
    static async deposit_Transaction_details(connection, userId,ser_type, amount,status,ref_id,decription,payment_reference,transactionReference ){
        const [result] = await connection.execute(
            `INSERT INTO txn_table(userId,ser_type, amount,status,ref_id,description,payment_reference,transactionReference )
            VALUES(?,?,?,?,?,?,?,?)`,
            [
                userId,ser_type, amount,status,ref_id,decription,payment_reference,transactionReference
            ]
        )
        return result
    }

    static async Transaction_details(connection, userId,ser_type,amount,network, phone,status,ref_id,description,pur_id){
        const [result] = await connection.execute(
            `INSERT INTO txn_table(userId,ser_type,amount,network, phone,status,ref_id,description,purcahase_id
)
            VALUES(?,?,?,?,?,?,?,?,?)`,
            [
                userId,ser_type,amount,network, phone,status,ref_id,description,pur_id
            ]
        )
        return result
    }

    static async updateStatus(connection, status, ref_id){
        const [result] = await connection.execute(
            `UPDATE txn_table
            SET status = ?
            WHERE ref_id = ?`,
            [
                status, ref_id
            ]
        )
        return result
    }

    static async paid_amount(connection, amount_paid, ref_id){
        const [result] = await connection.execute(
            `UPDATE txn_table
            SET amount_paid = ?
            WHERE ref_id = ?`,
            [
                amount_paid, ref_id
            ]
        )
        return result
    }

    static async profit(connection, amount, ref_id){
        const [result] = await connection.execute(
            `UPDATE txn_table
            SET profit = ?
            WHERE ref_id = ?`,
            [
                amount,  ref_id
            ]
        )
        return result
    }

    static async last_txn(connection, ref_id){
        const [rolls] = await connection.execute(
            `SELECT * FROM txn_table
            WHERE ref_id = ?`,
            [
                ref_id
            ]
        )
        return rolls[0]
    }

    static async description(connection, description, ref_id){
        const [result] = await connection.execute(
            `UPDATE txn_table
            SET description = ?
            WHERE ref_id = ?`,
            [
                description, ref_id
            ]
        )
        return result
    }

    static async lock_Rows(connection,id){
        const [rolls] = await connection.execute(
            `SELECT * FROM myusers
            WHERE id = ?
            FOR UPDATE
            `,
            [
                id
            ]
        )
        return rolls[0]
    }

    static async fund_wallet(connection, fund, id){
        const [result] =await connection.execute(
            `UPDATE myusers
            SET bal = bal + ?
            WHERE id = ?`,
            [
                fund,id
            ]
        )
        return result
    }

    static async deduct_funds(connection, amount, id){
        const [result] = await connection.execute(
            `UPDATE myusers
            SET bal = bal - ?
            WHERE id = ?`,
            [
                amount,id
            ]
        )
        return result
    }

    static async get_id(userId){
        const [result] = await pool.execute(
            `SELECT id FROM txn_table
            WHERE userId = ?`,
            [
                userId
            ]
        )
        return result
    }

    static async status_checker(){
        const [result] = await pool.execute(
            `SELECT * FROM txn_table
            WHERE status = 'pending' and ser_type = 'AIRTIME' OR ser_type = 'DATA'
`
        )
        return result
    }

    static async 

    static async status_id(id){
        //console.log(id)
        const [rolls] = await pool.execute(
            `SELECT * FROM txn_table
            WHERE id = ?`,
            [
                id
            ]
        )
        return rolls[0]
    }

    static async status_update_Details(connection, userId,network,type,amount,description,ref_id,txn_date){
        const [result] = await connection.execute(
            `INSERT INTO status_table(userId,network,type,amount,description,ref_id,txn_date)
            VALUES(?,?,?,?,?,?,?)`,
            [
                userId,network,type,amount,description,ref_id,txn_date
            ]
        )
        return result
    }

    static async getTransactionByReference(connection, paymentReference){
        const [rolls] = await connection.execute(
            `SELECT * FROM  txn_table
            WHERE payment_reference =?
            FOR UPDATE`,
            [
                paymentReference
            ]
        )
        return rolls[0]
    }

    static async Discount(connection, discount, ref_id){
        const [result] = await connection.execute(
            `UPDATE txn_table
            SET discount = ?
            WHERE ref_id = ?`,
            [
                discount,ref_id
            ]
        )
        return result
    }


    static async User_profit(connection, user_profit, ref_id){
        const [result] = await connection.execute(
            `UPDATE txn_table
            SET user_profit =?
            WHERE ref_id = ?`,
            [
                user_profit, ref_id
            ]
        )
        return result
    }

    static async Cashback(connection, cashback,cash_back, userId){
        const [result] = await connection.execute(
            `UPDATE myusers
            SET cashBack = cashBack + ?, total_cb = total_cb + ?
            WHERE id = ?`,
            [
                cashback,cash_back, userId
            ]
        )
        return result
    }


    static async get_ref_id(connection, ref_id){
        const [rolls] = await connection.execute(
            `SELECT * FROM txn_table
            WHERE ref_id = ?
            FOR UPDATE`,
            [
                ref_id
            ]
        )
        return rolls[0]
    }

    static async record_cashback_txn(connection, userId,amount,status,ref_id,description,ser_type){
        const [result] = await connection.execute(
            `INSERT INTO txn_table(userId,amount,status,ref_id,description,ser_type)
            VALUES (?,?,?,?,?,?)`,
            [
                userId,amount,status,ref_id,description,ser_type
            ]
        )
        return result
    }

    static async updateCB_bal(connection,id){
        const [result] = await connection.execute(
            `UPDATE myusers
            SET cashBack = '0.00'
            WHERE id = ?`,
            [
                id
            ]
        )
        return result
    }

    static async totalBal(connection, total_cb_claim,ref_id){
        const [result] = await connection.execute(
            `UPDATE txn_table
            SET total_cb_claim =  ?
            WHERE ref_id = ?`,
            [
                 total_cb_claim,ref_id
            ]
        )
        return result
    }


}

module.exports = user_transaction



