var Company = require('../models/company');
var mongoose = require('mongoose');

mongoose.connect('mongodb://localhost:27017/shoppingDB', { useNewUrlParser: true });

var company = [
  new Company({
    companyName: 'Company 1',
    companyCode: 123,
    companyEmail: 'company1@company.com',
    password: 'asdasd',
    companyAddress: [{
      street: '123 Street',
      city: 'Pullman',
      zip: 12345,
      country: 'USA'
    }]
  })
];


var flag = 0;
for(var i=0;i<company.length;i++){
  company[i].save(function(error, result){
    flag++;
    if(flag == company.length){
      exit();
    }
  });
}

function exit(){
  mongoose.disconnect();
}
