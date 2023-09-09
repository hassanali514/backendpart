const express = require("express");
const cors = require("cors");
const app = express();
const cookieParser = require("cookie-parser");
const errorMiddleware = require('./middlewares/error');

if (process.env.NODE_ENV !== 'production') {
    // config
    require("dotenv").config({ path: './config/config.env' });  
}

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

// import routes
const sadmin = require('./routes/superadmin'); 
const admins = require('./routes/admins');
const candidates = require('./routes/candidates');

// use routes
app.use('/api/v1', sadmin);
app.use('/api/v1', admins);
app.use('/api/v1', candidates)

// middleware for error
app.use(errorMiddleware);

module.exports = app;