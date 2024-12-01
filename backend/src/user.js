const bcrypt = require("bcrypt");
const { executeQuery } = require("./query/sql");
require("dotenv").config();

const isUsernameExist = async (username)=>{
    const query = "SELECT * FROM users WHERE username = ?";
    const result = await executeQuery(query, [username]);
    return result.length > 0;
}

const isEmailExist = async (email)=>{
    const query = "SELECT * FROM users WHERE email = ?";
    const result = await executeQuery(query, [email]);
    return result.length > 0;
}

const getUserMoney = async (userid) =>{
    const query = "SELECT money FROM users WHERE id = ?";
    const result = await executeQuery(query, [userid]);
    return result[0].money;
}

const setUserMoney = async (userid, amount) =>{
    const query = "UPDATE users SET money = ? WHERE id = ?";
    await executeQuery(query, [amount, userid]);
}

async function createAccount(username, email, password){
    try{
        if(await isUsernameExist(username) || await isEmailExist(email)){
            return {status: 409, message: "Username or Email already exists"};
        }

        const passwordRegex = /^(?=.*[A-Za-z])(?=.*\d)(?=.*[@$!%*#?&])[A-Za-z\d@$!%*#?&]{8,}$/;
        if (!passwordRegex.test(password)) {
            return { status: 400, message: "Password must be at least 8 characters long and contain letters, numbers, and special characters" };
        }

        const hashedPassword = await bcrypt.hash(password, parseInt(process.env.SALT_ROUND));
        const query = "INSERT INTO users (username, email, password) VALUES (?, ?, ?)";
        await executeQuery(query, [username, email, hashedPassword]);
        return {status: 201, message: "Account created successfully"};
    }catch(error){
        console.error("An error occurred while trying to create account:", error);
        throw error;
    }
}

async function loginUsername(username, password){
    try{
        if(!username || !password){
            return {status: 400, message: "Username and password are required"};
        }
        const query = "SELECT * FROM `users` WHERE `username` = ?";
        const user = await executeQuery(query, [username]);
        if(user.length === 0){
            return {status: 401, message: "Invalid username or password"};
        }
        const isValidPassword = await bcrypt.compare(password, user[0].password);
        if(!isValidPassword){
            return {status: 401, message: "Invalid username or password"};
        }
        return {status: 200, message: "Login successful", account: user, result: user[0]};
    }catch(error){
        console.error("An error occurred while trying to login:", error);
        throw error;
    }
}

async function changePassword(userid, password, newPassword){
    try{
        if(!userid || !password || !newPassword){
            return {status: 400, message: "Missing required fields"};
        }

        const passwordRegex = /^(?=.*[A-Za-z])(?=.*\d)(?=.*[@$!%*#?&])[A-Za-z\d@$!%*#?&]{8,}$/;
        if (!passwordRegex.test(newPassword)) {
            return { status: 400, message: "Password must be at least 8 characters long and contain letters, numbers, and special characters" };
        }

        const query = "SELECT * FROM `users` WHERE `id` = ?";
        const user = await executeQuery(query, [userid]);

        if(user.length === 0){
            return {status: 404, message: "User not found"};
        }

        const isValidPassword = await bcrypt.compare(password, user[0].password);
        if(!isValidPassword){
            return {status: 401, message: "Invalid password"};
        }

        const hashedPassword = await bcrypt.hash(newPassword, parseInt(process.env.SALT_ROUND));
        const newQuery = "UPDATE `users` SET `password` = ? WHERE `id` = ?";

        await executeQuery(newQuery, [hashedPassword, userid]);
        return {status: 200, message: "Password changed successfully"};

    }catch(error){
        console.error("An error occurred while trying to change password:", error);
        throw error;
    }
}

async function changeUsername(userid, password, newUsername){
    try{
        
        if(!userid || !password || !newUsername){
            return {status: 400, message: "Missing required fields"};
        }

        const query = "SELECT * FROM `users` WHERE `id` = ?";
        const user = await executeQuery(query, [userid]);

        if(user.length === 0){
            return {status: 404, message: "User not found"};
        }

        const isValidPassword = await bcrypt.compare(password, user[0].password);
        if(!isValidPassword){
            return {status: 401, message: "Invalid password"};
        }

        if(newUsername.length < 5){
            return {status: 400, message: "Username must be at least 5 characters long"};
        }

        const newQuery = "UPDATE `users` SET `username` = ? WHERE `id` = ?";
        await executeQuery(newQuery, [newUsername, userid]);
        return {status: 200, message: "Username changed successfully"};

    }catch(error){
        console.error("An error occurred while trying to change username:", error);
        throw error;
    }
}

async function refundUserMoney(userid, productid) {
    try{
      let query = "SELECT * FROM `orders` WHERE `userid` = ? AND `productid` = ? AND `status` = ?";
      const order = await executeQuery(query, [userid, productid, "Pending"]);
  
      if(order.length === 0){
        return { status: 404, message: "Order not found" };
      }
  
      query = "SELECT * FROM `product` WHERE `productid` = ?";
      const product = await executeQuery(query, [productid]);
  
      if(product.length === 0){
        return{ status: 404, message: "Product not found" };
      }
  
      const userMoney = await getUserMoney(userid);
      setUserMoney(userMoney - product[0].price);
  
      query = "DELETE FROM `orders` WHERE `userid` = ? AND `productid` = ? AND status = ?";
      await executeQuery(query, [userid, productid, "Pending"]);

      query = "UPDATE `product` SET `stock` ? AND `sold` = ?";
      await executeQuery(query, [product[0].stock + 1, product[0].sold + 1]);
  
      return { status: 200, message: "Refund successful" };
    }catch(error){
      console.error("An error occurred while trying to refund user money:", error);
      throw error;
    }
}

async function changeEmail(userid, password, newEmail){
    try{
        const query = "SELECT * FROM `users` WHERE `id` = ?";
        const user = await executeQuery(query, [userid]);

        if(user.length === 0){
            return { status: 404, message: "User not found" };
        }

        const isValidPassword = await bcrypt.compare(password, user[0].password);
        if(!isValidPassword){
            return {status: 401, message: "Invalid password"};
        }

        const updateQuery = "UPDATE `users` SET `email` = ? WHERE `id` = ?";
        await executeQuery(updateQuery, [newEmail, userid]);
        return { status: 200, message: "Email updated successfully" };
         

    }catch(error){
        console.error("An error occurred while trying to change email:", error);
        throw error;
    }
}

module.exports = {
    loginUsername, 
    createAccount,  
    getUserMoney, 
    setUserMoney, 
    refundUserMoney,
    changeUsername,
    changePassword,
    changeEmail
};