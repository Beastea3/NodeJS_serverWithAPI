var User = require('../lib/user');
var mysqlQuery=require("../lib/mysql.js");
var mysqlQueryTemp=require("../lib/mysqlTemp");
// render to the page
exports.form = function(req, res) {
	res.render('login', {title: 'Login'});
};
// autenticate the acount and create a table if not exist
exports.submit = function(req, res, next){
  var data = req.body.user;
  User.authenticate(data.name, data.pass, function(err, user){
    if (err) return next(err);
    if (user) {
      var id = user.id;
      req.session.uid = user.id;
      mysqlQueryTemp(
      "CREATE TABLE IF NOT EXISTS ?? ("
    + "No INT(10) NOT NULL AUTO_INCREMENT,"
    + "value FLOAT(3) DEFAULT 0, "
    + "time DATETIME(6), "
    + "value2 CHAR(1) DEFAULT 0,"
    + "PRIMARY KEY(No),"
    + "UNIQUE KEY(time))",
    [id],
    function(err,results,fields) {
       if (err) throw err;
    });
      mysqlQuery(
        "CREATE TABLE IF NOT EXISTS ?? ("
    + "No INT(10) NOT NULL AUTO_INCREMENT,"
    + "value FLOAT DEFAULT 0, "
    + "time DATETIME(6), "
    + "value2 CHAR(1) DEFAULT 0,"
    + "PRIMARY KEY(No),"
    + "UNIQUE KEY(time))",
    [id],
    function(err, results, fields) {
      if (err) throw err;
      /*html = (showArchived)
        ? ''
        : '<a href="/archived">Archived Work</a><br/>';*/
      res.redirect('/userdata/' + user.id);
      //res.send(results);
    }
  );

    } else {
      res.error("Sorry! invalid credentials.");
      res.redirect('back');
    }
  });
};


exports.logout = function(req, res){
  req.session.destroy(function(err) {
    if (err) throw err;
    res.redirect('/');
  });
};
