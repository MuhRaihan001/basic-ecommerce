const { executeQuery } = require("./query/sql");

async function addWishList(userid, productid, amount){
    try{
        const query = 'INSERT INTO `wishlist` (userid, productid, amount) VALUE (?, ?, ?)';
        await executeQuery(query, [userid, productid, amount]);
        return { status: 200, message: "success add product to wishlist"};
    }catch(error){
        console.log(error);
        throw error;
    }
}

async function deleteWishList(userid, productid){
    try{
        const query = 'DELETE FROM `wishlist` WHERE userid = ? AND productid = ?';
        await executeQuery(query, [userid, productid]);
        return { status: 200, message: "success delete product from wishlist"};
    }
    catch(error){
        console.log(error);
        throw error;
    }
}

async function showUserWishList(userid){
    try{
        const query = 'SELECT * FROM `wishlist` WHERE userid = ?';
        const result = await executeQuery(query, [userid]);
        if(result.length === 0){
            return { status: 404, message: "no product in wishlist"};
        }
        return { status: 200, message: "Succesfully send wishlist to client", list: result };
    }catch(error){
        console.log(error);
        throw error;
    }
}

module.exports = {
    addWishList,
    deleteWishList,
    showUserWishList
}