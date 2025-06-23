const getPool = require('../shared/db');

module.exports = async function (context, req) {
    const id = context.bindingData.id;
    const pool = await getPool();
    const result = await pool.request()
        .input('id', id)
        .query('SELECT * FROM Products WHERE ProductId = @id');
    if (result.recordset.length === 0) {
        context.res = { status: 404, body: "Not found" };
    } else {
        context.res = { status: 200, body: result.recordset[0] };
    }
};