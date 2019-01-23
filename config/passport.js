var passport = require('passport');
var User = require('../models/user');
var Company = require('../models/company');
var LocalStrategy = require('passport-local').Strategy;

function SessionConstructor(userId, userGroup) {
    this.userId = userId;
    this.userGroup = userGroup;
}

passport.serializeUser(function (userObject, done) {
    // userObject could be a Model1 or a Model2... or Model3, Model4, etc.
    var userGroup = "User";
    var userPrototype =  Object.getPrototypeOf(userObject);

    if (userPrototype === User.prototype) {
        userGroup = "User";
    } else if (userPrototype === Company.prototype) {
        userGroup = "Company";
    }

    var sessionConstructor = new SessionConstructor(userObject.id, userGroup);
    done(null,sessionConstructor);
});

passport.deserializeUser(function (sessionConstructor, done) {

    if (sessionConstructor.userGroup == 'User') {
        User.findOne({
            _id: sessionConstructor.userId
        }, '-localStrategy.password', function (err, user) { // When using string syntax, prefixing a path with - will flag that path as excluded.
            done(err, user);
        });
    } else if (sessionConstructor.userGroup == 'Company') {
        Company.findOne({
            _id: sessionConstructor.userId
        }, '-localStrategy.password', function (err, user) { // When using string syntax, prefixing a path with - will flag that path as excluded.
            done(err, user);
        });
    }

});

// passport.serializeUser(function(user, done) {
//   done(null, user.id);
// });
// //
// passport.deserializeUser(function(id, done) {
//   //ORIGINAL CODE
//     // Company.findById(id, function(error, user) {
//     //   done(error, user);
//     // });
//     User.findById(id, function(error, user) {
//       done(error, user);
//     });
// });


passport.use('user-signup', new LocalStrategy({
  usernameField: 'email',
  passwordField: 'password',
  passReqToCallback: true
}, function(req, email, password, done) {
  req.checkBody('password', 'Invalid password').notEmpty().len(3, 15);
  var errors = req.validationErrors();
  if (errors) {
    var messages = [];
    errors.forEach(message.push(error.msg));
    return done(null, false, req.flash('error', messages));
  }
  User.findOne({
    'email': email
  }, function(error, user) {
    if (error) {
      return done(error);
    }
    if (user) {
      return done(null, false, {
        message: req.flash('error', 'Email in use.')
      });
    }
    var newUser = new User();
    newUser.email = email;
    newUser.password = newUser.encryptPassword(password);
    newUser.userAddress = [{
      street: req.body.street,
      city: req.body.city,
      zip: req.body.zip,
      country: req.body.country
    }];
    newUser.save(function(error, result) {
      if (error) {
        return done(error);
      }
      return done(null, newUser);
    });
  });
}));

passport.use('user-signin', new LocalStrategy({
  usernameField: 'email',
  passwordField: 'password',
  passReqToCallback: true
}, function(req, email, password, done) {
  req.checkBody('email', 'Invalid email').notEmpty().isEmail();
  req.checkBody('password', 'password').notEmpty();
  var errors = req.validationErrors();
  if (errors) {
    var messages = [];
    errors.forEach(message.push(error.msg));
    return done(null, false, req.flash('error', messages));
  }
  User.findOne({
    'email': email
  }, function(error, user) {
    if (error) {
      return done(error);
    }
    if (!user) {
      return done(null, false, {
        message: req.flash('error', 'No user found.')
      });
    }
    if (!user.validPassword(password)) {
      return done(null, false, {
        message: req.flash('error', 'Invalid password')
      });
    }
    return done(null, user);
  });
}));

passport.use('company-signin', new LocalStrategy({
  usernameField: 'email',
  passwordField: 'password',
  passReqToCallback: true
}, function(req, email, password, done) {
  req.checkBody('email', 'Invalid email').notEmpty().isEmail();
  req.checkBody('password', 'password').notEmpty();
  var errors = req.validationErrors();
  if (errors) {
    var messages = [];
    errors.forEach(message.push(error.msg));
    return done(null, false, req.flash('error', messages));
  }
  Company.findOne({
    'email': email
  }, function(error, user) {
    if (error) {
      return done(error);
    }
    if (!user) {
      return done(null, false, {
        message: req.flash('error', 'No user found.')
      });
    }
    if (!user.validPassword(password)) {
      return done(null, false, {
        message: req.flash('error', 'Invalid password')
      });
    }
    return done(null, user);
  });
}));

passport.use('company-signup', new LocalStrategy({
  usernameField: 'email',
  passwordField: 'password',
  passReqToCallback: true
}, function(req, email, password, done) {
  req.checkBody('password', 'Invalid password').notEmpty().len(3, 15);
  var errors = req.validationErrors();
  if (errors) {
    var messages = [];
    errors.forEach(message.push(error.msg));
    return done(null, false, req.flash('error', messages));
  }
  Company.findOne({
    'email': email
  }, function(error, user) {
    if (error) {
      return done(error);
    }
    if (user) {
      return done(null, false, {
        message: req.flash('error', 'Email in use.')
      });
    }
    var newCompany = new Company();
    newCompany.email = email;
    newCompany.password = newCompany.encryptPassword(password);
    newCompany.companyName = req.body.companyName;
    newCompany.companyCode = req.body.companyCode;
    newCompany.companyAddress = [{
      street: req.body.street,
      city: req.body.city,
      zip: req.body.zip,
      country: req.body.country
    }];
    newCompany.save(function(error, result) {
      if (error) {
        return done(error);
      }
      return done(null, newCompany);
    });
  });
}));
