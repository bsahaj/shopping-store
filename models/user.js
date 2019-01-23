var mongoose = require('mongoose');
var Schema = mongoose.Schema;
var bcrypt = require('bcrypt-nodejs');

var userAddressSchema = new Schema({
  street: {type: String, required: true},
  city: {type: String, required: true},
  zip: {type: Number, required: true},
  country: {type: String, required: true}
});

var userSchema = new Schema({
  email: {type: String, required: true},
  password: {type: String, required: true},
  userAddress: [userAddressSchema]
});

userSchema.methods.encryptPassword = function(password){
  return bcrypt.hashSync(password, bcrypt.genSaltSync(5), null);
};

userSchema.methods.validPassword = function(password){
  return bcrypt.compareSync(password, this.password);
};

module.exports = mongoose.model('Users', userSchema);
