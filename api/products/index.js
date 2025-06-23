const getPool = require('../shared/db');

module.exports = async function (context, req) {
    const pool = await getPool();
    const result = await pool.request().query('SELECT * FROM Products');
    context.res = { status: 200, body: result.recordset };
};