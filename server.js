const express = require('express');
const bodyParser = require('body-parser'); 
const dotenv = require('dotenv');
const errorHandler = require('./middleware/error');
const morgan = require('morgan');
const mongoSanitize = require('express-mongo-sanitize');
const helmet = require('helmet');
const xss = require('xss-clean');
const rateLimit = require('express-rate-limit');
const hpp = require('hpp');
const app = express();
const path = require('path');

// Load env vars
dotenv.config({ path: './config/config.env' });

//Route files
const userRoute =require('./routes/user');

//Render API documentation 
app.get('/',(req, res, next)=>{
    res.sendFile(path.join(__dirname+'/public/index.html'));
});

app.use(bodyParser.json());

// Dev logging middleware
if(process.env.NODE_ENV === 'development') {
    app.use(morgan('dev'));
  }
  

//Sanitize data
app.use(mongoSanitize());

//Set Security headers
app.use(helmet());

//Prevent XSS attacks
app.use(xss());

//Rate Limiting (Can make only 100 requests in 10 minutes)
const limiter = rateLimit({
    windowMs: 10 * 60 * 100, //10 minutes
    max: 100
});

app.use(limiter);

//Prevent http param pollution
app.use(hpp());

//Mount Routers
app.use('/api/v1/auth', userRoute);
app.use(errorHandler);

const PORT = 3000;
const server = app.listen(
    PORT, 
    console.log(`Server running in port ${PORT}`));

module.exports = app;