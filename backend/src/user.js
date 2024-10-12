const sql = require("../database");
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
    const query = "SELECT * FROM users WHERE username = ?";
    try{
        const user = await executeQuery(query, [username]);
        if(user.length === 0){
            return {status: 401, message: "Invalid username or password"};
        }else{
            const isValidPassword = await bcrypt.compare(password, user[0].password);
            if(isValidPassword){
                return {status: 200, message: "Login successful", account: user};
            }else{
                return {status: 401, message: "Invalid username or password"};
            }
        }
    }catch(error){
        console.error("An error occurred while trying to login:", error);
        throw error;
    }
}

async function loginEmail(email, password){
    const query = "SELECT * FROM users WHERE email = ?";
    try{
        const user = await executeQuery(query, [email]);
        if(user.length > 0){
            const isValidPassword = await bcrypt.compare(password, user[0].password);
            if(isValidPassword){
                return {status: 200, message: "Login successful", account: user};
            }else{
                return {status: 401, message: "Invalid email or password"};
            }
        }else{
            return {status: 401, message: "Invalid email or password"};
        }
    }catch(error){
        console.error("An error occurred while trying to login:", error);
        throw error;
    }
}

module.exports = {loginUsername, createAccount, loginEmail, getUserMoney, setUserMoney};