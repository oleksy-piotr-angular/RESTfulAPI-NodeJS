//define how a product should look like in Application
const mongoose = require('mongoose'); 

const productSchema = mongoose.Schema({
  _id: mongoose.Schema.Types.ObjectId, //define ObjectId Type
  name: String,
  price: Number
});

module.exports = mongoose.model('Product', productSchema);// here we Export Mongoose Schema with a name(Product)