const express = require('express');
const router = express.Router();
const { giveReview, showProductReview } = require('../src/rating');
const verifyToken = require('../middleware/verify');

router.get('/:productid/reviews', async (req, res) => {
    const { productid } = req.params;
    try {
        const result = await showProductReview(productid);
        res.status(result.status).json(result);
    } catch (error) {
        res.status(500).json({ status: 500, message: "Internal Server Error" });
    }
});

router.post('/:productid/reviews', async (req, res) => {
    const { productid } = req.params;
    const { review, star, name } = req.body;

    try {
        const result = await giveReview(productid, name, star, review);
        res.status(result.status).json(result);
    } catch (error) {
        res.status(500).json({ status: 500, message: "Internal Server Error" });
    }
});

module.exports = router;
