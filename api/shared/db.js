// Azure Function SQL connection helper (using mssql)
const sql = require('mssql');

const config = {
    user: process.env.DB_USER,
    password: process.env.DB_PASS,
    server: process.env.DB_SERVER, // e.g. "your-server.database.windows.net"
    database: process.env.DB_NAME,
    options: {
        encrypt: true
    }
};

let pool = null;

module.exports = async function getPool() {
    if (pool) return pool;
    pool = await sql.connect(config);
    return pool;
};