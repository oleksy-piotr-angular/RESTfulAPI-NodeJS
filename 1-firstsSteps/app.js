const express = require('express');
var app = express();//this method will execute an express aplication where we can use whole utility and methods from there
app.use((req,res,next)=>{
  res.status(200).json({
    message: 'It works'
  });// to make sure that we RECEIVE a response
});

module.exports = app;