const express = require('express'); //To include the express module and help manage servers and routes.
var app = express(); //this method will execute an express application where we can use whole utility and methods from there

const productRoutes = require('./api/routes/products');
const orderRoutes = require('./api/routes/order');

app.use('/products', productRoutes);// we set (/products) as a filter for incoming request and the be handle with second argument (productRoutes)
app.use('/orders', orderRoutes);// we set here next Route to Receive another request (/orders) 

module.exports = app;
