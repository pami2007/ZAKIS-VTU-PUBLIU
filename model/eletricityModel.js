const pool = require('../config/database')

class eletricity_model_flow{
    //EVEREYTHING ABOUT ELETRICITY

    static async eletric_serviceID(eletric_provider){
        console.log(`model ${eletric_provider}`)
        const [rolls] = await pool.execute(
            `SELECT * FROM eletric_table
            WHERE electric_provider = ?`, 
            [
                eletric_provider
            ]
        )
        return rolls
    }

    static async eletric_txn_details(connection, userId,ser_type,amount,phone, status, ref_id, description,meter_type,meter_number){
        const [result] = await connection.execute(
            `INSERT INTO txn_table(userId, ser_type, amount,phone, status, ref_id, description,meter_type,meter_number)
            VALUES(?,?,?,?,?,?,?,?,?)`,
            [
              userId, ser_type, amount,phone, status, ref_id, description,meter_type,meter_number  
            ]
        )
        return result
    }

    static async tokenes(connection,tokens, ref_id){
        const [result] = await connection.execute(
            `UPDATE txn_table
            SET token = ?
            WHERE ref_id = ?`,
            [
                tokens, ref_id
            ]
        )
        return result
    }

    
    static async address(connection,addresss, ref_id){
        const [result] = await connection.execute(
            `UPDATE txn_table
            SET address = ?
            WHERE ref_id = ?`,
            [
                addresss, ref_id
            ]
        )
        return result
    }

    

    static async units(connection,units, ref_id){
        const [result] = await connection.execute(
            `UPDATE txn_table
            SET units = ?
            WHERE ref_id = ?`,
            [
                units, ref_id
            ]
        )
        return result
    }

    static async customer_name(connection,customer_names, ref_id){
        const [result] = await connection.execute(
            `UPDATE txn_table
            SET customer_name = ?
            WHERE ref_id = ?`,
            [
                customer_names, ref_id
            ]
        )
        return result
    }

     static async receiptNO(connection,token_amounts, ref_id){
        const [result] = await connection.execute(
            `UPDATE txn_table
            SET token_amount = ?
            WHERE ref_id = ?`,
            [
                token_amounts, ref_id
            ]
        )
        return result
    }

    static async eletric_provider(connection,eletric_providers, ref_id){
        const [result] = await connection.execute(
            `UPDATE txn_table
            SET eletric_provider = ?
            WHERE ref_id = ?`,
            [
                eletric_providers, ref_id
            ]
        )
        return result
    }


    ///////
    static async tokenes1(tokens, ref_id){
        const [result] = await pool.execute(
            `UPDATE txn_table
            SET token = ?
            WHERE ref_id = ?`,
            [
                tokens, ref_id
            ]
        )
        return result
    }

    
    static async address1(addresss, ref_id){
        const [result] = await pool.execute(
            `UPDATE txn_table
            SET address = ?
            WHERE ref_id = ?`,
            [
                addresss, ref_id
            ]
        )
        return result
    }

    

    static async units1(units, ref_id){
        const [result] = await pool.execute(
            `UPDATE txn_table
            SET units = ?
            WHERE ref_id = ?`,
            [
                units, ref_id
            ]
        )
        return result
    }

    static async customer_name1(customer_names, ref_id){
        const [result] = await pool.execute(
            `UPDATE txn_table
            SET customer_name = ?
            WHERE ref_id = ?`,
            [
                customer_names, ref_id
            ]
        )
        return result
    }

     static async receiptNO1(token_amounts, ref_id){
        const [result] = await pool.execute(
            `UPDATE txn_table
            SET token_amount = ?
            WHERE ref_id = ?`,
            [
                token_amounts, ref_id
            ]
        )
        return result
    }

    static async eletric_provider1(eletric_providers, ref_id){
        const [result] = await pool.execute(
            `UPDATE txn_table
            SET eletric_provider = ?
            WHERE ref_id = ?`,
            [
                eletric_providers, ref_id
            ]
        )
        return result
    }

    static async paid_amount1( amount_paid, ref_id){
        const [result] = await pool.execute(
            `UPDATE txn_table
            SET amount_paid = ?
            WHERE ref_id = ?`,
            [
                amount_paid, ref_id
            ]
        )
        return result
    }

    static async updateStatus1( status, ref_id){
        const [result] = await pool.execute(
            `UPDATE txn_table
            SET status = ?
            WHERE ref_id = ?`,
            [
                status, ref_id
            ]
        )
        return result
    }
}

module.exports = eletricity_model_flow