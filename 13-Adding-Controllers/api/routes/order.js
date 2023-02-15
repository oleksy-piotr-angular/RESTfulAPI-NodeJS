/*eslint-env es6*/
const express = require('express'); //To include the express module and help manage server and routes.
const router = express.Router(); //Routing refers to how an application’s endpoints (URIs) respond to client requests
const checkAuth = require('../middleware/check-auth'); // import middleware function to authenticate some actions in requests

const OrdersController = require('../controllers/orders'); // take all Expressions (Controllers) with arrow function to use it when we handle Requests below 

/** NOTES
 *  - we use "checkAuth" function to authorize this request if someone is logIn an want to Post
 *   some Orders
 */

//handle incoming GET requests to /orders
router.get(
  '/',
  checkAuth /*this is function which checks when we logged in and have a token and we pass it into this request then wee can do this authorization properly */,
  OrdersController.orders_get_all
);

//handle incoming POST requests to /orders and create new document with relation
router.post(
  '/',
  checkAuth /*this is function which checks when we logged in and have a token and we pass it into this request then wee can do this authorization properly */,
  OrdersController.orders_create_order /* use Expression (Controller) instead whole anonymous arrow function */
);

//handle incoming GET requests to /orders with parameter ":orderId"
router.get(
  '/:orderId',
  checkAuth /*this is function which checks when we logged in and have a token and we pass it into this request then wee can do this authorization properly */,
  OrdersController.orders_get_order /* use Expression (Controller) instead whole anonymous arrow function */
);

//handle incoming DELETE requests to /orders to remove one document with parameter ":orderId"
router.delete(
  '/:orderId',
  checkAuth /*this is function which checks when we logged in and have a token and we pass it into this request then wee can do this authorization properly */,
  OrdersController.order_delete_order /* use Expression (Controller) instead whole anonymous arrow function */
);

module.exports = router;
