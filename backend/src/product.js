const { executeQuery } = require("./query/sql");
const { getUserMoney, setUserMoney } = require("./user");
async function productList(){
    try{
        const query = "SELECT * FROM `product`";
        const result = await executeQuery(query);
        return {status: 200, message: "Product list sent to client successfully", list: result};
    }catch(error){
        throw error;
    }
}

async function addProduct(name, description, price, stock, fileName){
    try{
        const query = "INSERT INTO `product` (`name`, `description`, `price`, `stock`, `image`) VALUES (?, ?, ?, ?, ?)";
        const result = await executeQuery(query, [name, description, price, stock, fileName]);
        return {status: 201, message: "Product added successfully", insertId: result.insertId};
    }catch(error){
        throw error;
    }
}
async function findProduct(name){
    try{
        const query = "SELECT * FROM `product` WHERE `name` LIKE ?";
        const result = await executeQuery(query, [`%${name}%`]);
        if(result.length > 0){
            return {status: 200, message: "Product found successfully", product: result[0]};
        }
        return {status: 404, message: "Product not found"};
        
    }catch(error){
        throw error;
    }
}

async function changeProductPrice(productId, newPrice){
    try{
        const query = "UPDATE `product` SET `price` = ? WHERE `id` = ?";
        await executeQuery(query, [newPrice, productId]);
        return {status: 200, message: "Product price changed successfully"};
    }catch(error){
        throw error;
    }
}

async function addProductSoldAmount(productId, amount){
    try{
        const query = "UPDATE `product` SET `sold` = `sold` + ? WHERE `id` = ?";
        await executeQuery(query, [amount, productId]);
        return {status: 201, message: "Product sold amount updated"};
    }catch(error){
        throw error;
    }
}

async function addProductStock(productId, amount){
    try{
        const query = "UPDATE `product` SET `stock` = `stock` + ? WHERE `id` = ?";
        await executeQuery(query, [amount, productId]);
        return {status: 201, message: "Stock added successfully"};
    }catch(error){
        throw error;
    }
}

async function checkOutProduct(userId, productId, amount) {
    try{
        const query = "SELECT * FROM `product` WHERE `id` = ?";
        const result = await executeQuery(query, [productId]);

        if(result.length === 0){
            return { status: 404, message: "Product not found" };
        }

        const product = result[0];

        if (product.stock < amount){
            return { status: 409, message: "Insufficient stock of goods" };
        }

        const userMoney = await getUserMoney(userId);
        const totalCost = product.price * amount;

        if(userMoney < totalCost){
            return { status: 402, message: "Insufficient funds" };
        }

        const newMoney = userMoney - totalCost;
        await setUserMoney(userId, newMoney);

        const updateStockQuery = "UPDATE `product` SET `stock` = `stock` - ? WHERE `id` = ?";
        await executeQuery(updateStockQuery, [amount, productId]);

        const updateSoldQuery = "UPDATE `product` SET `sold` = `sold` + ? WHERE `id` = ?";
        await executeQuery(updateSoldQuery, [amount, productId]);

        return { status: 200, message: "Product checked out successfully" };
        
    }catch(error){
        throw error;
    }
}


async function getTotalProductSold(){
    try{
        const query = "SELECT SUM(sold) AS total_sold FROM product";
        const result = await executeQuery(query);
        return {status: 200, message: "total sold product sended succesfully", result: result};
    }catch(error){
        console.log(error);
        throw error;
    }
}

async function getTotalStock(){
    try{
        const query = "SELECT SUM(stock) AS total_stock FROM product";
        const result = await executeQuery(query);
        return {status: 200, message: "total sold product sended succesfully", result: result};
    }catch(error){
        console.log(error);
        throw error;
    }
}


module.exports = {
    productList,
    addProduct, 
    findProduct, 
    changeProductPrice, 
    addProductSoldAmount, 
    addProductStock, 
    checkOutProduct,
    getTotalProductSold,
    getTotalStock
};
