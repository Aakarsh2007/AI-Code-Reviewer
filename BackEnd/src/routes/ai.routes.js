const express = require('express');
const aiController = require("../controllers/ai.controller");
const apiLimiter = require("../middlewares/rateLimiter"); 

const router = express.Router();

router.post("/get-review", apiLimiter, aiController.getReview);

router.get("/history", aiController.getHistory);

router.delete("/history/:id", aiController.deleteReview);

module.exports = router;

