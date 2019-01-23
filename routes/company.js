var express = require('express');
var router = express.Router();
/* CSRF is used to prevent duplicate sessions, a session cannot be accessed by a false identity*/
var csrf = require('csurf');
var passport = require('passport');
var Product = require('../models/product');

var csrfProtection = csrf();
router.use(csrfProtection);

router.get('/companysignup', function(req, res, next) {
  var messages = req.flash('error');
  res.render('company/companysignup', {
    csrfToken: req.csrfToken(),
    messages: messages
  });
});

router.post('/companysignup', passport.authenticate('company-signup',{
  successRedirect: '/company/companyproducts',
  failureRedirect: '/company/companysignup',
  failureFlash: true
}));

router.get('/companysignin', function(req, res, next){
    var messages = req.flash('error');
  res.render('company/companysignin', {
    csrfToken: req.csrfToken(),
    messages: messages
  });
});

router.post('/companysignin', passport.authenticate('company-signin', {
  successRedirect: '/company/companyprofile',
  failureRedirect: '/company/companysignin',
  failureFlash: true
}));

router.get('/companyprofile', isLoggedIn, function(req, res, next){
  console.log('USER: ' + req.user.companyAddress);
  res.render('company/companyprofile', {
    name: req.user.companyName,
    code: req.user.companyCode,
    street: req.user.companyAddress[0].street,
    city: req.user.companyAddress[0].city,
    zip: req.user.companyAddress[0].zip,
    country: req.user.companyAddress[0].country});
});

router.get('/companyproducts', isLoggedIn, function(req, res, next) {
  res.render('company/companyproducts');
});

module.exports = router;

function isLoggedIn(req, res, next) {
  if (req.isAuthenticated()) {
    return next();
  }
  res.redirect('/company/companysignin');
}

function notLoggedIn(req, res, next) {
  if (!req.isAuthenticated()) {
    return next();
  }
  res.render('/');
}
