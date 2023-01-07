/*eslint-env es6*/
const express = require("express"); //To include the express module and help manage server and routes.
const router = express.Router(); //Routing refers to how an application’s endpoints (URIs) respond to client requests

// below this method will be handle Incoming GET request | because this route will be handle with filter (/products)  in app.js we cannot add subsequent filter here again
router.get("/", (req, res, next) => {
  res.status(200).json({
    message: "here we handle GET request to /products",
  });
});

// below this method will be handle Incoming POST request |
router.post("/", (req, res, next) => {
  const product = {
    name: req.body.name,
    price: req.body.price
  };// we expect to receive those information from body because we have 'body-parser' and parse body requests to JSON
  res.status(201).json({
    message: "here we handle POST request to /products",
    createdProduct: product
  });//response JSON
});

// below this method will be handle Incoming GET request with Params |
router.get("/:productId", (req, res, next) => {
  const id = req.params.productId; // extract Id from params of request and pass it to variable
  if (id === "special") {
    res.status(200).json({
      message: "Now you see the content with Special ID",
      id: id,
    });
  } else {
    res.status(200).json({
      message: "Now you passed some ID",
    });
  }
});

// below this method will be handle Incoming PATCH request with Params |
router.patch("/:productId", (req, res, next) => {
  const id = req.params.productId; // extract Id from params of request and pass it to variable
  if (id === "special") {
    res.status(200).json({
      message: "Updated Product",
      id: id,
    });
  } else {
    res.status(200).json({
      message: "None product has been updated",
    });
  }
});

// below this method will be handle Incoming DELETE request with Params |
router.delete("/:productId", (req, res, next) => {
  const id = req.params.productId; // extract Id from params of request and pass it to variable
  if (id === "special") {
    res.status(200).json({
      message: "Deleted product",
      id: id,
    });
  } else {
    res.status(200).json({
      message: "No product has been deleted",
    });
  }
});

module.exports = router;
