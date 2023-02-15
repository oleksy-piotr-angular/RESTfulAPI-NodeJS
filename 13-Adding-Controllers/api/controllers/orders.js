const mongoose = require('mongoose'); // Import Mongoose to create object_ID in new orders

const Order = require('../models/order'); // import Order Schema defined with mongooseSchema
const Product = require('../models/product'); // import Product schema to use it and make sure that product exists in your Order


//Below we Export Expressions with arrow function to handle all "Orders" "Requests" in "Routes"


exports.orders_get_all = (req, res, next) => {
    Order.find() /* return all documents with 'Order' schema */
      .select(
        'product quantity _id'
      ) /* select which properties would you like to show in response */
      .populate(
        'product',
        'name' /* pass only Product name */
      ) /* Populate in Mongoose is used to enhance one-to-many or many-to-one data relationships in MongoDB. The populate() method allows developers to simply refer to a document inside a different collection to another document’s field that resides in a different field. */
      .exec() /* turn into a real Promise */
      .then((docs) => {
        //below this is a form of object which would you like pass into response
        res.status(200).json({
          count: docs.length,
          orders: docs.map((doc) => {
            // we map it here to get individual document of whole list
            return {
              // return each document in response with this form
              _id: doc._id,
              product: doc.product,
              quantity: doc.quantity,
              request: {
                //set metadata inside this response
                type: 'GET',
                url: 'http://localhost:5000/orders/' + doc._id,
              },
            };
          }),
        }); // set a response if success
      }) /* If Success */
      .catch((err) => {
        res.status(500).json({
          error: err,
        });
      }); /* If  some Errors */
  };

  exports.orders_create_order = (req, res, next) => {
    Product.findById(
      req.body.productId
    ) /* First we looking for product if Exists thanks Mongoose Schema in /models */
      .then(
        /* Here we execute everything if Success and Product was found then continue with creating a new Object with found information 'product' */
        (product) => {
          if (!product) {
            //we set this condition if Product will be return empty if not exist
            return res.status(404).json({
              // if we send this response then we get out from this method immediately
              message: 'Product not found',
            });
          }
          //below we create Object 'order' from 'Order' Mongoose Schema with expected data which we receive in information from body because we have 'body-parser' and parse body requests to JSON
          const order = new Order({
            _id: mongoose.Types.ObjectId(), // we generate unique Id for orders
            quantity: req.body.quantity, // set quantity into object which we receive from body request
            product: req.body.productId, // set productId as a relation with products in Orders
          });
          return order.save(); /* save product Into MongoDB method and pass  'result' to next 'then method' with 'return' operator */
        }
      )
      .then((result) => {
        //make a response with received result from 'then()' method above
        console.log(result);
        //below The HTTP "201" Created success status response
        res.status(201).json({
          // if we succeeded we want to send this message
          message: 'Order stored',
          createdOrder: {
            // send information about created Order
            _id: result._id,
            product: result.product,
            quantity: result.quantity,
          },
          request: {
            //send metadata inside this response
            type: 'GET',
            url: 'http://localhost:5000/orders/' + result._id,
          },
        });
      })
      .catch((err) => {
        /* if Product was not found then return  Error */
        res.status(500).json({
          message: 'Product not found',
          error: err,
        }); // if we send this response then we get out from this method immediately
      });
  };

  exports.orders_get_order = (req, res, next) => {
    Order.findById(
      req.params.orderId
    ) /* seeking order thanks created Mongoose Schema in /models */
      .populate(
        'product' /* pass all data of Product */
      ) /* Populate in Mongoose is used to enhance one-to-many or many-to-one data relationships 
    .exec() /* turn into a real Promise */
      .then((order) => {
        if (!order) {
          // if order not exist then send message not found
          return res.status(404).json({
            message: 'Order not found',
          });
        }
        /* Success if we found and send a response which we type below */
        res.status(200).json({
          order: order, //we set here 'order' which we pass thanks Mongoose above
          request: {
            //send metadata inside this response
            type: 'GET',
            description: 'Below link to whole order list',
            url: 'http://localhost:5000/orders/',
          },
        });
      })
      .catch((err) => {
        res.status(500).json({
          // we send a Error response with Code Server Error
          error: err,
        });
      });
  };

  exports.order_delete_order = (req, res, next) => {
    const id = req.params.orderId; // extract Id from params of request and pass it to variable
    Order.deleteOne({ _id: id })
      .exec() /* turn into a real Promise */
      .then((result) => {
        res.status(200).json({
          message: 'Order was deleted', //we pass info here
          request: {
            //send metadata inside this response
            type: 'POST',
            description: 'If we would like to create a new Order',
            url: 'http://localhost:5000/orders/',
            body: {
              //we send a constructor here in respond how it looks like
              productId: 'ID',
              quantity: 'Number',
            },
          },
        });
      }) /*Above Success if we found, remove then we send a response in this method */
      .catch((err) => {
        res.status(500).json({
          // we send a Error response with Code Server Error
          error: err,
        });
      });
  };