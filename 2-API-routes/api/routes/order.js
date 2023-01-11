/*eslint-env es6*/
const express = require("express"); //To include the express module and help manage server and routes.
const router = express.Router(); //Routing refers to how an application’s endpoints (URIs) respond to client requests

router.get('/', (req, res, next) =>{
  res.status(200).json({
    message: 'Orders were fetched'
  });
});

router.post('/', (req, res, next) =>{
  res.status(201).json({//The HTTP "201" Created success status response
    message: 'Order was created'
  });
});

router.get('/:orderId', (req, res, next) =>{
  res.status(200).json({
    message: 'Order was ordered',
    orderId: req.params.orderId
  });
});

router.delete('/:orderId', (req, res, next) =>{
  res.status(200).json({
    message: 'Order was deleted',
    orderId: req.params.orderId
  });
});

module.exports = router;
