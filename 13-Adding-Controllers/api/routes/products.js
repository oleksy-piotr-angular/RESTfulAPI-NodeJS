/*eslint-env es6*/
const { on } = require('events');
const express = require('express'); //To include the express module and help manage server and routes.
const router = express.Router(); //Routing refers to how an application’s endpoints (URIs) respond to client requests
const multer = require('multer'); //Require Multer Package to implement
const checkAuth = require('../middleware/check-auth'); // import middleware function to authenticate some actions in requests
const ProductsController = require('../controllers/products'); // take all Expressions (Controllers) with arrow function to use it when we handle Requests below

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

// below this method will be handle Incoming GET request | because this route will be handle with filter (/products)  in app.js we cannot add subsequent filter/path here again
router.get(
  '/',
  ProductsController.products_get_all /* use Expression (Controller) instead whole anonymous arrow function */
);

// below this method will be handle Incoming POST request
/** NOTES
 *  - we use "checkAuth" function to authorize this request if someone is logIn an want to Post some Product
 *  - upload.single will parse form Data (because we add file) and extract file for each request so we need to use auth function after this method after parsing because it was not populated before | but when we set 'token' to the Header then we can first authorize this request before 'parsing' then our method do not save our image which 'upload.single' method will do on each request
 */
router.post(
  '/',
  checkAuth /*this is function which checks when we logged in and have a token and we pass it into this request then wee can do this authorization properly */,
  upload.single(
    'productImage'
  ) /* try to parse only one file with Multer with specified name */,
  ProductsController.products_create_product /* use Expression (Controller) instead whole anonymous arrow function */
);

// below this method will be handle Incoming GET request with Params | :productId
router.get('/:productId', ProductsController.products_get_product);

// below this method will be handle Incoming PATCH request with Params |
router.patch(
  '/:productId',
  checkAuth /*this is function which checks when when we logged in and have a token and we pass it into this request then wee can do this authorization properly */,
  ProductsController.products_update_product /* use Expression (Controller) instead whole anonymous arrow function */
);

// below this method will be handle Incoming DELETE request with Params |
router.delete(
  '/:productId',
  checkAuth /*this is function which checks when we logged in and have a token and we pass it into this request then wee can do this authorization properly */,
  ProductsController.products_delete /* use Expression (Controller) instead whole anonymous arrow function */
);

module.exports = router;
