const express = require("express");
const router = express.Router();
const jwt = require("jsonwebtoken");
const {
    loginUsername, 
    createAccount,  
    refundUserMoney
} = require("../src/user");

require("dotenv").config();
const verifyToken = require('../middleware/verify');

router.post("/register", async (req, res) => {
    const { username, email, password } = req.body;
    try{
        const response = await createAccount(username, email, password);
        res.status(response.status).json(response);
    }catch(error){
        console.log(error);
        res.status(500).json({ message: "Internal Server Error" });
        
    }
});

router.post("/login", async (req, res) => {
    const { username, password } = req.body;
    try{
        const response = await loginUsername(username, password);
        if (response.status === 401) {
            return res.status(response.status).json(response);
        }
        const token = jwt.sign({id: response.account[0].id, username: response.account[0].username}, process.env.SECRET_KEY, {expiresIn: "1d"});
        res.status(response.status).json({...response, token});
    }catch (error){
        console.log(error);
        res.status(500).json({ message: "Internal Server Error" });
    }
});

router.post("/reffund", verifyToken,  async (req, res) =>{
    const { id, productid } = req.body;
    try{
        const response = await refundUserMoney(id, productid);
        res.status(response.status).json(response);
    }catch(error){
        console.log(error);
        res.status(500).json({ message: "Internal Server Error" });
    }
})

module.exports = router;