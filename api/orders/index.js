const getPool = require('../shared/db');

module.exports = async function (context, req) {
    const method = req.method.toLowerCase();
    const userId = req.headers['x-ms-client-principal-id']; // Azure Static Web Apps injects this

    if (method === 'get') {
        // Get user orders
        const pool = await getPool();
        const result = await pool.request()
            .input('userId', userId)
            .query('SELECT * FROM Orders WHERE UserId = @userId');
        context.res = { status: 200, body: result.recordset };
    } else if (method === 'post') {
        // Create order
        const { items } = req.body; // [{productId, quantity, size}]
        const pool = await getPool();
        const orderResult = await pool.request()
            .input('userId', userId)
            .query('INSERT INTO Orders (UserId) OUTPUT INSERTED.OrderId VALUES (@userId)');
        const orderId = orderResult.recordset[0].OrderId;
        for (const item of items) {
            await pool.request()
                .input('OrderId', orderId)
                .input('ProductId', item.productId)
                .input('Quantity', item.quantity)
                .input('UnitPrice', item.unitPrice)
                .input('Size', item.size)
                .query('INSERT INTO OrderItems (OrderId, ProductId, Quantity, UnitPrice, Size) VALUES (@OrderId, @ProductId, @Quantity, @UnitPrice, @Size)');
        }
        context.res = { status: 201, body: { orderId } };
    }
};