var express = require('express');
var router = express.Router();
var Cart = require('../models/cart');
var Product = require('../models/product'); //creating an object to store data
var Order = require('../models/order');
var mongoose = require('mongoose');

mongoose.connect('mongodb://localhost:27017/shoppingDB', { useNewUrlParser: true });

router.get('/shopping-cart', function(req, res, next) {
  if (!req.session.cart) {
    return res.render('cart/shopping-cart', {
      products: null
    });
  }
  var cart = new Cart(req.session.cart);
  return res.render('cart/shopping-cart', {
    products: cart.generateArray(),
    totalPrice: cart.totalPrice
  });
});

router.get('/add-to-cart/:id', function(req, res, next) {
  var productId = req.params.id;
  // //updating the previous session's cart if not setting up a new cart for the session
  var cart = new Cart(req.session.cart ? req.session.cart : {});

  Product.findById(productId, function(err, product) {
    if (err) {
      return res.redirect('/'); //change to show somekind of error message
    }
    cart.add(product, product.id);
    req.session.cart = cart;
    console.log(req.session.cart);
    //console.log('PRODUCT: ' + product);
    res.redirect('/');
  });
});

router.get('/reduce/:id', function(req, res, next) {
  var productId = req.params.id;
  var cart = new Cart(req.session.cart ? req.session.cart : {});

  cart.reduceByOne(productId);
  req.session.cart = cart;
  res.redirect('/cart/shopping-cart');
});

router.get('/addOne/:id', function(req, res, next){
  var productId = req.params.id;
  var cart = new Cart(req.session.cart ? req.session.cart : {});

  cart.addOne(productId);
  req.session.cart = cart;
  res.redirect('/cart/shopping-cart');
});

router.get('/remove/:id', function(req, res, next) {
  var productId = req.params.id;
  var cart = new Cart(req.session.cart ? req.session.cart : {});

  cart.removeAll(productId);
  req.session.cart = cart;
  res.redirect('/cart/shopping-cart');
});

router.get('/checkout', function(req, res, next){
  var cart = new Cart(req.session.cart);
  var address = {
    street: req.user.userAddress[0].street,
    city: req.user.userAddress[0].city,
    zip: req.user.userAddress[0].zip,
    country: req.user.userAddress[0].country
  };
//   console.log('Cart: ' + req.session.cart);
  // console.log('USER: ' + req.user.userAddress[0].street);
  res.render('cart/checkout', {products: cart.generateArray(), price: cart.totalPrice, address: address});
});

router.post('/placeOrder', function(req, res, next){
  var cart = new Cart(req.session.cart);
  var name = req.body.name;
   var order = new Order({
    user: req.user,
    cart: cart,
    address: req.user.userAddress,
    name: name,
    paymentId: 'trial'
  });
  order.save()
    .then(item => {
      req.flash('success', 'Order placed successfully');
      req.session.cart = null;
      res.redirect('/');
    })
    .catch(err => {
      req.flash('failure', 'Order Unsuccessful');
      res.render('/cart/shopping-cart');
    });
  console.log('PLACE ORDER: ' + JSON.stringify(order, null, 2));
  //order.save();
//  req.flash('success', 'Order placed successfully');
});

module.exports = router;
