const pool = require('../config/database')

class admin_model_flow{
    static async total_user(){
        const [result] = await pool.execute(
            `select COUNT(id) AS TU FROM myusers`
        )
        return result[0]
    }

    static async total_txn(){
        const [result] = await pool.execute(
            `SELECT COUNT(id) AS total_txn FROM txn_table`
        )
        return result[0]
    }

    static async total_DEPOSIT(){
        const [result] = await pool.execute(
            `SELECT SUM(bal) AS totalDeposit FROM myusers
            `
        )
        return result[0]
    }

    static async totals_DEPOSIT(){
        const [result] = await pool.execute(
            `SELECT SUM(amount) AS totalDeposit FROM my_users
            WHERE ser_type = 'deposit' AND status = 'successful'`
        )
        return result[0]
    }

    static async total_PROFIT(){
        const [result] =await pool.execute(
            `SELECT sum(profit) AS tp FROM txn_table
            WHERE status = 'successful'`
        )
        return result[0]
    }

    static async today_PROFIT(){
        const [result] =await pool.execute(
            `SELECT sum(profit) AS tp FROM txn_table
            WHERE status = 'successful' AND dates >=CURDATE() 
            AND dates < CURDATE() + INTERVAL 1 DAY`
        )
        return result[0]
    }

    static async successSTATUS(){
        const [result] = await pool.execute(
            `SELECT COUNT(status) AS ss FROM txn_table
            WHERE status ='successful' AND dates >=CURDATE() 
            AND dates < CURDATE() + INTERVAL 1 DAY`
        )
        return result[0]
    }

    static async failSTATUS(){
        const [result] = await pool.execute(
            `SELECT COUNT(status) AS fs FROM txn_table
            WHERE status ='failed' AND dates >=CURDATE() 
            AND dates < CURDATE() + INTERVAL 1 DAY`
        )
        return result[0]
    }

    static async pendingSTATUS(){
        const [result] = await pool.execute(
            `SELECT COUNT(status) AS ps FROM txn_table
            WHERE status ='pending' AND dates >=CURDATE() 
            AND dates < CURDATE() + INTERVAL 1 DAY`
        )
        return result[0]
    }

    static async txn_purchase(){
            const [result] =await pool.execute(
                `SELECT * FROM txn_table
                ORDER BY (id) DESC`
            )
            return result
    }

    static async roles(id){
        const [rolls] = await pool.execute(
            `SELECT roles FROM myusers
            WHERE id = ?
            `,
            [
                id
            ]
        )
        return rolls[0].roles
    }

    static async active_user(){
        const [result] = await pool.execute(
            `SELECT COUNT(last_active) as active FROM myusers
            WHERE last_active >=CURDATE() 
            AND last_active < CURDATE() + INTERVAL 1 DAY`
        )
        return result[0]
    }

    static async user_info(){
        const [result] = await pool.execute(
            `SELECT * FROM myusers
            ORDER BY (id) DESC`
        )
        return result
    }

    static async new_users(){
        const [result] = await pool.execute(
            `SELECT COUNT(ID) AS new FROM myusers
            WHERE date_Joined >=CURDATE() 
            AND date_Joined < CURDATE() + INTERVAL 1 DAY`
        )
        return result[0]
    }

    static async suspend_user(){
        const [result] = await pool.execute(
            `SELECT COUNT(ID) AS sus FROM myusers
            WHERE acc_status = 'suspend'`
        )
        return result[0]
    }


    static async total_txn(){
        const [result] =await pool.execute(
            `SELECT COUNT(id) AS total_txn FROM txn_table`
        )
        return result[0]
    }

    static async total_success_txn(){
        const [result] = await pool.execute(
            `SELECT COUNT(id) AS total_success FROM txn_table
            WHERE status = 'successful'`
        )
        return result[0]
    }

    static async total_fail_txn(){
        const [result] = await pool.execute(
            `SELECT COUNT(id) AS total_fail FROM txn_table
            WHERE status = 'failed'`
        )
        return result[0]
    }

