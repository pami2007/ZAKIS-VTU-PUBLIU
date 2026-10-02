const pool = require('../config/database')

class user_db_flow{
    static async register(userData){
        const{fname,lname,email,phone,password} = userData
        const [result] =await pool.execute(
            `INSERT INTO myusers(fname,lname,email,phone,password)
            VALUES(?,?,?,?,?)`,
            [
                fname,lname,email,phone,password
            ]
        )
        return result
    }
                                        
    static async userEMAIL(email){
        const [rolls] = await pool.execute(
            `SELECT * FROM myusers
            WHERE email = ?
            LIMIT 1`,
            [
                email
            ]
        )
        return rolls[0]
    }

    static async userID(id){
        const [rolls] = await pool.execute(
            `SELECT id,fname,lname,email,phone,bal,roles,cashBack,total_cb
            FROM myusers
            WHERE id = ?`,
            [
                id
            ]
        )
        return rolls[0]
    }

    static async historyDetails(id, userId){
        
        const [rolls] = await pool.execute(
            `SELECT * FROM  txn_table
            WHERE id = ? AND userId = ?`,
            [
                id,userId
            ]
        )
        return rolls[0]
    }

    static async recentHistory(userId){
        const [result] = await pool.execute(
            `SELECT * FROM txn_table
            WHERE userId = ?
            ORDER BY (id) DESC
            LIMIT 3`,
            [
                userId
            ]
        )
        return result
    }

    static async recentHistoryData(userId){
        const [result] = await pool.execute(
            `SELECT * FROM txn_table
            WHERE userId = ?
            ORDER BY (id) DESC
            LIMIT 20`,
            [
                userId
            ]
        )
        return result
    }

    static async cashback_history(userId){
        const [result] = await pool.execute(
            `SELECT * FROM txn_table
            WHERE ser_type = 'Cashback'
            AND userId = ?
            ORDER BY (id) DESC
            LIMIT 10`,
            [
                userId
            ]
        )
        return result
    }

    static async overall_cashback_today(){
        const [result] = await pool.execute(
            ` SELECT SUM(profit) as cb FROM txn_table
            WHERE ser_type = 'Cashback' AND status = 'successful' AND dates >=CURDATE() 
            AND dates < CURDATE() + INTERVAL 1 DAY`
        )
        return result[0]
    }

    static async recent_cashback(userId){
        const [result] = await pool.execute(
            `SELECT * FROM txn_table
            WHERE ser_type = 'Cashback'
            AND userId = ?
            ORDER BY (id) DESC
            LIMIT 3`,
            [
                userId
            ]
        )
        return result
    }

    static async last_actives(id){
        const [result] =await pool.execute(
            `UPDATE myusers
            SET last_active = NOW()
            WHERE id = ?`,
            [
                id
            ]
        )
        return result
    }
    
}

module.exports = user_db_flow