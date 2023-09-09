const rateLimit = require("express-rate-limit");

const loginLimiter = rateLimit({
    windowMs: 10 * 1000, // 10 second
    max: 5,
    message: {
        message: "Too many login attemts from this IP, please try again after 10 second pause"
    },
    handler: (req, res, next, options) => {
        res.status(options.statusCode).send(options.message);
    },
    standardHeaders: true,
    legacyHeaders: false,
})

module.exports = loginLimiter