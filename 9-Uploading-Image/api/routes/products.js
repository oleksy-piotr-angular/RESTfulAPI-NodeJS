/*eslint-env es6*/
const { on } = require('events');
const express = require('express'); //To include the express module and help manage server and routes.
const router = express.Router(); //Routing refers to how an application’s endpoints (URIs) respond to client requests
const mongoose = require('mongoose'); // Import Mongoose to create object_ID in new products
const multer = require('multer'); //Require Multer Package to implement

//below we define storage strategy
const storageDef = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, './uploads/'); // execute callback and pass potential error and destination path
  },
  filename: function (req, file, cb) {
    cb(null, new Date().toISOString() + file.originalname); // execute callback and pass potential error and define the name of upload file
  },
});
/* cb -> callback */

/* below we define a filter to incoming Files */
const fileFilterDef = (req, file, callback) => {
  //reject if file extensive is incorrect
  if (
    file.mimetype === 'image/jpeg' ||
    file.mimetype === 'image/jpg' ||
    file.mimetype === 'image/png'
  ) {
    //pass a file
    callback(null, true);
  } else {
    callback(null, false);
  }
};

/* below we set in 'limits' LIMIT for file Size */
const upload = multer({
  storage: storageDef,
  limits: {
    fileSize: 1024 * 1024 * 5,
  },
  fileFilter: fileFilterDef,
}); // we executer multer() thanks this variable | basically initialize and pass a configuration (specify a Information for Multer how he should try try to store incoming files)

const Product = require('../models/product'); //Import Product Schema

// below this method will be handle Incoming GET request | because this route will be handle with filter (/products)  in app.js we cannot add subsequent filter here again
router.get('/', (req, res, next) => {
  Product.find() /* we looking for documents with this schema */
    .select(
      'name price _id productImage'
    ) /* we chose which fields we would like to select */
    .exec() /*  exec() function returns a promise, that you can use it with then() */
    .then((docs) => {
      const response = {
        count: docs.length,
        products: docs.map((doc) => {
          return {
            // we set here our construction of document which we return thanks 'map()'method
            name: doc.name,
            price: doc.price,
            _id: doc._id,
            productImage: doc.productImage,
            request: {
              // we return additional metadata in object to each element of document
              type: 'GET',
              url: 'http://localhost:5000/products/' + doc._id,
            },
          };
        }), // when we set 'select()' above we return list with all documents with those properties
      };
      console.log(docs);

      // below we send to Response all docs which Mongoose Return from MongoDB
      //      if(docs >= 0){
      res.status(200).json(response);
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
router.post(
  '/',
  upload.single(
    'productImage'
  ) /* try to parse only one file with Multer with specified name */,
  (req, res, next) => {
    console.log(req.file);
    const product = new Product({
      _id: new mongoose.Types.ObjectId(), // we Create special MongoDB "objectId"
      name: req.body.name,
      price: req.body.price,
      productImage: req.file.path, /* thanks Multer property we can set URL */
    }); // we expect to receive those information from body because we have 'body-parser' and parse body requests to JSON
    product
      .save()
      .then((result) => {
        console.log(result); // print result on browser console
        //below to prove that data was saved correctly we send response
        res.status(201).json({
          message: 'Created product successfully',
          createdProduct: {
            // we set here what we would like to send in response inside this object when we create/save a product
            name: result.name,
            price: result.price,
            _id: result._id,
            request: {
              // we return additional metadata in object to each element of document
              type: 'GET',
              url: 'http://localhost:5000/products/' + result._id,
            },
          },
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
  }
);

// below this method will be handle Incoming GET request with Params | :productId
router.get('/:productId', (req, res, next) => {
  const id = req.params.productId; // extract Id from params of request and pass it to variable
  Product.findById(
    id
  ) /*  this is MongoDB/Mongoose method to find a a Document */
    .select(
      'name price _id productImage'
    ) /*  set Data which we would like to take from singular document */
    .exec() /*  exec() function returns a promise, that you can use it with then() */
    .then((doc) => {
      //The then() method in JavaScript has been defined in the Promise API and is used to deal with asynchronous tasks such as an API call.
      console.log('From MongoDB database: ', doc);
      if (doc) {
        res.status(200).json({
          product: doc,
          request: {
            //attach additional data inside this object into this request
            type: 'GET',
            description: 'Get all products URL',
            url: 'http://localhost:5000/products/',
          },
        }); // we need to type response here because we 'then()' take  'callback' functions and returns as a 'promise'
      } else {
        res
          .status(404)
          .json({ message: 'No valid entry found for provided ID' });
        // above if ID has an proper form but document will be not found then our Response would be return 'null' but instead we want to send 'message' above.
      }
    })
    .catch((err) => {
      console.log(err);
      res.status(500).json(err);
    });
});

// below this method will be handle Incoming PATCH request with Params |
router.patch('/:productId', (req, res, next) => {
  const id = req.params.productId; // extract Id from params of request and pass it to variable
  const updateOps = {}; // here we create an object which be fill we properties to change(name or price or both)

  for (const ops of req.body) {
    updateOps[ops.propName] = ops.value; // here we add an property with value to this object with parameters from body request [updateOs == update Operations]
  }

  Product.updateOne({ _id: id }, { $set: updateOps }) // send an object with properties which we would like to change
    .exec() // treat as a Promise
    .then((result) => {
      // if is Ok then send a Response with Results
      res.status(200).json({
        message: 'Product updated',
        request: {
          //attach additional data inside this object into this request
          type: 'GET',
          url: 'http://localhost:5000/products/' + id,
        },
      });
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
router.delete('/:productId', (req, res, next) => {
  const id = req.params.productId; // extract Id from params of request and pass it to variable
  Product.deleteOne(
    {
      _id: id,
    } /* we use 'deleteOne' method according to Schema form we remove document with this ID */
  )
    .exec() /* exec() function create a real promise, that you can use it with then() */
    .then((result) => {
      /* The then() method in JavaScript has been defined in the Promise API and is used to deal with asynchronous tasks such as an API call. */
      console.log(result);
      // below if remove will be done correctly we sen a response
      res.status(200).json({
        message: 'Product has been deleted',
        request: {
          //attach additional data inside this object into this request
          type: 'POST',
          description: 'If you would like to add new Product',
          url: 'http://localhost:5000/products/',
          body: { name: 'String', price: 'Number' },
        },
      });
    })
    .catch((err) => {
      console.log(err);
      res.status(500).json({
        error: err,
      });
    });
});

module.exports = router;
