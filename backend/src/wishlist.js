const { checkOutProduct } = require("./product");
const { executeQuery } = require("./query/sql");

async function addWishList(userid, productid, amount){
    try{
        const query = 'INSERT INTO `wishlist` (userid, productid, amount) VALUE (?, ?, ?)';
        const productQuery = "SELECT * FROM `product` WHERE `id` = ?";
        const product = await executeQuery(productQuery, [productid]);

        if(product.length === 0){
            return { status: 404, message: "Product not found" };
        }

        if(product[0].stock < amount){
            return { status: 409, message: "Insufficient stock of goods" };
        }
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

async function buyAllWishList(userid){
    try{
        const query = "SELECT * FROM `wishlist` WHERE userid = ?";
        const result = await executeQuery(query, [userid]);
        if(result.length === 0){
            return { status: 404, message: "no product in wishlist" };
        }
        
        const checkout = await Promise.all(
            result.map(item =>{
                checkOutProduct(userid, item.productid, item.amount);
            })
        );

        const success = checkout.filter(a => a.status === 200);
        const failed = checkout.filter(a => a.status !== 200);

        return {status: 200, message: "Checkout all wishlist succesfully", list: { success, failed} };


    }catch(error){
        console.log(error);
        throw error;
    }
}

module.exports = {
    addWishList,
    deleteWishList,
    showUserWishList,
    buyAllWishList
}