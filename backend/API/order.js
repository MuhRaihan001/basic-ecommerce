const express = require("express");
const verifyToken = require("../middleware/verify");
const route = express.Router();
const {
    addOrderList,
    showUserOrderList
} = require("../src/orderList");

route.get("/:id", verifyToken, async (req, res) =>{
    const id = req.params.id;
    try{
        const orderList = await showUserOrderList(id);
        res.status(orderList.status).json(orderList);
    }catch(error){
        res.status(500).json({status: 500, message: error.message});
    }
});

route.post("/add", verifyToken, async (req, res) =>{
    const {userid, productid, date} = req.body;
    try{
        const orderList = await addOrderList(userid, productid, date, "Pending");
        res.status(orderList.status).json(orderList);
    }catch(error){
        res.status(500).json({status: 500, message: error.message});
    }
})

module.exports = route;