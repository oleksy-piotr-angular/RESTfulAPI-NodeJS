const express = require('express'); //To include the express module and help manage servers and routes.
var app = express(); //this method will execute an express application where we can use whole utility and methods from there
const morgan = require('morgan'); //HTTP request logger middleware for node.js
const bodyParser = require('body-parser'); // Using body-parser allows you to access req.body from within routes and use that data.
const mongoose = require('mongoose'); // Mongoose is a MongoDB object modeling tool designed to work in an asynchronous environment. Mongoose supports Node.js

/** NOTE: if NODEMON is not close and you cannot run nodemon again use:
 * "pkill -f nodemon"
 * in terminal
 */

const productRoutes = require('./api/routes/products');
const orderRoutes = require('./api/routes/order');

mongoose.set('strictQuery', false);//[MONGOOSE] DeprecationWarning: Mongoose: the `strictQuery` option will be switched back to `false` by default in Mongoose 7
mongoose.connect(
'mongodb+srv://node-shop:'+process.env.MONGO_ATLAS_PASS+'@node-shop.pt8c4sm.mongodb.net/?retryWrites=true&w=majority'/* ,
  { useMongoClient: true }  [mongoose 5+ doesn't require useMongoClient anymore.]*/
); // connect with path from MongoDB Atlas Page| Recommended way for using Mongoose when we use MongoDB version 4.3 for Node

//below before we reach some route[CORS] we need to catch any request to prevent CORS-ERRORS [Cross Origin Resource Sharing] = when we get requests from another Ports than server has
app.use((req, res, next) => {
  res.header('Access-Control-Allow-Origin', '*'); //we give here an access to any origin |RESTful|
  /* res.header("Access-Control-Allow-Origin", "http://page.com"); //we give here an access only to  "http://page.com" */
  res.header(
    'Access-Control-Allow-Headers',
    'Origin, X-Requested-With, Content-Type, Accept, Authorization'
  ); //here we set which kind of headers we want to accept
  if (req.method === 'OPTIONS') {
    //if request method is 'OPTION' then we set what kind of requests we want to allow
    res.header('Access-Control-Allow-Methods', 'PUT, POST, PATCH, DELETE, GET');
    //above we tell the browser what he may send
    return res.status(200).json({});
  }
  next(); // if we do not use this method here then we block other incoming Requests
}); //here we append the headers to any response we send back and add 'next()' to not block other incoming Requests

//below we use it to get some logs when we use 'nodemon' to see info about requests
app.use(morgan('dev')); // set format we want to use on output
//below we use body-parer to pars 'urlencoded'
app.use(bodyParser.urlencoded({ extended: false })); //only simple bodies for 'urlencoded' data
app.use(bodyParser.json()); //basically tells the system that you want json to be used.

// Routes which should handle requests
app.use('/products', productRoutes); // we set (/products) as a filter for incoming request and the be handle with second argument (productRoutes)
app.use('/orders', orderRoutes); // we set here next Route to Receive another request (/orders)

//handling ERRORS for Requests
app.use((req, res, next) => {
  const error = new Error('Not Found'); // Create Error Object
  error.status = 404; // Set status for this object
  next(error); //forward this  error  request instead of the original essentially
}); //this method will catch all requests if reaches this line and in this situation will send error request errors

app.use((error, req, res, next) => {
  res.status(error.status || 500); //here we assign status to this response
  res.json({
    error: {
      message: error.message,
    }, //create JSON object which we send as a response
  });
}); //This method will catch all kinds of errors and sen as a response

module.exports = app;