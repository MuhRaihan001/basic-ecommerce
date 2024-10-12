const { executeQuery } = require("./query/sql");

async function showProductReview(productid){
    const query = "SELECT * FROM `ratings` WHERE productid = ?";
    try{
        const result = await executeQuery(query, [productid]);
        if(result.length > 0){
            return {status: 200, message: "review showed successfully", review: result};
        }else{
            return {status: 404, message: "review not found"};
        }
    }catch(error){
        console.log(error);
        throw error;
    }
}

async function giveReview(productid, name, star, review) {
    const query = "INSERT INTO `ratings` (`productid`, `name`, `star`, `review`) VALUES (?, ?, ?, ?)";
    try{
        await executeQuery(query, [productid, name, star, review]);
        return {status: 201, message: "review added successfully"};
    }catch(error){
        console.log(error);
        throw error;
    }
}

module.exports = { giveReview, showProductReview }