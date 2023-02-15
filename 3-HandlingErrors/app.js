const express = require('express'); //To include the express module and help manage servers and routes.
var app = express(); //this method will execute an express application where we can use whole utility and methods from there
const morgan = require('morgan'); //HTTP request logger middleware for node.js 

const productRoutes = require('./api/routes/products');
const orderRoutes = require('./api/routes/order');

//below we use it to get some logs when we use 'nodemon' to see info about requests
app.use(morgan('dev'));// set format we want to use on output

// Routes which should handle requests
app.use('/products', productRoutes);// we set (/products) as a filter for incoming request and the be handle with second argument (productRoutes)
app.use('/orders', orderRoutes);// we set here next Route to Receive another request (/orders) 

//handling ERRORS for Requests
app.use((req, res, next) => {
  const error = new Error('Not Found');// Create Error Object
  error.status = 404;// Set status for this object
  next(error);//forward this  error  request instead of the original essentially

});//this method will catch all requests if reaches this line and in this situation will send error request errors

app.use((error, req, res, next) =>{
  res.status(error.status || 500);//here we assign status to this response
  res.json({
    error:{
      message: error.message
    }//create JSON object which we send as a response
  });
});//This method will catch all kinds of errors and sen as a response


module.exports = app;