    static async total_pending_txn(){
        const [result] = await pool.execute(
            `SELECT COUNT(id) AS total_pending FROM txn_table
            WHERE status = 'pending'`
        )
        return result[0]
    }

    static async all_txn_record(){
        const [result] = await pool.execute(
            `SELECT * FROM txn_table
            ORDER BY (id) DESC`
        )
        return result
    }

    static async overall_deposit(){
        const [result] = await pool.execute(
            ` SELECT SUM(amount) as deposit FROM txn_table
            WHERE ser_type = 'DEPOSIT' AND status = 'successful'`
        )
        return result[0]
    }


    static async overall_deposit_today(){
        const [result] = await pool.execute(
            ` SELECT SUM(amount) as deposit FROM txn_table
            WHERE ser_type = 'DEPOSIT' AND status = 'successful' AND dates >=CURDATE() 
            AND dates < CURDATE() + INTERVAL 1 DAY`
        )
        return result[0]
    }

    static async overall_pending_deposit(){
        const [result] = await pool.execute(
            ` SELECT SUM(amount) as deposit FROM txn_table
            WHERE ser_type = 'DEPOSIT' AND status = 'pending'`
        )
        return result[0]
    }

    static async overall_fail_deposit(){
        const [result] = await pool.execute(
            ` SELECT SUM(amount) as deposit FROM txn_table
            WHERE ser_type = 'DEPOSIT' AND status = 'failed'`
        )
        return result[0]
    }

    static async deposit_history_details(){
        const [result] = await pool.execute(
            `SELECT * FROM txn_table
            WHERE ser_type = 'DEPOSIT'
            ORDER BY (id) DESC`
        )
        return result
    }


    static async total_airtime_PROFIT(){
        const [result] =await pool.execute(
            `SELECT sum(profit) AS tp FROM txn_table
            WHERE ser_type = 'AIRTIME' AND status = 'successful'`
        )
        return result[0]
    }

    static async total_data_PROFIT(){
        const [result] =await pool.execute(
            `SELECT sum(profit) AS tp FROM txn_table
            WHERE ser_type = 'DATA' AND status = 'successful'`
        )
        return result[0]
    }

    static async total_deposit_PROFIT(){
        const [result] =await pool.execute(
            `SELECT sum(profit) AS tp FROM txn_table
            WHERE ser_type = 'DEPOSIT' AND status = 'successful'`
        )
        return result[0]
    }

    static async monthly_PROFIT(){
        const [result] =await pool.execute(
            `SELECT sum(profit) AS tp FROM txn_table
            WHERE status = 'successful' AND dates >=DATE_FORMAT(CURDATE(), '%Y-%n-01')
            AND dates <= LAST_DAY(CURDATE())`
        )
        return result[0]
    }

    static async total_eletricity_PROFIT(){
        const [result] =await pool.execute(
            `SELECT sum(profit) AS tp FROM txn_table
            WHERE ser_type = 'eletricity' AND status = 'successful'`
        )
        return result[0]
    }

    static async total_cashback(){
        const [result] =await pool.execute(
            `SELECT sum(total_cb) AS tp FROM myusers`
        )
        return result[0]
    }


    
    static async acc_status(id){
        const [rolls] = await pool.execute(
            `SELECT acc_status FROM myusers
            WHERE id = ?
            `,
            [
                id
            ]
        )
        return rolls[0].acc_status
    }


    static async deativateUser(id){
        const [result] = await pool.execute(
            `UPDATE myusers
            SET acc_status ='suspend'
            WHERE id = ? `,
            [
                id
            ]
        )
        return result
    }

    static async ativateUser(id){
        const [result] =await pool.execute(
            `UPDATE myusers
            SET acc_status ='active'
            WHERE id = ? `,
            [
                id
            ]
        )
        return result
    }

