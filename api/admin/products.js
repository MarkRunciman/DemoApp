const getPool = require('../shared/db');

module.exports = async function (context, req) {
    // Only allow admins (check role claim)
    const roles = (context.bindingData.clientPrincipal && context.bindingData.clientPrincipal.userRoles) || [];
    if (!roles.includes('admin')) {
        context.res = { status: 403, body: "Forbidden" };
        return;
    }
    const method = req.method.toLowerCase();
    const pool = await getPool();

    if (method === 'post') {
        // Add product
        const { name, productNumber, colour, listPrice, size } = req.body;
        await pool.request()
            .input('Name', name)
            .input('ProductNumber', productNumber)
            .input('Colour', colour)
            .input('ListPrice', listPrice)
            .input('Size', size)
            .query('INSERT INTO Products (Name, ProductNumber, Colour, ListPrice, Size) VALUES (@Name, @ProductNumber, @Colour, @ListPrice, @Size)');
        context.res = { status: 201, body: "Created" };
    } else if (method === 'put') {
        // Update product
        const { productId, ...fields } = req.body;
        let setClause = Object.keys(fields).map(f => `${f} = @${f}`).join(', ');
        let request = pool.request().input('ProductId', productId);
        for (const [k, v] of Object.entries(fields)) request.input(k, v);
        await request.query(`UPDATE Products SET ${setClause} WHERE ProductId = @ProductId`);
        context.res = { status: 200, body: "Updated" };
    } else if (method === 'delete') {
        // Delete product
        const { productId } = req.body;
        await pool.request().input('ProductId', productId).query('DELETE FROM Products WHERE ProductId = @ProductId');
        context.res = { status: 200, body: "Deleted" };
    }
};