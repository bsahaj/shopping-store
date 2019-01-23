var express = require('express');
var router = express.Router();
var Cart = require('../models/cart');
var Product = require('../models/product'); //creating an object to store data
var mongoose = require('mongoose');

mongoose.connect('mongodb://localhost:27017/shoppingDB', { useNewUrlParser: true });

/* GET home page. */
router.get('/', function(req, res, next) {
  Product.find(function(error, docs) {
    var productChunks = [];
    var cols = 3; //because there should only be 3 columns in a row
    for (var i = 0; i < docs.length; i += cols) {
      productChunks.push(docs.slice(i, i + cols)); //pushing 1-3 then 4-7 in array
    }
    res.render('index', {
      title: 'Shopping Store',
      products: productChunks
    });
  });
});

router.post('/products', function(req, res, next){
    var product = new Product();
    product.imagePath = req.body.productImagePath;
    product.title = req.body.productName;
    product.despriction = req.body.productDis;
    product.price = req.body.productPrice;
    product.make = req.user.companyName;
    product.save()
      .then(item => {
        res.redirect('/');
      })
      .catch(err => {
        res.render('company/companyproducts', {messages: err});
      });
    // res.redirect('/');
});

module.exports = router;
