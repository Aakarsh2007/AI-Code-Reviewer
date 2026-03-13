const express = require('express');
const aiController = require("../controllers/ai.controller");
const apiLimiter = require("../middlewares/rateLimiter");
const authMiddleware = require("../middlewares/auth.middleware");

const router = express.Router();

router.post("/get-review", authMiddleware, apiLimiter, aiController.getReview);
router.get("/history", authMiddleware, aiController.getHistory);
router.delete("/history/:id", authMiddleware, aiController.deleteReview);

module.exports = router;