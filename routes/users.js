var express = require('express');
var router = express.Router();
/* CSRF is used to prevent duplicate sessions, a session cannot be accessed by a false identity*/
var csrf = require('csurf');
var passport = require('passport');
var User = require('../models/user');
var Product = require('../models/product');//creating an object to store data
var Order = require('../models/order');
var Cart = require('../models/cart');
var mongoose = require('mongoose');

mongoose.connect('mongodb://localhost:27017/shoppingDB', { useNewUrlParser: true });

var csrfProtection = csrf();
router.use(csrfProtection);

router.get('/profile', isLoggedIn, function(req, res, next) {
  var address = {
    street: req.user.userAddress[0].street,
    city: req.user.userAddress[0].city,
    zip: req.user.userAddress[0].zip,
    country: req.user.userAddress[0].country
  };
  Order.find({user: req.user}, function(err, orders){
    if(err){
      res.write('Error'); //error handeling
    }
    var cart;
    orders.forEach(function(order){
      cart = new Cart(order.cart);
      order.items = cart.generateArray();
    });
      res.render('user/profile', { email: req.user.email, address: address, orders: orders});
  });
//  res.render('user/profile', { email: req.user.email, address: address});

});

router.get('/logout', function(req, res, next) {
  req.logout();
  res.redirect('/');
});
// router.use('/', notLoggedIn, function(req, res, next) {
//   return next();
// });

/* GET users listing. */
router.get('/signup', function(req, res, next) {
  var messages = req.flash('error');
  res.render('user/signup', {
    csrfToken: req.csrfToken(),
    messages: messages
  });
});

router.post('/signup', passport.authenticate('user-signup', {
  successRedirect: '/user/profile',
  failureRedirect: '/user/signup',
  failureFlash: true
}));

router.get('/signin', function(req, res, next) {
  var messages = req.flash('error');
  res.render('user/signin', {
    csrfToken: req.csrfToken(),
    messages: messages
  });
});

router.post('/signin', passport.authenticate('user-signin', {
  successRedirect: '/user/profile',
  failureRedirect: '/user/signin',
  failureFlash: true
}));

module.exports = router;

function isLoggedIn(req, res, next) {
  if (req.isAuthenticated()) {
    return next();
  }
  res.redirect('/');
}

function notLoggedIn(req, res, next) {
  if (!req.isAuthenticated()) {
    return next();
  }
  res.render('company/companysignin');
}
