//define how a order should look like in Application
const mongoose = require("mongoose");

const orderSchema = mongoose.Schema({
  _id: mongoose.Schema.Types.ObjectId, //define ObjectId Type
  product: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Product",
    required: true,
  }, // build a relation with 'ref: Product' keyword between products and order (which is another model created in API) and this order required productId
  quantity: { type: Number, default: true }, //config property as a Number and default must be 1 if not set
});

module.exports = mongoose.model("Order", orderSchema); // here we Export Mongoose Schema with a name(Order)
