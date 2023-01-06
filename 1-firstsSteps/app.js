const express = require("express"); //To include the express module and help manage server and routes.
var app = express(); //this method will execute an express application where we can use whole utility and methods from there
app.use((req, res, next) => {
  res.status(200).json({
    message: "It works",
  }); // to make sure that we RECEIVE a response
});

module.exports = app;
