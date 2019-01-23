var mongoose = require('mongoose');
var schema = mongoose.Schema;

/*The schema for the database*/
var schema = new schema({
  imagePath: {type: String, required: true},
  title: {type: String, required: true},
  despriction: {type: String, required: true},
  price: {type: Number, required: true},
  make: {type: String, required: true}
});

module.exports = mongoose.model('Product', schema);
