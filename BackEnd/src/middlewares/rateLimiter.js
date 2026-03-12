const rateLimit = require('express-rate-limit');

const apiLimiter = rateLimit({
    windowMs: 15 * 60 * 1000, 
    max: 5, 
    message: {
        error: "Too many code reviews requested from this IP. Please try again after 15 minutes to protect API quota."
    },
    standardHeaders: true, 
    legacyHeaders: false, 
});

module.exports = apiLimiter;