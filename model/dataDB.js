const pool =  require('../config/database')

class data_Db_flow{
    static async allDATA(){
        const [result] = await pool.execute(
            `SELECT * FROM data_table
            WHERE networkID =1 AND active_status = 'active'`
        )
        return result
    }

     static async airtel_data(){
        const [result] = await pool.execute(
            `SELECT * FROM data_table
            WHERE networkID = 2 AND active_status = 'active'`
        )
        return result
    }

     static async glo_data(){
        const [result] = await pool.execute(
            `SELECT * FROM data_table
            WHERE networkID = 3 AND active_status = 'active'`
        )
        return result
    }

    static async data_ID(id){
        const [rolls] = await pool.execute(
            `SELECT * FROM data_table
            WHERE id = ?`,
            [
                id
            ]
        )
        return rolls[0]
    }
}

module.exports = data_Db_flow



