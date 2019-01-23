var Product = require('../models/product');//creating an object to store data
var mongoose = require('mongoose');

mongoose.connect('mongodb://localhost:27017/shoppingDB', { useNewUrlParser: true });

/* data for storing the values in MongoDB*/
var products = [
  new Product({
  imagePath: 'https://www.cstatic-images.com/car-pictures/main/USC50FOC051B021001.png',
  title: '2018 Mustang GT',
  despriction: "The most iconic muscle car to ever grace American dealerships. It comes in a variety of configurations with multiple powerful engine options.",
                //https://cars.usnews.com/cars-trucks/ford-mustang-gt-profile
  price: 40000,
  make: 'Ford'
  }),
  new Product({
    imagePath: 'https://www.gettel.com/assets/stock/colormatched_01/white/640/cc_2018chc020002_01_640/cc_2018chc020002_01_640_gd1.jpg',
    title: '2019 Chevrolet Camaro SS',
    despriction: "The 2019 Chevrolet Camaro finishes in the top half of our sports car rankings. It's athletic and fun to drive, and it has a decent interior . Add it all up, and you've got a well-rounded performance machine.",
                //https://cars.usnews.com/cars-trucks/chevrolet/camaro
    price: 45000,
    make: 'Chevrolet'
  }),
  new Product({
    imagePath: 'https://st.motortrend.com/uploads/sites/5/2018/08/2019-Dodge-Challenger-SRT-Hellcat-Widebody-10.jpg',
    title: '2019 Dodge Challenger',
    despriction: 'The 2019 Dodge Challenger continues to set the bar with its lineup of forceful engines, and its cabin is one of the best in its class. Alongside similar muscle cars, though, this Dodge coupe falls short when it comes to agility. The Challenger finishes in the middle of our sports car ranking.',
    price: 50000,
    make: 'Dodge'
  })
  ];

var flag = 0;
for(var i=0;i<products.length;i++){
  products[i].save(function(error, result){
    flag++;
    if(flag == products.length){
      exit();
    }
  });
}

function exit(){
  mongoose.disconnect();
}
