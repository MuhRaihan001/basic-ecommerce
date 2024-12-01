const express = require("express");
const verifyToken = require("../middleware/verify");
const { addWishList, deleteWishList, showUserWishList } = require("../src/wishlist");
const router = express.Router();

router.get("/show/:id", verifyToken, async (req, res) =>{
    const userid = req.params.id;
    try{
        const response = showUserWishList(userid);
        return res.status(200).json(response);
    }catch(error){
        console.log(error);
        res.status(500).json({status: 500, message: error.message});
    }
})

router.post("/add/:id", verifyToken, async (req, res) =>{
    const userid = req.params.id;
    const { productid, amount } = req.body;
    try{
        const response = addWishList(userid, productid, amount);
        return res.status(200).json(response);
    }catch(error){
        console.log(error);
        res.status(500).json({status: 500, message: error.message});
    }
})

router.delete("/delete/:id", verifyToken, async (req, res) =>{
    const userid = req.params.id;
    const { productid } = req.body;
    try{
        const response = deleteWishList(userid, productid);
        return res.status(200).json(response);
    }catch(error){
        console.log(error);
        res.status(500).json({status: 500, message: error.message});
    }
})

module.exports = router;