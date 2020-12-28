const express = require('express');
const bodyParser = require('body-parser'); 
const errorHandler = require('./middleware/error');
const app = express();

//Route files
const userRoute =require('./routes/user');

app.use(bodyParser.json());

//Mount Routers
app.use('/api/v1/auth', userRoute);
app.use(errorHandler);

const port = 3000;
const server = app.listen(port, 
    console.log(`Server running in port ${port}`));

module.exports = app;