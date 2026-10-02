const pool = require('../config/database')

class airtime_DB_flow{
    static async all_airtime(){
        const  [result] =  await pool.execute(
            `SELECT * FROM airtime_table
            WHERE networkID = 1 AND active_status = 'active'`
        )
        return result
    }

    static async all_airtime_airtel(){
        const  [result] =  await pool.execute(
            `SELECT * FROM airtime_table
            WHERE networkID = 2 AND active_status = 'active'`
        )
        return result
    }

    static async all_airtime_glo(){
        const  [result] =  await pool.execute(
            `SELECT * FROM airtime_table
            WHERE networkID = 3 AND active_status = 'active'`
        )
        return result
    }

    static async airtimeID(id){
        const [rolls] = await pool.execute(
            `SELECT * FROM airtime_table
            WHERE id = ?`,
            [
                id
            ]
        )
        return rolls[0]
    }
}

module.exports = airtime_DB_flow