    static async user_info_byID(id){
        const [result] = await pool.execute(
            `SELECT * FROM myusers
            WHERE id = ?`,
            [
                id
            ]
        )
        return result[0]
    }
/////
///
    static async edit_user_info(fname,lname,email,phone,bal,cashBack, roles,acc_status,id){
        //console.log(id)
        const [result] = await pool.execute(
            `UPDATE myusers
            SET fname=?, lname =?, email = ?, phone = ?,bal=?, cashBack =?, roles = ?, acc_status = ?
            WHERE id = ?`,
            [
                fname,lname,email,phone,bal,cashBack, roles,acc_status,id
            ]
        )
        return result   
    }
////
    static async deposit_fee(){
        const [result] = await pool.execute(
            `SELECT SUM(amount_paid) AS DF FROM txn_table
            WHERE ser_type = 'DEPOSIT' AND status = 'successful'` 
        )
        return result[0]
    }

    static async historyDetails(id){
        
        const [rolls] = await pool.execute(
            `SELECT * FROM  txn_table
            WHERE id = ? `,
            [
                id,
            ]
        )
        return rolls[0]
    }

    static async getmonifyPendingTransactions(){
        const [result] = await pool.execute(
            `SELECT * FROM txn_table 
            WHERE status = 'pending' AND ser_type = 'DEPOSIT'
            ORDER BY id ASC
            LIMIT 10`
        )
        return result
    }

    static async updatesStatus(status, ref_id){
        const [result] = await pool.execute(
            `UPDATE txn_table
            SET status = ? WHERE ref_id = ?`,
            [
                status, ref_id
            ]
        )
        return result
    }

    static async updaterefund(amount, id){
        const [result] = await pool.execute(
            `UPDATE myusers
            SET bal = bal + ?
            WHERE id = ?`,
            [
                amount, id
            ]
        )
        return result
    }

    static async paidAmount(amount, ref_id){
        const [result] = await pool.execute(
            `UPDATE txn_table
            SET amount_paid = ? WHERE ref_id = ?`,
            [
                amount, ref_id
            ]
        )
        return result
    }

    static async profits(amount, ref_id){
        const [result] = await pool.execute(
            `UPDATE txn_table
            SET profit = ? WHERE ref_id = ?`,
            [
                amount, ref_id
            ]
        )
        return result
    }

    
    static async totaldatacount(){
        const [result] = await pool.execute(
            `SELECT COUNT(id) AS tc FROM data_table`
        )
        return result[0]
    }

    static async totalActive_datacount(){
        const [result] = await pool.execute(
            `SELECT COUNT(id) AS tc FROM data_table
            WHERE active_status = 'active'`
        )
        return result[0]
    }

    static async total_inactive_datacount(){
        const [result] = await pool.execute(
            `SELECT COUNT(id) AS tc FROM data_table
            WHERE active_status = 'inactive'`
        )
        return result[0]
    }


    static async viewallData(){
        const [result] = await pool.execute(
            `SELECT * FROM data_table`
        )
        return result
    }

    static async Add_data(network,plan,duration,amount,zd_price,data_id, networkID,variation_Code){
        const [result] = await pool.execute(
            `INSERT INTO data_table(network,plan,duration,amount,zd_price,data_id, networkID,variation_Code) 
            VALUES(?,?,?,?,?,?,?,?)`,
            [
                network,plan,duration,amount,zd_price,data_id, networkID,variation_Code
            ]
        )
        return result
    }

    static async disable_data(id){
        const [rolls] = await pool.execute(
            `UPDATE data_table
            SET active_status = 'inactive'
            WHERE id =?`,
            [
                id
            ]
        )
        return rolls[0]
    }

    static async enable_data(id){
        const [rolls] = await pool.execute(
            `UPDATE data_table
            SET active_status = 'active'
            WHERE id =?`,
            [
                id
            ]
        )
        return rolls[0]
    }







    ///////////////////////////////////
    static async totalairtimecount(){
        const [result] = await pool.execute(
            `SELECT COUNT(id) AS tc FROM airtime_table`
        )
        return result[0]
    }

