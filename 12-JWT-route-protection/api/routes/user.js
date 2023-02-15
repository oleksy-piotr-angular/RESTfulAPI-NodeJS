/*eslint-env es6*/
const express = require('express'); //To include the express module and help manage server and routes.
const router = express.Router(); //Routing refers to how an application’s endpoints (URIs) respond to client requests
const mongoose = require('mongoose'); // Import Mongoose to create object_ID in new orders
const bcrypt = require('bcrypt'); //Add bcrypt to password encryption
const jwt = require('jsonwebtoken'); // Add JWT to keep information between client and server(token will be save in MongoDB but will be overwrite each time that user will be login [we use it because session are not possible in this API because RESTful API is stateless]) that someone is log in

const User = require('../models/user'); // import User Schema defined with mongooseSchema

router.post('/signup', (req, res, next) => {
  const saltRound = 10; //  the cost factor. The cost factor controls how much time is needed to calculate a single BCrypt hash. The higher the cost factor, the more hashing rounds are done

  User.find({ email: req.body.email }) /* check if email not exist in storage */
    .exec() /* thanks this method we can use Promise methods */
    .then((user) => {
      /* our Request Success with no Errors */
      if (user.length >= 1) {
        /* we alway get a result with Array so we need to check if Array has Some elements | email found and not create a User */
        //(HTTP) 422 Unprocessable Entity response status code indicates that the server understands the content type of the request entity, and the syntax of the request entity is correct, but it was unable to process the contained instructions
        return res.status(422).json({
          message: 'Cannot create - mail exists in storage',
        });
      } else {
        /* email not found | can create new account */
        bcrypt.hash(req.body.password, saltRound, (err, hash) => {
          if (err) {
            // if get some error when hash try then send it instead creating User
            return res.status(500).json({
              error: err,
            });
          } else {
            //hash done properly, we can create User account
            const user = new User({
              _id: mongoose.Types.ObjectId(), // we generate unique Id for orders
              email: req.body.email,
              password: hash,
            });
            user
              .save() // Mongoose method to store account into MongoDB
              .then((result) => {
                console.log(result);
                res.status(201).json({
                  message: 'User created',
                });
              })
              .catch((err) => {
                // catch an error if something goes wrong
                console.log(err);
                res.status(500).json({
                  error: err,
                });
              });
          }
        });
      }
    });
});

router.post('/login', (req, res, next) => {
  User.find({ email: req.body.email })
    .exec()
    .then((user) => {
      if (user.length < 1) {
        /*above in response we always get an Array so we check length if user was found */
        /*NOTE**
         * HTTP 404 means response successful but cannot found resource or file
         * HTTP 401 means  Unauthorized response status code indicates that the client request has
         * not been completed because it lacks valid authentication credentials for the requested
         * resource.
         * */

        return res.status(401).json({
          message: 'Auth fail',
        });
      } else {
        // we check if taken password from body and hash from storage compare each other
        bcrypt.compare(req.body.password, user[0].password, (err, result) => {
          if (err) {
            // we get if comparison generally fails | if it was not compared  we not receive this error
            return res.status(401).json({
              message: 'Auth failed',
            });
          }
          if (result) {
            //if we not have an error and hash was compered successfully we log in
            const token = jwt.sign(
              {
                email: user[0].email,
                userId: user[0]._id,
              },
              process.env.JWT_KEY,
              {
                expiresIn: '1h',
              }
            );
            /** above JWT will store encrypted information about Log In Session | create Token
             * process.env.JWT_KEY - is stored in "nodemon.json" file 
             */
            return res.status(200).json({
              message: 'Auth successful',
              sessionToken: token
            });
            //above we return information that log in complete successfully
          }
          res.status(401).json({
            // we respond if password was incorrect
            message: 'Auth failed',
          });
        });
      }
    })
    .catch((err) => {
      // catch an error if something goes wrong
      console.log(err);
      res.status(500).json({
        error: err,
      });
    });
});

router.delete('/:userId', (req, res, next) => {
  User.deleteOne({
    _id: req.params.userId,
  })
    .exec() /* Create a Promise | now we can use promise methods */
    .then((result) => {
      res.status(200).json({
        message: 'User deleted successfully.',
      });
    })
    .catch((err) => {
      // catch an error if something goes wrong
      console.log(err);
      res.status(500).json({
        error: err,
      });
    });
});

module.exports = router;
