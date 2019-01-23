var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');
var expressHbs = require('express-handlebars');
var mongoose = require('mongoose');
var session = require('express-session');
var passport = require('passport');
var flash = require('connect-flash');
var validator = require('express-validator');
var MongoStore = require('connect-mongo')(session);

var indexRouter = require('./routes/index');
var usersRouter = require('./routes/users');
var companyRouter = require('./routes/company');
var cartRouter = require('./routes/cart');

var bodyParser = require('body-parser');

var app = express();

mongoose.connect('mongodb://localhost:27017/shoppingDB', { useNewUrlParser: true });
require('./config/passport');
// view engine setup
//app.set('views', path.join(__dirname, 'views'));
app.engine('.hbs', expressHbs({defaultLayout: 'layout', extname: '.hbs'}));
app.set('view engine', '.hbs');
/* MIDDLEWARE */
app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(validator());
app.use(cookieParser());
app.use(session({
  secret: 'mysecret',
  resave: false,
  saveUninitialized: false,
  store: new MongoStore({
    mongooseConnection: mongoose.connectoin,
    url: 'mongodb://localhost:27017/shoppingDB'
  }),
  cookie: {maxAge: 180 * 60 * 1000} //REDUCE THE NUMBER TO TEST
  }));
app.use(flash());
app.use(passport.initialize());
app.use(passport.session());

app.use(bodyParser.urlencoded({extended: true}));

app.use(express.static(path.join(__dirname, 'public')));

app.use(function(req, res, next){
  res.locals.login = req.isAuthenticated();
  res.locals.session = req.session;
  next();
});

app.use('/cart', cartRouter);
app.use('/user', usersRouter);
app.use('/company', companyRouter);
app.use('/', indexRouter);

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  next(createError(404));
});

// error handler
app.use(function(err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render('error');
});

module.exports = app;
