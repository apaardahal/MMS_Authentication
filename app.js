const express = require('express');
const bodyParser = require('body-parser'); 

const app = express();

const userRoute =require('./routes/user');

app.use(bodyParser.json());

app.use('/api/v1/auth', userRoute);


module.exports = app;