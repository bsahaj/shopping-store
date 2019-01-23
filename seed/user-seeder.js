var User = require('../models/user');
var mongoose = require('mongoose');

mongoose.connect('mongodb://localhost:27017/shoppingDB', { useNewUrlParser: true });

var users = [
  new User({
    email: 'sahaj@test.com',
    password: 'asdasd',
    userAddress: [{
      street: '1425 NE Valley Road Apt13',
      city: 'Pullman',
      zip: 99163,
      country: 'USA'
    }]
  })
];

var flag = 0;
for(var i=0;i<users.length;i++){
  users[i].save(function(error, result){
    flag++;
    if(flag == users.length){
      exit();
    }
  });
}

function exit(){
  mongoose.disconnect();
}
