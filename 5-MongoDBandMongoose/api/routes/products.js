/*eslint-env es6*/
const express = require("express"); //To include the express module and help manage server and routes.
const router = express.Router(); //Routing refers to how an application’s endpoints (URIs) respond to client requests
const mongoose = require("mongoose"); // Import Mongoose to create object_ID in new products
const { updateOne } = require("../models/product");
const product = require("../models/product");

const Product = require("../models/product"); //Import Product Schema

// below this method will be handle Incoming GET request | because this route will be handle with filter (/products)  in app.js we cannot add subsequent filter here again
router.get("/", (req, res, next) => {
  Product.find() //we looking for documents with this schema
    .exec() // exec() function returns a promise, that you can use it with then()
    .then((docs) => {
      console.log(docs);

      // below we send to Response all docs which Mongoose Return from MongoDB
      //      if(docs >= 0){
      res.status(200).json(docs);
      /*       }else{
        res.status(404).json({
          message: 'No Entries found'
        })
      } */
    })
    .catch((err) => {
      console.log(err);
      // below if we capture an error then send JSON response with error info
      res.status(500).json({
        error: err,
      });
    });
});

// below this method will be handle Incoming POST request |
router.post("/", (req, res, next) => {
  const product = new Product({
    _id: new mongoose.Types.ObjectId(), // we Create special MongoDB "objectId"
    name: req.body.name,
    price: req.body.price,
  }); // we expect to receive those information from body because we have 'body-parser' and parse body requests to JSON
  product
    .save()
    .then((result) => {
      console.log(result); // print result on browser console
      //below to prove that data was saved correctly we send response
      res.status(201).json({
        message: "Handling POST request to /products",
        createdProduct: result,
      }); //response JSON
    })
    .catch((err) => {
      console.log(err); // catch potential errors
      //below we send an error response if it occurs
      res.status(500).json({
        error: err,
      });
    });
  /**
   * save() - special(which we can use on Mongoose Models) method from Mongoose to save data into
   * MongoDB
   * then() - The then() method in JavaScript has been defined in the Promise API and is used to deal with asynchronous tasks such as an API call.
   * catch() - let us to capture/intercept errors if they will happen
   *  */
});

// below this method will be handle Incoming GET request with Params |
router.get("/:productId", (req, res, next) => {
  const id = req.params.productId; // extract Id from params of request and pass it to variable
  product
    .findById(id) // this is MongoDB/Mongoose method to find a a Document
    .exec() // exec() function returns a promise, that you can use it with then()
    .then((doc) => {
      //The then() method in JavaScript has been defined in the Promise API and is used to deal with asynchronous tasks such as an API call.
      console.log("From MongoDB: ", doc);
      if (doc) {
        res.status(200).json(doc); // we need to type response here because we 'then()' take  'callback' functions and returns as a 'promise'
      } else {
        res
          .status(404)
          .json({ message: "No valid entry found for provided ID" });
        // above if ID has an proper form but document will be not found then our Response would be return 'null' but instead we want to send 'message' above.
      }
    })
    .catch((err) => {
      console.log(err);
      res.status(500).json(err);
    });
});

// below this method will be handle Incoming PATCH request with Params |
router.patch("/:productId", (req, res, next) => {
  const id = req.params.productId; // extract Id from params of request and pass it to variable
  const updateOps = {}; // here we create an object which be fill we properties to change(name or price or both)

  for (const ops of req.body) {
    updateOps[ops.propName] = ops.value; // here we add an property with value to this object with parameters from body request [updateOs == update Operations]
  }

  Product.updateOne({ _id: id }, { $set: updateOps }) // send an object with properties which we would like to change
    .exec() // treat as a Promise
    .then((result) => {
      // if is Ok then send a Response with Results
      console.log(result);
      res.status(200).json(result);
    })
    .catch((err) => {
      // if is not Ok then send a Response with Error
      console.log(err);
      res.status(500).json({
        error: err,
      });
    });
});

// below this method will be handle Incoming DELETE request with Params |
router.delete("/:productId", (req, res, next) => {
  const id = req.params.productId; // extract Id from params of request and pass it to variable
  Product.deleteOne(
    {
      _id: id,
    } /* we use 'remove()' method according to Schema form we remove document with this ID */
  )
    .exec() //exec() function create a real promise, that you can use it with then()
    .then((result) => {
      //The then() method in JavaScript has been defined in the Promise API and is used to deal with asynchronous tasks such as an API call.
      console.log(result);
      // below if remove will be done correctly we sen a response
      res.status(200).json(result);
    })
    .catch((err) => {
      console.log(err);
      res.status(500).json({
        error: err,
      });
    });
});

module.exports = router;
