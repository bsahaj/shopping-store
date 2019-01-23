var mongoose = require('mongoose');
var Schema = mongoose.Schema;
var bcrypt = require('bcrypt-nodejs');

var companyAddressSchema = new Schema({
  street: {type: String, required: true},
  city: {type: String, required: true},
  zip: {type: Number, required: true},
  country: {type: String, required: true}
});

var companySchema = new Schema({
  companyName: {type: String, required: true},
  companyCode: {type: Number, required: true},
  email: {type: String, required: true},
  password: {type: String, required: true},
  companyAddress: [companyAddressSchema]
});

companySchema.methods.encryptPassword = function(password){
  return bcrypt.hashSync(password, bcrypt.genSaltSync(5), null);
};

companySchema.methods.validPassword = function(password){
  return bcrypt.compareSync(password, this.password);
};

module.exports = mongoose.model('Companies', companySchema);
