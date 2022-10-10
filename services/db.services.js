const { Pool } = require("pg");
const pool = new Pool({
    user: 'postgres',
    host: 'localhost',
    database: 'postgres',
    password: '1234',
    port: 5433,
});

class DbServices {

    constructor() {
        this.connectDb();
    }

    async connectDb(query) {
        try {
            await pool.connect();
            const res = await pool.query(query);
            // console.log(res.rows);
            // await pool.end();
            return res.rows;
        } catch (error) {
            console.log(error)
        }
    }
}

module.exports = DbServices;