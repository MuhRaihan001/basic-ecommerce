const { executeQuery } = require("./query/sql");
const { loginUsername, refundUserMoney } = require("./user");

async function showUserOrderList(userid){
    const query = `SELECT * FROM orders WHERE userid = ?`;
    try{
        const result = await executeQuery(query, [userid]);
        return { status: 200, message: "success send user order list", list: result};
    }catch(error){
        console.log(error);
        throw error;
    }
}

async function addOrderList(userid, productid, orderdate, status){
    const query = "INSERT INTO orders (userid, productid, orderdate, status) VALUES (?, ?, ?, ?)";
    try{
        await executeQuery(query, [userid, productid, orderdate, status]);
        return { status: 200, message: "success add order list" };
    }catch(error){
        console.log(error);
        throw error;
    }
}

async function deleteOrder(orderid, userid){
    try{
        if(!orderid || !userid){
            return { status: 400, message: "invalid orderid or userid" };
        }

        const query = "SELECT * FROM `orders` WHERE `id` = ? AND `userid` = ?";
        const result = await executeQuery(query, [orderid, userid]);

        if(result.length === 0){
            return { status: 404, message: "order not found" };
        }

        const deleteQuery = "DELETE FROM `orders` WHERE `id` = ? AND `userid` = ?";
        await executeQuery(deleteQuery, [orderid, userid]);
        refundUserMoney(userid, result[0].productid);
        return { status: 200, message: "success delete order" };

    }catch(error){
        console.log(error);
        throw error;
    }
}

module.exports = { addOrderList, showUserOrderList, deleteOrder };