const express = require("express");
const multer = require("multer");
const router = express.Router();
const {
    productList,
    addProduct,
    changeProductPrice,
    addProductSoldAmount,
    addProductStock,
    checkOutProduct,
    findProduct,
    getTotalProductSold,
    getTotalStock,
} = require("../src/product");

const verifyToken = require("../middleware/verify");

const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, './uploads/');
    },
    filename: (req, file, cb) => {
        cb(null, Date.now() + '-' + file.originalname);
    }
});
const upload = multer({ storage: storage });

router.get("/", verifyToken, async (req, res) => {
    try {
        const response = await productList();
        res.status(response.status).json(response);
    } catch (error) {
        res.status(500).json({ status: 500, message: "Internal server error" });
    }
});

router.post("/add", upload.single('file'), async (req, res) => {
    const { name, description, price, stock } = req.body;
    const file = req.file.filename;
    try {
        const response = await addProduct(name, description, price, stock, file);
        res.status(response.status).json({ status: 201, message: "Product added successfully" });
    } catch (error) {
        res.status(500).json({ status: 500, message: "Internal server error" });
    }
});

router.put("/:id/price", verifyToken, async (req, res) => {
    const productId = req.params.id;
    const { newPrice } = req.body;
    try {
        const response = await changeProductPrice(productId, newPrice);
        res.status(response.status).json(response);
    } catch (error) {
        res.status(500).json({ status: 500, message: "Internal server error" });
    }
});

router.put("/:id/sold", verifyToken, async (req, res) => {
    const productId = req.params.id;
    const { amount } = req.body;
    try {
        const response = await addProductSoldAmount(productId, amount);
        res.status(response.status).json(response);
    } catch (error) {
        res.status(500).json({ status: 500, message: "Internal server error" });
    }
});

router.put("/:id/stock", verifyToken, async (req, res) => {
    const productId = req.params.id;
    const { amount } = req.body;
    try {
        const response = await addProductStock(productId, amount);
        res.status(response.status).json(response);
    } catch (error) {
        res.status(500).json({ status: 500, message: "Internal server error" });
    }
});

router.post("/:id/checkout", verifyToken, async (req, res) => {
    const productId = req.params.id;
    const { userid, amount } = req.body;
    try {
        const response = await checkOutProduct(userid, productId, amount);
        res.status(response.status).json(response);
    } catch (error) {
        res.status(500).json({ status: 500, message: "Internal server error" });
    }
});

router.get("/find/:name", verifyToken, async (req, res) =>{
    const productName = req.params.name;
    try {
        const response = await findProduct(productName);
        res.status(response.status).json(response);
    } catch(error){
        res.status(500).json({ status: 500, message: "Internal server error"})
    } 
    
})

router.get("/totalsold", verifyToken, async (req, res) =>{
    try{
        const response = await getTotalProductSold();
        res.status(response.status).json(response);
    }catch(error){
        res.status(500).json({ status: 500, message: "Internal server error"})
    }
})

router.get("/totalstock", verifyToken, async (req, res) =>{
    try{
        const response = await getTotalStock();
        res.status(response.status).json(response);
    }catch(error){
        res.status(500).json({ status: 500, message: "Internal server error"})
    }
})

module.exports = router;
