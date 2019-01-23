var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var addressSchema = new Schema({
  street: {type: String, required: true},
  city: {type: String, required: true},
  zip: {type: Number, required: true},
  country: {type: String, required: true}
});

var orderSchema = new Schema({
  user: {type: Schema.Types.ObjectId, ref: 'User'},
  cart: {type: Object, required: true},
  address: [addressSchema],
  dateAndTime: {type : Date, default: Date.now},
  name: {type: String, required: true}
});

module.exports = mongoose.model('Orders', orderSchema);
