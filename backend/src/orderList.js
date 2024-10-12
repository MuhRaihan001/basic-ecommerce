const { executeQuery } = require("./query/sql");
const { loginUsername } = require("./user");

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

module.exports = { addOrderList, showUserOrderList };