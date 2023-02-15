//define how a product should look like in Application
const mongoose = require('mongoose');

const productSchema = mongoose.Schema({
  _id: mongoose.Schema.Types.ObjectId, //define ObjectId Type
  name: { type: String, required: true }, //set more configurations to this property in Object
  price: { type: Number, required: true }, //set more configurations to this property in Object
  productImage: {type: String, required: true} // here we keep a URL to uploaded Image
});

module.exports = mongoose.model('Product', productSchema); // here we Export Mongoose Schema with a name(Product)