    static async totalActive_airtimecount(){
        const [result] = await pool.execute(
            `SELECT COUNT(id) AS tc FROM airtime_table
            WHERE active_status = 'active'`
        )
        return result[0]
    }

    static async total_inactive_airtimecount(){
        const [result] = await pool.execute(
            `SELECT COUNT(id) AS tc FROM airtime_table
            WHERE active_status = 'inactive'`
        )
        return result[0]
    }


    static async viewallAirtime(){
        const [result] = await pool.execute(
            `SELECT * FROM airtime_table`
        )
        return result
    }

    static async Add_airtime(amount,network,networkID){
        const [result] = await pool.execute(
            `INSERT INTO airtime_table(amount,network,networkID) 
            VALUES(?,?,?)`,
            [
                amount,network,networkID
            ]
        )
        return result
    }

    static async disable_airtime(id){
        const [rolls] = await pool.execute(
            `UPDATE airtime_table
            SET active_status = 'inactive'
            WHERE id =?`,
            [
                id
            ]
        )
        return rolls[0]
    }

    static async enable_airtime(id){
        const [rolls] = await pool.execute(
            `UPDATE airtime_table
            SET active_status = 'active'
            WHERE id =?`,
            [
                id
            ]
        )
        return rolls[0]
    }

    static async edit_airtime(amount, network, networkID, id){
        const [result] = await pool.execute(
            `UPDATE airtime_table
            SET amount = ?, network =?,  networkID = ?
            WHERE id = ?`,
            [
                amount, network, networkID, id
            ]
        )
        return result
    }

    static async airtime_by_id(id){
        const [rolls] = await pool.execute(
                `SELECT * FROM airtime_table
                WHERE id = ?`,
                [
                    id
                ]
        )
        return rolls[0]
    }


    static async edit_data(network,plan,duration,amount,zd_price,data_id, networkID,variation_Code,id){
        const [result] = await pool.execute(
            `UPDATE data_table
            SET network = ?, plan =?,  duration = ?, amount = ?, zd_price = ?, data_id= ?,networkID =? , variation_Code = ?
            WHERE id = ?`,
            [
                network,plan,duration,amount,zd_price,data_id, networkID,variation_Code,id
            ]
        )
        return result
    }

    static async data_by_id(id){
        const [rolls] = await pool.execute(
                `SELECT * FROM data_table
                WHERE id = ?`,
                [
                    id
                ]
        )
        return rolls[0]
    }


    static async getvtpassAirtimePendingTransactions(){
        const [result] = await pool.execute(
            `SELECT * FROM txn_table 
            WHERE status = 'pending' AND ser_type = 'airtime'
            ORDER BY id ASC
            LIMIT 10`
        )
        return result
    }

    static async getvtpassDataPendingTransactions(){
        const [result] = await pool.execute(
            `SELECT * FROM txn_table 
            WHERE status = 'pending' AND ser_type = 'data'
            ORDER BY id ASC
            LIMIT 10`
        )
        return result
    }

    static async getvtpassEletricPendingTransactions(){
        const [result] = await pool.execute(
            `SELECT * FROM txn_table 
            WHERE status = 'pending' AND ser_type = 'eletricity'
            ORDER BY id ASC
            LIMIT 10`
        )
        return result
    }

    static async Discount(discount, ref_id){
        const [result] = await pool.execute(
            `UPDATE txn_table
            SET discount = ?
            WHERE ref_id = ?`,
            [
                discount,ref_id
            ]
        )
        return result
    }


    static async User_profit(user_profit, ref_id){
        const [result] = await pool.execute(
            `UPDATE txn_table
            SET user_profit =?
            WHERE ref_id = ?`,
            [
                user_profit, ref_id
            ]
        )
        return result
    }

    static async Cashback( cashback,cash_back, userId){
        const [result] = await pool.execute(
            `UPDATE myusers
            SET cashBack = cashBack + ?, total_cb = total_cb + ?
            WHERE id = ?`,
            [
                cashback,cash_back, userId
            ]
        )
        return result
    }

    
}

module.exports = admin_model_flow