const express = require("express");
const verifyToken = require("../middleware/verify");
const { addWishList, deleteWishList, showUserWishList, buyAllWishList } = require("../src/wishlist");
const router = express.Router();

router.get("/show/:id", verifyToken, async (req, res) =>{
    const userid = req.params.id;
    try{
        const response = await showUserWishList(userid);
        return res.status(response.status).json(response);
    }catch(error){
        console.log(error);
        res.status(500).json({status: 500, message: error.message});
    }
})

router.post("/add/:id", verifyToken, async (req, res) =>{
    const userid = req.params.id;
    const { productid, amount } = req.body;
    try{
        const response = await addWishList(userid, productid, amount);
        return res.status(response.status).json(response);
    }catch(error){
        console.log(error);
        res.status(500).json({status: 500, message: error.message});
    }
})

router.post("/buy/:id", verifyToken, async (req, res) =>{
    const userid = req.params.id;
    try{
        const response = await buyAllWishList(userid);
        return res.status(response.status).json(response);
    }catch(error){
        console.log(error);
        res.status(500).json({status: 500, message: error.message});
    }
})

router.delete("/delete/:id", verifyToken, async (req, res) =>{
    const userid = req.params.id;
    const { productid } = req.body;
    try{
        const response = await deleteWishList(userid, productid);
        return res.status(response.status).json(response);
    }catch(error){
        console.log(error);
        res.status(500).json({status: 500, message: error.message});
    }
})

module.exports = router;