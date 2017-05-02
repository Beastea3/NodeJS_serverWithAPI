var api = require('./routes/api');
var express = require('express');
var path = require('path');
var favicon = require('static-favicon');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
var register = require('./routes/register');
//var auth = require('basic-auth');
var messages = require('./lib/messages');
var methodOverride = require('method-override');
var session = require('express-session')

var routes = require('./routes/index');
var users = require('./routes/users');
var login = require('./routes/login');
var user = require('./lib/middleware/user');
var userdata = require('./routes/userdata');


var app = express();

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');
//app.use('/api', api.auth);
app.use(favicon());
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded());
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));
app.use(methodOverride());
app.use(cookieParser('Your secret here'));
app.set('trust proxy', 1) // trust first proxy
app.use(session({
  secret: 'keyboard cat',
  resave: true,
  saveUninitialized: true,
  cookie: { secure: true }
}));
app.use(user);
app.use(messages);
app.get('/login', login.form);
app.post('/login', login.submit);
app.post('/api/login',api.login);
app.get('/logout', login.logout);
app.get('/datamysql', userdata.show);
//app.get('/datamysql/archived', userdata.showArchived);

app.get('/', routes);
app.get('/hello', routes.hello);
app.use('/users', users);
//app.use('/data',datamysql);
app.get('/api/user/:id', api.user);
app.post('/api/user/:name/temp', api.entriesTemp);
app.post('/api/user/:name', api.entries);
app.post('/api/user/:name/search', api.search);
//app.post('/api/test',api.test);
app.get('/u/:user', function(req, res) {
    res.send('user: ' + req.params.username);
});
app.get('/register', register.form);
app.get('/userdata/:id/search', userdata.searchForm);
app.get('/userdata/:id/search/0', userdata.show);
app.get('/userdata/:id/search/:nPage', userdata.search);
app.get('/userdata/:id', userdata.show);
app.get('/userdata/:id/add', userdata.addForm);
app.post('/userdata/:id/add', userdata.add);
app.post('/register', register.submit);
app.post('/api/register',api.register);
//app.post('/userdata/:id', userdata.add);
//app.post('/datamysql/archive', userdata.archive);
app.post('/userdata/:id/delete', userdata.delete);

/*
app.get('/reg',routes.reg);
app.post('/reg',routes.doReg);
app.get('/login',routes.login);
app.post('/login',routes.doLogin);
app.get('/logout',routes.logout);
*/

/// catch 404 and forwarding to error handler
app.use(function(req, res, next) {
    var err = new Error('Not Found');
    err.status = 404;
    next(err);
});

/// error handlers

// development error handler
// will print stacktrace
if (app.get('env') === 'development') {
    app.use(function(err, req, res, next) {
        res.status(err.status || 500);
        res.render('error', {
            message: err.message,
            error: err
        });
    });
}

// production error handler
// no stacktraces leaked to user
app.use(function(err, req, res, next) {
    res.status(err.status || 500);
    res.render('error', {
        message: err.message,
        error: {}
    });
});


module.exports = app;
